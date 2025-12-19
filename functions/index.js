const { onRequest } = require("firebase-functions/v2/https");
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));
const cors = require("cors")({ origin: true });
const FormData = require("form-data");

const ppurioAuthData = {
  API_URL: "https://message.ppurio.com",
  USER_NAME: "necokumo",
  TOKEN: "5f410db7a5427c87a9f98d0a41ad3bc115abc78d36c79b3f12724499cb546dcf",
};

const apickAuthData = {
  API_URL: "https://apick.app",
  CL_AUTH_KEY: "62813d75195164c2eb8807f718b8ec3a",
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
        const { targets, targetCount, content, refKey } = req.body;
        if (!Array.isArray(targets) || targets.length === 0) {
          return res.status(400).json({ error: "targets 배열이 비어있음" });
        }

        // 1. 엑세스 토큰 발급
        const authString = Buffer.from(
          `${ppurioAuthData.USER_NAME}:${ppurioAuthData.TOKEN}`
        ).toString("base64");
        const tokenRes = await fetch(`${ppurioAuthData.API_URL}/v1/token`, {
          method: "POST",
          headers: { Authorization: `Basic ${authString}` },
        });

        if (!tokenRes.ok) {
          return res.status(tokenRes.status).json({ error: "토큰 발급 실패" });
        }
        const tokenData = await tokenRes.json();
        const accessToken = tokenData?.token;
        if (!accessToken) {
          return res.status(500).json({ error: "토큰 값이 없습니다" });
        }

        // 2. 문자 발송
        const payload = {
          account: ppurioAuthData.USER_NAME,
          messageType: "LMS",
          content: content,
          from: "01055779069",
          duplicateFlag: "N",
          refKey: refKey,
          targetCount: targetCount,
          targets: targets.map((t) => ({
            to: t.to,
          })),
        };

        const msgRes = await fetch(`${ppurioAuthData.API_URL}/v1/message`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        if (!msgRes.ok) {
          const errText = await msgRes.text();
          return res
            .status(msgRes.status)
            .json({ error: "문자 발송 실패", detail: errText });
        }

        const msgData = await msgRes.json();
        return res.status(200).json(msgData);
      } catch (error) {
        console.error("문자 발송 오류:", error);
        return res
          .status(500)
          .json({ error: "문자 발송 실패", detail: error.message || error });
      }
    });
  }
);

exports.checkResidentCard = onRequest(
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
        const { name, rrn1, rrn2, date } = req.body;

        const formData = new FormData();

        formData.append("name", name);
        formData.append("rrn1", rrn1);
        formData.append("rrn2", rrn2);
        formData.append("date", date);

        const msgRes = await fetch(
          `${apickAuthData.API_URL}/rest/identi_card/1`,
          {
            method: "POST",
            headers: {
              CL_AUTH_KEY: apickAuthData.CL_AUTH_KEY,
              ...formData.getHeaders(),
            },
            body: formData,
          }
        );

        const msgJson = await msgRes.json();

        return res.status(200).json(msgJson);
      } catch (error) {
        console.error("주민등록증 인증 오류:", error);

        return res.status(500).json({
          error: "주민등록증 인증 실패",
          detail: error.message || error,
        });
      }
    });
  }
);
