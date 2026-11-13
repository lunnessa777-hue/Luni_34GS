const { OWNER, REPO, WORKFLOW, authorized, gh, extractZipFile } = require("../lib/github");

module.exports = async (req, res) => {
  const origin = req.headers.origin;
  if (origin && origin !== "https://lunnessa777-hue.github.io") return res.status(403).json({ error: "Origin not allowed" });
  res.setHeader("Access-Control-Allow-Origin", "https://lunnessa777-hue.github.io");
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });
  if (!authorized(req, process.env)) return res.status(401).json({ error: "Erişim parolası hatalı." });
  try {
    const since = req.query.since;
    const requestId = String(req.query.request_id || "");
    if (!since || Number.isNaN(Date.parse(since)) || !/^[a-f0-9-]{36}$/i.test(requestId)) return res.status(400).json({ error: "Tarama kimliği eksik veya geçersiz." });
    const data = await gh("/repos/" + OWNER + "/" + REPO + "/actions/workflows/" + WORKFLOW + "/runs?event=workflow_dispatch&branch=main&per_page=10", process.env);
    const run = (data.workflow_runs || []).find(x => Date.parse(x.created_at) >= Date.parse(since) - 60000 && String(x.name || "").includes(requestId));
    if (!run) return res.status(200).json({ state: "queued", message: "GitHub tarama işlemi başlatılıyor." });
    if (run.status !== "completed") return res.status(200).json({ state: run.status || "in_progress", message: "Bookmaker geçmişleri taranıyor.", run_url: run.html_url });
    if (run.conclusion !== "success") return res.status(200).json({ state: "failed", message: "Tarama başarısız oldu. GitHub Actions kayıtlarını kontrol edin.", run_url: run.html_url });
    const artifacts = await gh("/repos/" + OWNER + "/" + REPO + "/actions/runs/" + run.id + "/artifacts", process.env);
    const artifact = (artifacts.artifacts || []).find(x => x.name === "goaloo-total-results" && !x.expired);
    if (!artifact) return res.status(200).json({ state: "completed", error: "Tarama tamamlandı fakat sonuç artifact'i bulunamadı.", run_url: run.html_url });
    const zipResponse = await fetch(artifact.archive_download_url, {
      headers: { authorization: "Bearer " + process.env.GITHUB_TOKEN, "user-agent": "Luni-34GS-Goaloo-Bridge" }
    });
    if (!zipResponse.ok) throw new Error("Artifact indirilemedi: HTTP " + zipResponse.status);
    const zip = Buffer.from(await zipResponse.arrayBuffer());
    const archive = JSON.parse(extractZipFile(zip, "results.json"));
    return res.status(200).json({ state: "completed", archive, run_url: run.html_url });
  } catch (error) {
    return res.status(500).json({ error: error.message || "Sonuçlar alınamadı." });
  }
};
