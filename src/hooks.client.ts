import { browser } from "$app/environment";
import type { CookieResponse } from "$lib/interfaces/cookiesInterface";
import { token, user, type MeEndpointResponse, type UserInterface, logout } from "$lib/services/auth";
import axiosAPI from "$lib/services/customAxios";
import { COOKIE_KEY, COOKIE_KEY_EXP, COOKIE_KEY_USER } from "$lib/utils/constants";
// fetch("https://dev.gre-sentence-equivalence.com/me", { credentials: 'include' })
// axiosAPI.get("https://dev.gre-sentence-equivalence.com/me")

// let u: UserInterface | null = null

// user.subscribe(val => {
//     u = val
// })


// if (browser && u == null) {
//     // const t: string | null = localStorage.getItem(COOKIE_KEY)
//     // const k: string | null = localStorage.getItem(COOKIE_KEY_EXP)
//     // const u: string | null = localStorage.getItem(COOKIE_KEY_USER)
//     const host = window.location.origin

//     console.log(host)

//     fetch(`${host}/cookies?key=${COOKIE_KEY},${COOKIE_KEY_USER}`)
//         .then(res => res.json())
//         .then(res => {
//             console.log('res in fetch cookie')
//             // console.log(res)

//             const resValue: CookieResponse[] = res

//             resValue.forEach(res => {
//                 if (res.key == COOKIE_KEY) {
//                     token.set(res.value)
//                 }

//                 if (res.key == COOKIE_KEY_USER && res.value != null) {
//                     const userData: UserInterface = JSON.parse(res.value)
//                     user.set(userData)
//                     getUserData()
//                 }

//             });

//         })
//         .catch(err => {
//             console.log(err)
//             // logout()
//         })
// }


// function getUserData() {
//     axiosAPI.get('/me')
//         .then(res => {
//             const response: MeEndpointResponse = res.data
//             console.log('hooks client', response)
//             user.set(response.data)
//         });


// }