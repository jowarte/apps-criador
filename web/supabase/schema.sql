-- =========================================================================
-- MINEAPPS SAAS MULTI-TENANT & MULTI-PWA — SUPABASE / POSTGRESQL SCHEMA
-- =========================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. TENANTS & PROFILES (Multi-Tenancy & CRM)
CREATE TABLE IF NOT EXISTS public.tenants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    owner_id UUID NOT NULL,
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'trial')),
    branding JSONB DEFAULT '{"primary_color": "#7C3AED", "logo_url": ""}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY, -- matches auth.users.id
    tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(50),
    role VARCHAR(50) DEFAULT 'producer' CHECK (role IN ('super_admin', 'producer', 'end_user')),
    status VARCHAR(50) DEFAULT 'Ativo' CHECK (status IN ('Ativo', 'Trial', 'Vencido', 'Bloqueado')),
    bonus_days INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. APPS (Multi-PWA, Identity, Availability & Custom Domains)
CREATE TABLE IF NOT EXISTS public.apps (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    short_name VARCHAR(50) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    category VARCHAR(100) DEFAULT 'Vendas',
    theme_color VARCHAR(20) DEFAULT '#7C3AED',
    background_color VARCHAR(20) DEFAULT '#FFFFFF',
    display VARCHAR(50) DEFAULT 'standalone',
    icon_192_url TEXT DEFAULT '/icon-192.png',
    icon_512_url TEXT DEFAULT '/icon-512.png',
    status VARCHAR(50) DEFAULT 'Publicado' CHECK (status IN ('Publicado', 'Rascunho', 'Manutenção')),
    available BOOLEAN DEFAULT true, -- Toggle de Disponibilidade em tempo real
    maintenance_message TEXT DEFAULT 'Este aplicativo está em manutenção programada. Voltamos em breve!',
    custom_domain VARCHAR(255) UNIQUE, -- CNAME do produtor
    domain_verified BOOLEAN DEFAULT false,
    ssl_active BOOLEAN DEFAULT false,
    document JSONB NOT NULL DEFAULT '{"pages": []}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. PLANS & TRIAL MATRIX
CREATE TABLE IF NOT EXISTS public.plans (
    id VARCHAR(50) PRIMARY KEY, -- 'free', 'pro', 'premium'
    name VARCHAR(100) NOT NULL,
    price_cents INT NOT NULL DEFAULT 0,
    interval VARCHAR(20) DEFAULT 'month',
    max_apps INT NOT NULL DEFAULT 1,
    trial_days INT NOT NULL DEFAULT 7,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    has_upgrade_trigger BOOLEAN DEFAULT false,
    features JSONB DEFAULT '[]'::jsonb,
    tools_matrix JSONB DEFAULT '{"video_phone": true, "forms": true, "ai": false, "domain": false}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. SUBSCRIPTIONS & INVOICES
CREATE TABLE IF NOT EXISTS public.subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    plan_id VARCHAR(50) REFERENCES public.plans(id),
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('trialing', 'active', 'past_due', 'canceled', 'expired')),
    trial_ends_at TIMESTAMP WITH TIME ZONE,
    current_period_end TIMESTAMP WITH TIME ZONE,
    gateway VARCHAR(50) DEFAULT 'kiwify',
    gateway_sub_id VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.invoices (
    id VARCHAR(50) PRIMARY KEY, -- 'FAT-1042'
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    plan_name VARCHAR(100) NOT NULL,
    amount_cents INT NOT NULL,
    due_date DATE NOT NULL,
    status VARCHAR(50) DEFAULT 'Pendente' CHECK (status IN ('Pago', 'Pendente', 'Vencido')),
    paid_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. ADS & CAMPAIGNS (9:16 VERTICAL VIDEO PLAYER FOR PWAs)
CREATE TABLE IF NOT EXISTS public.campaigns (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    type VARCHAR(50) DEFAULT 'video_9x16' CHECK (type IN ('video_9x16', 'banner', 'popup')),
    video_url TEXT,
    cta_text VARCHAR(100) DEFAULT 'Saiba Mais',
    cta_url TEXT,
    delay_seconds INT DEFAULT 0,
    autoplay BOOLEAN DEFAULT true,
    muted BOOLEAN DEFAULT true,
    loop BOOLEAN DEFAULT false,
    target_plan VARCHAR(50) DEFAULT 'all', -- 'all', 'free', 'pro'
    target_app_id UUID REFERENCES public.apps(id) ON DELETE SET NULL,
    views_count INT DEFAULT 0,
    clicks_count INT DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. AI KEYS (BYOK - PRODUCER & GLOBAL FALLBACK)
CREATE TABLE IF NOT EXISTS public.ai_keys (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    provider VARCHAR(50) NOT NULL, -- 'openai', 'gemini', 'anthropic', 'groq', 'elevenlabs'
    model VARCHAR(100) NOT NULL,
    key_encrypted TEXT NOT NULL,
    is_global_admin BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. WEBHOOKS AUDIT LOG (Kiwify, Stripe, Cakto, Eduzz, Mercado Pago)
CREATE TABLE IF NOT EXISTS public.webhook_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    gateway VARCHAR(50) NOT NULL,
    event_type VARCHAR(100) NOT NULL,
    payload JSONB NOT NULL,
    processed BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Row Level Security (RLS)
ALTER TABLE public.apps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_keys ENABLE ROW LEVEL SECURITY;

-- Initial Seed Data
INSERT INTO public.plans (id, name, price_cents, max_apps, trial_days, description, has_upgrade_trigger, features)
VALUES 
  ('free', 'Free', 0, 1, 7, 'Para testar o MineApps e publicar o primeiro app.', true, '["Editor Drag & Drop", "Templates Básicos", "Analytics"]'),
  ('pro', 'Pro', 9700, 10, 7, 'Para produtores que vendem todos os dias no WhatsApp.', false, '["Editor Drag & Drop", "IA Gerar App", "Domínio CNAME", "Vídeo 9:16", "Hub de Webhooks"]'),
  ('premium', 'Premium', 19700, 999, 7, 'Para agências, infoprodutores e grandes operações.', false, '["PWAs Ilimitados", "BYOK Ilimitado", "Suporte Prioritário", "Todas as Ferramentas"]')
ON CONFLICT (id) DO NOTHING;
