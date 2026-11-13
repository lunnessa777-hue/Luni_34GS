const { OWNER, REPO, WORKFLOW, json, cors, authorized, gh, validateInput } = require("./_shared");

module.exports = async (req, res) => {
  if (req.method === "OPTIONS") return res.status(204).setHeader("Access-Control-Allow-Origin", "https://lunnessa777-hue.github.io").setHeader("Access-Control-Allow-Methods", "POST, OPTIONS").setHeader("Access-Control-Allow-Headers", "authorization, content-type").end();
  const origin = req.headers.origin;
  if (origin && origin !== "https://lunnessa777-hue.github.io") return res.status(403).json({ error: "Origin not allowed" });
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  if (!authorized(req, process.env)) return res.status(401).json({ error: "Erişim parolası hatalı." });
  try {
    const { url, start, end } = validateInput(req.body || {});
    const since = new Date(Date.now() - 15000).toISOString();
    const requestId = require("node:crypto").randomUUID();
    await gh("/repos/" + OWNER + "/" + REPO + "/actions/workflows/" + WORKFLOW + "/dispatches", process.env, {
      method: "POST",
      body: JSON.stringify({ ref: "main", inputs: { goaloo_url: url, start_date: start, end_date: end, request_id: requestId } })
    });
    res.setHeader("Access-Control-Allow-Origin", "https://lunnessa777-hue.github.io");
    res.setHeader("Cache-Control", "no-store");
    return res.status(202).json({ ok: true, since, request_id: requestId, message: "Tarama kuyruğa alındı." });
  } catch (error) {
    return res.status(400).json({ error: error.message || "Tarama başlatılamadı." });
  }
};
