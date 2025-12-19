import { decrypt, encrypt } from "./crypto";

export function loginProcess(uid) {
  try {
    const encryptedUserId = encrypt(uid);
    localStorage.setItem("__login_user_id", encryptedUserId);
    return true;
  } catch (e) {
    console.error(e);
    return false;
  }
}

export function logoutProcess() {
  try {
    localStorage.removeItem("__login_user_id");
    return true;
  } catch (e) {
    console.error(e);
    return false;
  }
}

export function getUserId() {
  try {
    const uid = localStorage.getItem("__login_user_id") || "";
    const decryptedUid = decrypt(uid);
    return decryptedUid;
  } catch (e) {
    console.error(e);
    return null;
  }
}
