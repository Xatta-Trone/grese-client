import { browser } from "$app/environment";
import { setUser, hasAuthInitialized } from "$lib/services/auth";
import type { UserInterface } from "$lib/services/auth";


console.log('client hooks called')

console.log(browser)

if (browser) {
    hasAuthInitialized.set(true)
    const token = localStorage.getItem('token')
    const user = localStorage.getItem('user')

    if (token != null && user != null) {
        const u: UserInterface = JSON.parse(user)
        setUser(token, u)
    }

    console.log(token, user)
}

