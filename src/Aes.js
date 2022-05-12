import CryptoJS from "crypto-js"

export default function Aes(textToEncrypt) {
	let text = CryptoJS.enc.Utf8.parse(textToEncrypt);
	let Key = CryptoJS.enc.Utf8.parse("5TGB&YHN7UJM(IK<5TGB&YHN7UJM(IK<"); //secret key
	let IV = CryptoJS.enc.Utf8.parse("!QAZ2WSX#EDC4RFV"); //16 digit
	return CryptoJS.AES.encrypt(text, Key, { keySize: 256, iv: IV, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 }).toString();
}