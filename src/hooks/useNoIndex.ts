import { useEffect } from "react";

export function useNoIndex() {
  useEffect(() => {
    let meta = document.head.querySelector('meta[name="robots"]') as HTMLMetaElement | null;
    const created = !meta;
    const previous = meta?.getAttribute("content") || "";

    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "robots";
      document.head.appendChild(meta);
    }

    meta.content = "noindex,nofollow,noarchive,nosnippet";

    return () => {
      if (created) meta?.remove();
      else if (meta) meta.content = previous;
    };
  }, []);
}

export default useNoIndex;
