export async function uploadImageByUrl(imageUrl) {
  const apiKey = "6221bec863b163b309ff04448fcdeb1a";
  const formData = new FormData();
  formData.append("image", imageUrl);
  formData.append("key", apiKey);

  try {
    const response = await fetch("https://api.imgbb.com/1/upload", {
      method: "POST",
      body: formData,
    });

    const result = await response.json();
    if (result.success) {
      console.log("업로드 성공:", result.data.url);
      return result.data.url; // 업로드된 이미지 URL 반환
    } else {
      console.error("업로드 실패:", result);
      return null;
    }
  } catch (error) {
    console.error("네트워크 오류:", error);
    return null;
  }
}
