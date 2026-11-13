const OWNER = "lunnessa777-hue";
const REPO = "goaloo-bet365";
const WORKFLOW = "goaloo.yml";
const API = "https://api.github.com";
const ORIGIN = "https://lunnessa777-hue.github.io";

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" }
  });
}
function cors(req, res) {
  const origin = req.headers.get("origin");
  if (origin && origin !== ORIGIN) return json({ error: "Origin not allowed" }, 403);
  const headers = new Headers(res.headers);
  headers.set("access-control-allow-origin", ORIGIN);
  headers.set("access-control-allow-methods", "GET, POST, OPTIONS");
  headers.set("access-control-allow-headers", "authorization, content-type");
  headers.set("vary", "Origin");
  return new Response(res.body, { status: res.status, headers });
}
function authorized(req, env) {
  const headers = req.headers || {};
  const authorization = typeof headers.get === "function"
    ? headers.get("authorization")
    : (headers.authorization || headers.Authorization || "");
  const token = String(authorization).replace(/^Bearer\s+/i, "");
  return Boolean(env.APP_PASSWORD && token && token === env.APP_PASSWORD);
}
async function gh(path, env, options = {}) {
  const response = await fetch(API + path, {
    ...options,
    headers: {
      accept: "application/vnd.github+json",
      authorization: "Bearer " + env.GITHUB_TOKEN,
      "x-github-api-version": "2022-11-28",
      "content-type": "application/json",
      "user-agent": "Luni-34GS-Goaloo-Bridge",
      ...(options.headers || {})
    }
  });
  if (!response.ok) {
    const body = await response.text();
    throw new Error("GitHub API " + response.status + ": " + body.slice(0, 500));
  }
  if (response.status === 204) return null;
  return response.json();
}
function validateInput(body) {
  const url = String(body.goaloo_url || "").trim();
  const start = String(body.start_date || "");
  const end = String(body.end_date || "");
  if (!/^https:\/\/(www\.)?goaloo\.com\/.+\/1x2-odds-\d+/i.test(url)) {
    throw new Error("Geçerli bir Goaloo 1X2 Odds maç bağlantısı girin.");
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(start) || !/^\d{4}-\d{2}-\d{2}$/.test(end) || start > end) {
    throw new Error("Tarih aralığı geçersiz.");
  }
  return { url, start, end };
}
function extractZipFile(buf, wanted) {
  const eocd = Buffer.from([0x50, 0x4b, 0x05, 0x06]);
  const eocdAt = buf.lastIndexOf(eocd);
  if (eocdAt < 0) throw new Error("Sonuç ZIP dosyasının dizini bulunamadı.");
  const count = buf.readUInt16LE(eocdAt + 10);
  let p = buf.readUInt32LE(eocdAt + 16);
  for (let i = 0; i < count; i++) {
    if (buf.readUInt32LE(p) !== 0x02014b50) break;
    const method = buf.readUInt16LE(p + 10);
    const compressed = buf.readUInt32LE(p + 20);
    const nameLen = buf.readUInt16LE(p + 28);
    const extraLen = buf.readUInt16LE(p + 30);
    const commentLen = buf.readUInt16LE(p + 32);
    const localOffset = buf.readUInt32LE(p + 42);
    const name = buf.toString("utf8", p + 46, p + 46 + nameLen);
    if (name === wanted || name.endsWith("/" + wanted)) {
      const localNameLen = buf.readUInt16LE(localOffset + 26);
      const localExtraLen = buf.readUInt16LE(localOffset + 28);
      const start = localOffset + 30 + localNameLen + localExtraLen;
      const raw = buf.subarray(start, start + compressed);
      if (method === 0) return raw.toString("utf8");
      if (method === 8) return require("node:zlib").inflateRawSync(raw).toString("utf8");
      throw new Error("ZIP sıkıştırma yöntemi desteklenmiyor: " + method);
    }
    p += 46 + nameLen + extraLen + commentLen;
  }
  throw new Error("Artifact içinde results.json bulunamadı.");
}
module.exports = { OWNER, REPO, WORKFLOW, json, cors, authorized, gh, validateInput, extractZipFile };
