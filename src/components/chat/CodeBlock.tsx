import { useRef, useState, type ReactNode } from "react";

export function CodeBlock({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLPreElement>(null);
  const [status, setStatus] = useState("Copy");
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(ref.current?.innerText ?? "");
      setStatus("Copied");
    } catch {
      setStatus("Copy failed");
    }
    window.setTimeout(() => setStatus("Copy"), 1800);
  };
  return (
    <div className="code-block">
      <button aria-label="Copy code" onClick={copy}>
        {status}
      </button>
      <pre ref={ref}>{children}</pre>
    </div>
  );
}
