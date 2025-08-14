import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "./firebase";

function getExtensionFromMimeType(mimeType) {
  const mimeToExt = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/gif": "gif",
    "image/webp": "webp",
  };
  return mimeToExt[mimeType] || "";
}

export async function fetchBlobFromFunctions(imageUrl) {
  const res = await fetch(
    "https://getimageblobfromurl-dikpysyoqq-uc.a.run.app",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ imageUrl }),
    }
  );

  if (!res.ok) throw new Error("Failed to fetch image from function");

  return await res.blob();
}

export async function uploadImageByUrl(category, imageUrl, uuid, index) {
  try {
    const blob = await fetchBlobFromFunctions(imageUrl);

    switch (category) {
      case "thumbnail": {
        const originalStorageRef = ref(
          storage,
          `${category}/original/${uuid}.${getExtensionFromMimeType(blob.type)}`
        );
        // Original Image Upload and Download URL
        await uploadBytes(originalStorageRef, blob);
        const downloadUrl = await getDownloadURL(originalStorageRef);

        return {
          originalUrl: downloadUrl,
        };
      }
      case "detail": {
        const storageRef = ref(
          storage,
          `${category}/${uuid}_${index}.${getExtensionFromMimeType(blob.type)}`
        );
        await uploadBytes(storageRef, blob);
        const detailDownloadUrl = await getDownloadURL(storageRef);
        return {
          imageOriginUrl: detailDownloadUrl,
        };
      }
      default:
        return null;
    }
  } catch (error) {
    console.error("상품 이미지 업로드 실패:", error);
    return null;
  }
}
