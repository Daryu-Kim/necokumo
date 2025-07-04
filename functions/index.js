const { onRequest } = require("firebase-functions/v2/https");
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));
const cors = require("cors")({ origin: true });
const aligoapi = require("aligoapi");

const aligoAuthData = {
  key: "o03r6el0zag5nvxdhyk230tyrluj4aja",
  user_id: "innovape",
};

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

exports.sendMessage = onRequest(
  {
    region: "us-central1",
    vpcConnector:
      "projects/necokumo-c21e3/locations/us-central1/connectors/functions-connector",
    ingressSettings: "ALLOW_ALL", // 외부에서 접근 허용
    timeoutSeconds: 30,
    memory: "256MiB",
    vpcConnectorEgressSettings: "ALL_TRAFFIC",
  },
  async (req, res) => {
    cors(req, res, async () => {
      if (req.method !== "POST") {
        return res.status(405).send("Method Not Allowed");
      }

      try {
        // 메시지 발송
        const response = await aligoapi.send(req, aligoAuthData);
        return res.status(200).json(response);
      } catch (error) {
        console.error("Aligo 문자 발송 오류:", error);
        return res
          .status(500)
          .json({ error: "문자 발송 실패", detail: error.message || error });
      }
    });
  }
);
