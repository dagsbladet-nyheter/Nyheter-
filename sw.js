const SB_URL = "https://dzmwvgflmiuotsquwjlq.supabase.co";
const SB_KEY = "sb_publishable_a7BFCoThPg8mm798WYwADQ_IUf1g3Rp";
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (e) => e.waitUntil(self.clients.claim()));
async function headline() {
  try {
    const ctrl = new AbortController(); setTimeout(() => ctrl.abort(), 4000);
    const r = await fetch(SB_URL + "/rest/v1/rpc/get_news", { method: "POST", headers: { "Content-Type": "application/json", apikey: SB_KEY }, body: "{}", signal: ctrl.signal });
    const d = await r.json();
    const t = d && d[0] && d[0].t;
    if (t) return t.replace(/<[^>]*>/g, "").replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'").trim();
  } catch (_) {}
  return "Nya nyheter i Dagsläget";
}
self.addEventListener("push", (e) => {
  e.waitUntil(headline().then((body) => self.registration.showNotification("Senaste nytt", {
    body, tag: "dagslaget-nyheter"
  })));
});
self.addEventListener("notificationclick", (e) => {
  e.notification.close();
  e.waitUntil(self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((list) => {
    for (const c of list) { if ("focus" in c) return c.focus(); }
    return self.clients.openWindow("./");
  }));
});
