import axios from "axios";

export async function uploadImageToImgbb(image) {
  const apiKey = "6221bec863b163b309ff04448fcdeb1a";
  const apiUrl = `https://api.imgbb.com/1/upload?expiration=600&key=${apiKey}`;

  const formData = new FormData();
  formData.append("image", image);

  try {
    const response = await axios.post(apiUrl, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("이미지 업로드 실패: ", error);
    throw error;
  }
}
