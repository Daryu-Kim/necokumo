const { onRequest } = require("firebase-functions/v2/https");
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

exports.getImageBlobFromUrl = onRequest(async (req, res) => {
  // CORS 설정 (모든 도메인 허용)
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.set("Access-Control-Allow-Headers", "Content-Type");

  // 프리플라이트 요청 빠르게 응답
  if (req.method === "OPTIONS") {
    return res.status(204).send("");
  }

  try {
    const { imageUrl } = req.body;
    if (!imageUrl) {
      return res.status(400).json({ error: "Missing imageUrl" });
    }

    const url = new URL(imageUrl);

    const response = await fetch(imageUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",
        Referer: url.origin,
      },
    });

    if (!response.ok) {
      return res
        .status(response.status)
        .json({ error: `Failed to fetch image: ${response.statusText}` });
    }

    const contentType =
      response.headers.get("content-type") || "application/octet-stream";
    const buffer = await response.arrayBuffer();

    res.set("Content-Type", contentType);

    // 바이너리 데이터(Buffer) 전송
    return res.status(200).send(Buffer.from(buffer));
  } catch (error) {
    console.error("Error fetching image:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});
