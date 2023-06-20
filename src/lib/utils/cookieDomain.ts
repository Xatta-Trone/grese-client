import { env } from "$env/dynamic/private";



// cookie domain 
const cookieDomainEnv = env.APP_URL
const u = new URL(cookieDomainEnv)
let cookieDomain = u.hostname

if (cookieDomain.includes("gre-sentence-equivalence.com")) {
    cookieDomain = "gre-sentence-equivalence.com"
}

export default cookieDomain