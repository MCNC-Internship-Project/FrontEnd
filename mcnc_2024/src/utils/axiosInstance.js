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

const getRequestKey = (config) => {
    return `${config.method}:${config.url}`;
};

const createRequest = (requestConfig) => {
    const key = getRequestKey(requestConfig);
    
    if (pendingRequests.has(key)) {
        return pendingRequests.get(key);
    }

    const promise = axiosInstance(requestConfig).finally(() => {
        pendingRequests.delete(key);
    });
    
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