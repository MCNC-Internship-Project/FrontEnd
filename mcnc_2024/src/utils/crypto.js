import CryptoJS from 'crypto-js';

const secretKey = process.env.VUE_APP_API_KEY;

/**
 * 문자열을 URL-safe Base64로 암호화
 * @param {string} data - 암호화할 문자열
 * @returns {string} 암호화된 URL-safe Base64 문자열
 */
export const encrypt = (data) => {
    try {
        const iv = CryptoJS.enc.Utf8.parse(secretKey.substring(0, 16));
        const key = CryptoJS.enc.Utf8.parse(secretKey);
        
        const encrypted = CryptoJS.AES.encrypt(data.toString(), key, {
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        });
        
        // URL-safe Base64로 변환
        return encrypted.toString()
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=+$/, '');
    } catch (_) {
        return '';
    }
}

/**
 * URL-safe Base64 문자열을 복호화
 * @param {string} encryptedData - 복호화할 URL-safe Base64 문자열
 * @returns {string} 복호화된 문자열
 */
export const decrypt = (encryptedData) => {
    try {
        // URL-safe Base64 문자를 표준 Base64로 변환
        const standardBase64 = encryptedData
            .replace(/-/g, '+')
            .replace(/_/g, '/');
        
        // padding 추가
        const paddedBase64 = standardBase64 + '='.repeat((4 - standardBase64.length % 4) % 4);
        
        // 16바이트 IV 생성
        const iv = CryptoJS.enc.Utf8.parse(secretKey.substring(0, 16));
        
        // 키 생성
        const key = CryptoJS.enc.Utf8.parse(secretKey);
        
        // 복호화 수행
        const bytes = CryptoJS.AES.decrypt(paddedBase64, key, {
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        });
        
        const decrypted = bytes.toString(CryptoJS.enc.Utf8);
        if (!decrypted) {
            return '';
        }
        
        return decrypted;
    } catch (_) {
        return '';
    }
}