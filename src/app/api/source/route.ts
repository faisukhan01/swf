import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const CANDIDATES = [
  path.resolve(process.cwd(), "mobile-app"),
  path.resolve(process.cwd(), "..", "mobile-app"),
];
const MOBILE_ROOT = CANDIDATES.find((p) => fs.existsSync(p)) ?? CANDIDATES[0];

const IGNORE = new Set([
  "node_modules",
  ".git",
  ".expo",
  "dist",
  "web-build",
  "package-lock.json",
  "yarn.lock",
]);

type Node = {
  name: string;
  path: string;
  type: "file" | "dir";
  children?: Node[];
  size?: number;
};

function walk(dir: string): Node[] {
  let entries: fs.Dirent[];
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return [];
  }
  const nodes: Node[] = [];
  for (const e of entries) {
    if (IGNORE.has(e.name)) continue;
    const full = path.join(dir, e.name);
    const rel = path.relative(MOBILE_ROOT, full);
    if (e.isDirectory()) {
      nodes.push({ name: e.name, path: rel, type: "dir", children: walk(full) });
    } else {
      const stat = fs.statSync(full);
      nodes.push({ name: e.name, path: rel, type: "file", size: stat.size });
    }
  }
  nodes.sort((a, b) => {
    if (a.type !== b.type) return a.type === "dir" ? -1 : 1;
    return a.name.localeCompare(b.name);
  });
  return nodes;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const file = searchParams.get("file");

  if (file) {
    const safe = path.normalize(file).replace(/^(\.\.[/\\])+/, "");
    const full = path.join(MOBILE_ROOT, safe);
    if (!full.startsWith(MOBILE_ROOT) || !fs.existsSync(full) || fs.statSync(full).isDirectory()) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    const content = fs.readFileSync(full, "utf8");
    return NextResponse.json({ path: safe, content, size: content.length });
  }

  const tree = walk(MOBILE_ROOT);
  return NextResponse.json({ root: path.basename(MOBILE_ROOT), tree });
}
