import { browser } from '$app/environment';
import { PUBLIC_API_URL } from '$env/static/public';
import { COOKIE_KEY, COOKIE_KEY_EXP, COOKIE_KEY_USER } from '$lib/utils/constants';
import { redirectHelper } from '$lib/utils/helpers';
import axios, { type AxiosInstance, type AxiosResponse, type InternalAxiosRequestConfig } from "axios";



// Create a instance of axios to use the same base url.
const axiosAPI: AxiosInstance = axios.create({
    baseURL: PUBLIC_API_URL // it's not recommended to have this info here.
});
axiosAPI.defaults.headers.post['Content-Type'] = 'application/json';
axiosAPI.defaults.withCredentials = true;
// Request Interceptor
const onRequest = (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const { method, url } = config;
    // Set Headers Here
    // if (tokenData != null) {
    //     config.headers.set('Authorization', `Bearer ${tokenData}`)
    // }
    // Check Authentication Here
    // Set Loading Start Here
    console.log(`🚀 [API] ${method?.toUpperCase()} ${url} | Request`);

    if (method === "get") {
        config.timeout = 15000;
    }
    return config;
};

const onResponse = async (response: AxiosResponse): Promise<AxiosResponse> => {
    const { method, url } = response.config;
    const { status } = response;
    // Set Loading End Here
    // Handle Response Data Here
    // Error Handling When Return Success with Error Code Here
    console.log(`🚀 [API] ${method?.toUpperCase()} ${url} | Response ${status}`);

    if (status == 401) {
        fetch(`${window.location.origin}/cookies?key=${COOKIE_KEY},${COOKIE_KEY_USER},${COOKIE_KEY_EXP}`, { method: "delete" })
            .then(() => {
                if (browser) {
                    window.location.href = "/"
                } else {
                    redirectHelper('/')
                }

            })
        return response;
    }

    return response;
};




axiosAPI.interceptors.request.use(onRequest)
axiosAPI.interceptors.response.use(onResponse)

export default axiosAPI;