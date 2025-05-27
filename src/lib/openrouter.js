export async function useDeepseek(content) {
  const apiKey =
    "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";

  const response = await fetch(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "deepseek/deepseek-chat-v3-0324:free",
        messages: [
          {
            role: "user",
            content: content,
          },
        ],
      }),
    }
  );

  return response.json();
}
