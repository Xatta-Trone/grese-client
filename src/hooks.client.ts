import { browser } from "$app/environment";
import { token, user, type MeEndpointResponse, type UserInterface, logout } from "$lib/services/auth";
import axiosAPI from "$lib/services/customAxios";
import { COOKIE_KEY, COOKIE_KEY_EXP, COOKIE_KEY_USER } from "$lib/utils/constants";
import { getCookie, getCookies, setCookie } from 'typescript-cookie'
// fetch("https://dev.gre-sentence-equivalence.com/me", { credentials: 'include' })
// axiosAPI.get("https://dev.gre-sentence-equivalence.com/me")

let u: UserInterface | null = null

user.subscribe(val => {
    u = val
})
// setCookie('test','testv')
console.log("cookies", getCookie(COOKIE_KEY))


if (browser && u == null) {
    const t: string | null = localStorage.getItem(COOKIE_KEY)
    const k: string | null = localStorage.getItem(COOKIE_KEY_EXP)
    const u: string | null = localStorage.getItem(COOKIE_KEY_USER)

    if (k != null && u != null) {
        const today = new Date();
        const tokenExp = new Date(JSON.parse(k))

        if (today > tokenExp) {
            logout()
            localStorage.removeItem(COOKIE_KEY)
            localStorage.removeItem(COOKIE_KEY_EXP)
        } else {
            token.set(t)
            user.set(JSON.parse(u))

            axiosAPI.get('/me')
                .then(res => {
                    const response: MeEndpointResponse = res.data

                    console.log('hooks client', response)

                    user.set(response.data)

                });
        }
    }
}