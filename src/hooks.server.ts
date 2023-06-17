import { setUser, token, type MeEndpointResponse, logout, user, type UserInterface } from "$lib/services/auth";
import axiosAPI from "$lib/services/customAxios";
import { COOKIE_KEY } from "$lib/utils/constants";
import type { Handle } from "@sveltejs/kit";
import type { AxiosResponse } from "axios";

console.log('hooks called')

let u: UserInterface | null;

user.subscribe(val => {
    console.log("user value in hooks.server")
    u = val;
    console.log(val)
})

let hasTried = false

export const handle = (async ({ event, resolve }) => {


    // event.locals.user = 'test'

    console.log(event.cookies.get(COOKIE_KEY), u != null)
    const tokenData = event.cookies.get(COOKIE_KEY)

    if (hasTried == false && tokenData != undefined && u == null) {
        hasTried = true;
        // set the token
        // token.set(tokenData)
        // now call the me endpoint 
        axiosAPI.get('/me')
            .then((res: AxiosResponse) => {
                console.log("data from me endpoint")
                console.log(res.data)

                const response: MeEndpointResponse = res.data
                // setUser(tokenData, response.data)
                // token.set(tokenData)
                user.set(response.data)
                // set in the locals 
                event.locals.user = response.data

                console.log("local events")
                console.log(event.locals.user)
            })
            .catch(err => {
                // clear cookies 
                console.log("error in hooks")
                // event.cookies.delete(COOKIE_KEY)
                console.log(err)
                // logout()

            })
    }

    const response = await resolve(event);
    return response;
}) satisfies Handle;