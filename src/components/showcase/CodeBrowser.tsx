"use client";

import { useEffect, useState } from "react";
import {
  ChevronRight, ChevronDown, Folder, FileCode, FileText, FileJson,
  Copy, Check, Download, Search as SearchIcon, RefreshCw,
} from "lucide-react";

type Node = {
  name: string;
  path: string;
  type: "file" | "dir";
  children?: Node[];
  size?: number;
};

function fileIcon(name: string) {
  if (name.endsWith(".ts") || name.endsWith(".tsx") || name.endsWith(".js") || name.endsWith(".jsx"))
    return <FileCode size={13} className="text-emerald-500" />;
  if (name.endsWith(".json")) return <FileJson size={13} className="text-amber-500" />;
  if (name.endsWith(".md")) return <FileText size={13} className="text-sky-500" />;
  return <FileText size={13} className="text-slate-400" />;
}

function TreeNode({
  node, depth, expanded, toggle, selected, onSelect, query,
}: {
  node: Node; depth: number; expanded: Set<string>; toggle: (p: string) => void;
  selected: string; onSelect: (p: string) => void; query: string;
}) {
  const isExpanded = expanded.has(node.path);
  const match = !query || node.path.toLowerCase().includes(query.toLowerCase());

  if (node.type === "dir") {
    return (
      <div>
        <button
          onClick={() => toggle(node.path)}
          className="w-full flex items-center gap-1 px-2 py-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-left"
          style={{ paddingLeft: 8 + depth * 12 }}
        >
          {isExpanded ? <ChevronDown size={12} className="text-slate-400" /> : <ChevronRight size={12} className="text-slate-400" />}
          <Folder size={13} className="text-amber-400 fill-amber-200 dark:fill-amber-900" />
          <span className="text-xs font-medium text-slate-700 dark:text-slate-200">{node.name}</span>
        </button>
        {isExpanded && node.children && (
          <div>
            {node.children.map((c) => (
              <TreeNode
                key={c.path}
                node={c}
                depth={depth + 1}
                expanded={expanded}
                toggle={toggle}
                selected={selected}
                onSelect={onSelect}
                query={query}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  if (!match) return null;
  return (
    <button
      onClick={() => onSelect(node.path)}
      className="w-full flex items-center gap-1.5 px-2 py-1 rounded-md text-left transition"
      style={{
        paddingLeft: 12 + depth * 12,
        backgroundColor: selected === node.path ? "rgb(16 185 129 / 0.12)" : "transparent",
      }}
    >
      <span className="w-3" />
      {fileIcon(node.name)}
      <span
        className={`text-xs truncate ${selected === node.path ? "text-emerald-600 dark:text-emerald-400 font-semibold" : "text-slate-600 dark:text-slate-300"}`}
      >
        {node.name}
      </span>
    </button>
  );
}

export function CodeBrowser() {
  const [tree, setTree] = useState<Node[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<Set<string>>(new Set(["src", "src/screens", "src/components", "src/store", "src/data", "src/navigation"]));
  const [selected, setSelected] = useState<string>("App.tsx");
  const [content, setContent] = useState<string>("");
  const [fileLoading, setFileLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [copied, setCopied] = useState(false);

  const loadTree = async () => {
    setLoading(true);
    const r = await fetch("/api/source");
    const j = await r.json();
    setTree(j.tree);
    setLoading(false);
  };

  useEffect(() => { loadTree(); }, []);

  useEffect(() => {
    if (!selected) return;
    setFileLoading(true);
    fetch(`/api/source?file=${encodeURIComponent(selected)}`)
      .then((r) => r.json())
      .then((j) => { setContent(j.content ?? ""); setFileLoading(false); })
      .catch(() => setFileLoading(false));
  }, [selected]);

  const toggle = (p: string) =>
    setExpanded((s) => {
      const n = new Set(s);
      if (n.has(p)) { n.delete(p); } else { n.add(p); }
      return n;
    });

  const copy = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const download = () => {
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = selected.split("/").pop() ?? "file.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  const lineCount = content ? content.split("\n").length : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] gap-0 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 h-[560px]">
      {/* file tree */}
      <div className="flex flex-col border-r border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950/50">
        <div className="p-2.5 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-200">mobile-app/</span>
            <button onClick={loadTree} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
              <RefreshCw size={12} className={loading ? "animate-spin" : ""} />
            </button>
          </div>
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <SearchIcon size={12} className="text-slate-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Filter files..."
              className="flex-1 bg-transparent text-xs outline-none text-slate-700 dark:text-slate-200 placeholder:text-slate-400"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-1.5">
          {loading ? (
            <div className="space-y-1.5 p-2">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-4 rounded bg-slate-200 dark:bg-slate-800 animate-pulse" style={{ width: `${60 + Math.random() * 30}%` }} />
              ))}
            </div>
          ) : (
            tree?.map((n) => (
              <TreeNode
                key={n.path}
                node={n}
                depth={0}
                expanded={expanded}
                toggle={toggle}
                selected={selected}
                onSelect={setSelected}
                query={query}
              />
            ))
          )}
        </div>
      </div>

      {/* code view */}
      <div className="flex flex-col bg-slate-950 min-w-0">
        <div className="flex items-center justify-between px-3 py-2 border-b border-slate-800 bg-slate-900">
          <div className="flex items-center gap-2 min-w-0">
            {fileIcon(selected)}
            <span className="text-xs font-mono text-slate-300 truncate">{selected}</span>
            {lineCount > 0 && (
              <span className="text-[10px] text-slate-500 shrink-0">{lineCount} lines</span>
            )}
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <button onClick={copy} className="flex items-center gap-1 px-2 py-1 rounded text-[10px] text-slate-300 hover:bg-slate-800">
              {copied ? <Check size={11} className="text-emerald-400" /> : <Copy size={11} />}
              {copied ? "Copied" : "Copy"}
            </button>
            <button onClick={download} className="flex items-center gap-1 px-2 py-1 rounded text-[10px] text-slate-300 hover:bg-slate-800">
              <Download size={11} /> Save
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-auto">
          {fileLoading ? (
            <div className="p-4 space-y-2">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="h-3 rounded bg-slate-800 animate-pulse" style={{ width: `${40 + Math.random() * 50}%` }} />
              ))}
            </div>
          ) : (
            <CodeBlock code={content} />
          )}
        </div>
      </div>
    </div>
  );
}

function CodeBlock({ code }: { code: string }) {
  const lines = code.split("\n");
  return (
    <pre className="text-[11px] leading-relaxed font-mono p-0 m-0">
      <code>
        {lines.map((line, i) => (
          <div key={i} className="flex hover:bg-slate-900/60">
            <span className="select-none text-slate-600 text-right pr-3 pl-3 w-12 shrink-0 border-r border-slate-800 mr-3">
              {i + 1}
            </span>
            <span className="text-slate-200 whitespace-pre-wrap break-all pr-4">{line || " "}</span>
          </div>
        ))}
      </code>
    </pre>
  );
}
