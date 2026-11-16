/** Shared by metadata and the deployment check. Never index a preview build. */
export function resolveSiteConfig(value, deployment = "", productionHost = "") {
  try {
    const url = new URL(value || (productionHost ? `https://${productionHost}` : "http://127.0.0.1:3000"));
    if (!["http:", "https:"].includes(url.protocol) || url.username || url.password) throw new Error("Invalid origin");
    const host = url.hostname.toLowerCase();
    const publicHost = host.includes(".") && !/^(?:\d+\.){3}\d+$/.test(host) && !host.endsWith(".localhost") && !host.endsWith(".local");
    return { origin: url.origin, publicSite: url.protocol === "https:" && publicHost && !["preview", "development"].includes(deployment) };
  } catch {
    return { origin: "http://127.0.0.1:3000", publicSite: false };
  }
}
