import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const payload = await request.json();

    // Identificação do gateway de pagamento
    const userAgent = request.headers.get("user-agent") || "";
    let gateway = "Kiwify";
    if (userAgent.toLowerCase().includes("hotmart")) gateway = "Hotmart";
    else if (userAgent.toLowerCase().includes("eduzz")) gateway = "Eduzz";
    else if (userAgent.toLowerCase().includes("stripe")) gateway = "Stripe";
    else if (userAgent.toLowerCase().includes("cakto")) gateway = "Cakto";
    else if (userAgent.toLowerCase().includes("mercadopago")) gateway = "Mercado Pago";

    // Extração flexível dos dados do comprador independente do gateway
    const customerName =
      payload.Customer?.full_name ||
      payload.customer?.name ||
      payload.buyer?.name ||
      payload.data?.buyer?.name ||
      payload.name ||
      "Cliente PWA";

    const customerEmail =
      payload.Customer?.email ||
      payload.customer?.email ||
      payload.buyer?.email ||
      payload.data?.buyer?.email ||
      payload.email ||
      "cliente@email.com";

    const customerPhone =
      payload.Customer?.mobile ||
      payload.customer?.phone ||
      payload.buyer?.checkout_phone ||
      payload.phone ||
      "";

    const appName =
      payload.Product?.product_name ||
      payload.product?.name ||
      payload.data?.product?.name ||
      "Mini App Licenciado";

    const appSlug =
      appName.toLowerCase().includes("low") || appName.toLowerCase().includes("carb")
        ? "guia-lowcarb"
        : appName.toLowerCase().includes("foco")
        ? "metodo-foco"
        : "app-padrao";

    const event =
      payload.order_status ||
      payload.event ||
      payload.status ||
      "order_approved";

    console.log(`[Webhook Vendas ${gateway}] Evento: ${event} para ${customerName} (${customerEmail}) - App: ${appName}`);

    // Link exclusivo do PWA gerado para o cliente
    const pwaAccessUrl = `https://miniapps.studio/a/${appSlug}?email=${encodeURIComponent(customerEmail)}`;

    return NextResponse.json({
      success: true,
      message: "Webhook de venda processado com sucesso. Acesso ao PWA liberado!",
      data: {
        customer: {
          name: customerName,
          email: customerEmail,
          phone: customerPhone,
        },
        app: {
          name: appName,
          slug: appSlug,
          access_url: pwaAccessUrl,
        },
        gateway,
        status: "liberado",
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: "Falha ao processar webhook de vendas", details: err.message },
      { status: 400 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    status: "online",
    message: "Endpoint de Webhook de Vendas ativo. Envie requisições POST com payloads de compra (Kiwify, Hotmart, Eduzz, Stripe, Cakto, Mercado Pago).",
  });
}
