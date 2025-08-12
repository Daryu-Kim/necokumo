export async function sendPpurioMessage(payload) {
  try {
    const response = await fetch(
      "https://sendmessage-dikpysyoqq-uc.a.run.app",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    const result = await response.json();
    console.log("문자 발송 결과:", result);
    return result;
  } catch (error) {
    console.error("문자 발송 에러:", error);
    throw error;
  }
}
