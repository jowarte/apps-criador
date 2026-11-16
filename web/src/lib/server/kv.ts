import { promises as fs } from "fs";
import path from "path";

/**
 * Armazenamento chave/valor.
 * - Com DATABASE_URL (Dokploy/PostgreSQL): usa a tabela KV via Prisma.
 * - Sem banco (dev local) ou se o banco falhar: usa arquivo JSON em ./data/kv.json.
 */

type Json = unknown;

const FILE = path.join(process.cwd(), "data", "kv.json");

async function readFile(): Promise<Record<string, string>> {
  try {
    return JSON.parse(await fs.readFile(FILE, "utf8"));
  } catch {
    return {};
  }
}

async function writeFile(data: Record<string, string>) {
  await fs.mkdir(path.dirname(FILE), { recursive: true });
  await fs.writeFile(FILE, JSON.stringify(data, null, 2), "utf8");
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let prismaClient: any = null;
async function getPrisma() {
  if (!process.env.DATABASE_URL) return null;
  if (prismaClient) return prismaClient;
  try {
    const { prisma } = await import("@/lib/prisma");
    prismaClient = prisma;
    return prismaClient;
  } catch {
    return null;
  }
}

export async function kvGet<T = Json>(key: string): Promise<T | null> {
  const prisma = await getPrisma();
  if (prisma) {
    try {
      const row = await prisma.kV.findUnique({ where: { key } });
      return row ? (JSON.parse(row.value) as T) : null;
    } catch (e) {
      console.error("[kv] erro no banco, usando arquivo:", e);
    }
  }
  const data = await readFile();
  return data[key] ? (JSON.parse(data[key]) as T) : null;
}

export async function kvSet(key: string, value: Json): Promise<void> {
  const str = JSON.stringify(value);
  const prisma = await getPrisma();
  if (prisma) {
    try {
      await prisma.kV.upsert({ where: { key }, update: { value: str }, create: { key, value: str } });
      return;
    } catch (e) {
      console.error("[kv] erro no banco, usando arquivo:", e);
    }
  }
  const data = await readFile();
  data[key] = str;
  await writeFile(data);
}

export async function kvDelete(key: string): Promise<void> {
  const prisma = await getPrisma();
  if (prisma) {
    try {
      await prisma.kV.deleteMany({ where: { key } });
      return;
    } catch (e) {
      console.error("[kv] erro no banco, usando arquivo:", e);
    }
  }
  const data = await readFile();
  delete data[key];
  await writeFile(data);
}

export async function kvList<T = Json>(prefix: string): Promise<{ key: string; value: T }[]> {
  const prisma = await getPrisma();
  if (prisma) {
    try {
      const rows = await prisma.kV.findMany({ where: { key: { startsWith: prefix } } });
      return rows.map((r: { key: string; value: string }) => ({ key: r.key, value: JSON.parse(r.value) as T }));
    } catch (e) {
      console.error("[kv] erro no banco, usando arquivo:", e);
    }
  }
  const data = await readFile();
  return Object.entries(data)
    .filter(([k]) => k.startsWith(prefix))
    .map(([key, v]) => ({ key, value: JSON.parse(v) as T }));
}
