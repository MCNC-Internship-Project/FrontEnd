/**
 * @fileoverview Axios 인스턴스
 * @author 반명우 (banmyungwoo@mcnc.co.kr)
 * @date 2024-12-05
 * @lastModified 2024-12-13
 * @description 전역 Axios 인스턴스 관리
 * @details
 * - 중복 요청 방지
 * - withCredentials = true 기본값
 */

import axios from "axios";

const baseUrl = process.env.VUE_APP_API_URL;
const pendingRequests = new Map();

const axiosInstance = axios.create({
    baseURL: baseUrl,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

// 중복 요청 방지를 위한 키 생성
const getRequestKey = (config) => {
    return `${config.method}:${config.url}`;
};

/**
 * @param {Object} requestConfig - Axios 요청 설정
 * @returns {Promise} - HTTP 요청에 대한 Promise 객체 반환
 */
const createRequest = (requestConfig) => {
    // 해당 요청에 대한 키 생성
    const key = getRequestKey(requestConfig);

    // 동일한 요청이 이미 진행 중인 경우 해당 요청의 Promise 반환
    if (pendingRequests.has(key)) {
        return pendingRequests.get(key);
    }

    // 요청 생성
    const promise = axiosInstance(requestConfig).finally(() => {
        pendingRequests.delete(key); // 요청 완료 시 Map에서 제거
    });
    
    // 진행 중인 요청을 Map에 저장
    pendingRequests.set(key, promise);
    return promise;
};

const extendedAxios = {
    post(url, data, config = {}) {
        const { withCredentials = true, ...restConfig } = config;
        return createRequest({
            ...restConfig,
            method: 'post',
            url,
            data,
            withCredentials
        });
    },
    get(url, config = {}) {
        const { withCredentials = true, ...restConfig } = config;
        return createRequest({
            ...restConfig,
            method: 'get',
            url,
            withCredentials
        });
    },
    patch(url, data, config = {}) {
        const { withCredentials = true, ...restConfig } = config;
        return createRequest({
            ...restConfig,
            method: 'patch',
            url,
            data,
            withCredentials
        });
    },
    delete(url, config = {}) {
        const { withCredentials = true, ...restConfig } = config;
        return createRequest({
            ...restConfig,
            method: 'delete',
            url,
            withCredentials
        });
    }
};

export default extendedAxios;