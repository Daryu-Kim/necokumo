import CryptoJS from "crypto-js";

const SECRET = process.env.VUE_APP_SECRET_KEY;

// 32바이트 AES 키 생성
const KEY = CryptoJS.SHA256(SECRET); // 256bit Key

// 16바이트 IV 생성 (고정)
const IV = CryptoJS.enc.Hex.parse(
  CryptoJS.SHA256(SECRET + "_iv")
    .toString()
    .substring(0, 32)
);

// 항상 같은 암호문이 나오는 암호화
export function encrypt(plainText) {
  const encrypted = CryptoJS.AES.encrypt(plainText, KEY, {
    iv: IV,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });

  return encrypted.ciphertext.toString(CryptoJS.enc.Base64); // Base64 암호문
}

// 항상 같은 암호문을 해독
export function decrypt(cipherText) {
  const cipherParams = CryptoJS.lib.CipherParams.create({
    ciphertext: CryptoJS.enc.Base64.parse(cipherText),
  });

  const decrypted = CryptoJS.AES.decrypt(cipherParams, KEY, {
    iv: IV,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });

  return decrypted.toString(CryptoJS.enc.Utf8);
}
