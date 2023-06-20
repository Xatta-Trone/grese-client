import type { UserInterface } from '$lib/services/auth';
import { COOKIE_KEY, COOKIE_KEY_USER } from '$lib/utils/constants';
import type { PageServerLoad } from './$types';
import { verify } from 'jsonwebtoken';
import { env } from '$env/dynamic/private';
import axiosAPI from '$lib/services/customAxios';



export const load = (async ({ cookies, url }) => {
    let success = true
    const token = url.searchParams.get("token") ?? ""
    const jwtSecret = env.JWT_TOKEN

    let user: UserInterface | undefined = undefined

    const userCookie = cookies.get(COOKIE_KEY_USER)
    const cookieKey = cookies.get(COOKIE_KEY)

    if (userCookie != undefined) {
        user = JSON.parse(userCookie) as UserInterface;
    }

    if (user != undefined) {
        // call the api 
        console.log("calling the api")
        console.log(user)

        try {
            const decoded = verify(token, jwtSecret)
            console.log(decoded)

            if (user?.id) {
                // call the api 
                axiosAPI.get("/upgrade-user", {
                    headers: {
                        "Authorization": `Bearer ${cookieKey}`
                    }
                })
                    .then(res => {
                        console.log(res.data)
                        success = true
                    })
                    .catch(err => {
                        console.log(err.response)
                        success = false
                    })
            }

        } catch (error) {
            console.log(error)
            success = false


        }



        // verify(token, jwtSecret, function (err: null | undefined, decoded: any) {
        //     if (err != undefined || err != null) {
        //         success = false
        //         return
        //     }

        //     const { userId } = decoded
        //     console.log(userId)

        //     if (user?.id == parseInt(userId)) {
        //         // call the api 
        //         axiosAPI.get("/upgrade-user")
        //             .then(res => {
        //                 console.log(res)
        //                 success = true
        //             })
        //             .catch(err => {
        //                 console.log(err)
        //                 success = false
        //             })
        //     }

        // });
    }

    return {
        success: success
    };
}) satisfies PageServerLoad;