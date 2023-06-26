import { user, type MeEndpointResponse } from "./auth";
import axiosAPI from "./customAxios";

export function updateUser() {
    axiosAPI.get("/me").then((res) => {
        const response: MeEndpointResponse = res.data;
        user.set(response.data)
    });
}