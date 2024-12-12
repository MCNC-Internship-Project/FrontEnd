import axios from "axios";

const baseUrl = process.env.VUE_APP_API_URL;

// Axios 인스턴스 생성 (기본값 설정)
const axiosInstance = axios.create({
    baseURL: baseUrl,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

export default axiosInstance;