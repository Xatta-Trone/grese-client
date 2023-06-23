import { PUBLIC_API_URL } from '$env/static/public';
import axios, { AxiosError, type AxiosInstance, type AxiosRequestConfig, type AxiosResponse, type InternalAxiosRequestConfig } from "axios";
import { token } from "./auth";

let tokenData: string | null

token.subscribe(value => tokenData = value)

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

const onResponse = (response: AxiosResponse): AxiosResponse => {
    const { method, url } = response.config;
    const { status } = response;
    // Set Loading End Here
    // Handle Response Data Here
    // Error Handling When Return Success with Error Code Here
    console.log(`🚀 [API] ${method?.toUpperCase()} ${url} | Response ${status}`);

    return response;
};

const onErrorResponse = (error: AxiosError | Error): Promise<AxiosError> => {
    if (axios.isAxiosError(error)) {
        const { message } = error;
        const { method, url } = error.config as AxiosRequestConfig;
        const { statusText, status } = error.response as AxiosResponse ?? {};

        console.log(
            `🚨 [API] ${method?.toUpperCase()} ${url} | Error ${status} ${message}`
        );

        switch (status) {
            case 401: {
                // "Login required"
                break;
            }
            case 403: {
                // "Permission denied"
                break;
            }
            case 404: {
                // "Invalid request"
                break;
            }
            case 500: {
                // "Server error"
                break;
            }
            default: {
                // "Unknown error occurred"
                break;
            }
        }

        if (status === 401) {
            // Delete Token & Go To Login Page if you required.
            sessionStorage.removeItem("token");
        }
    } else {
        console.log(`🚨 [API] | Error ${error.message}`);
    }

    return Promise.reject(error);
};


axiosAPI.interceptors.request.use(onRequest)
axiosAPI.interceptors.response.use(onResponse)

export default axiosAPI;