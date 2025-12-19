// src/utils/seo.ts
export function setRobotsNoIndex(noIndex: boolean) {
  const name = "robots";
  let tag = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null;
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute("name", name);
    document.head.appendChild(tag);
  }
  tag.setAttribute("content", noIndex ? "noindex, nofollow" : "index, follow");
}
