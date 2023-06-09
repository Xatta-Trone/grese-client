import { env } from '$env/dynamic/private';
import { error } from '@sveltejs/kit';
import jwt from 'jsonwebtoken';
import Stripe from 'stripe';
import type { RequestHandler } from './$types';

const stripeKey = env.STRIPE_PRIVATE_KEY ?? ""
const productId = env.PRODUCT_ID ?? ""
const appURL = env.APP_URL ?? ""
const stripe = new Stripe(stripeKey, { apiVersion: "2022-11-15" });

export const GET: RequestHandler = async ({ url }) => {

    const lineItems = [{
        price: productId,
        quantity: 1,
    }];

    const jwtSecret = env.JWT_TOKEN
    const userId = url.searchParams.get("user")
    const email = url.searchParams.get("email")

    // generate token
    const token = jwt.sign({ userId: userId }, jwtSecret);

    console.log(token)

    let stripeData: Stripe.Checkout.SessionCreateParams = {
        line_items: lineItems,
        mode: 'payment',
        success_url: `${appURL}/callback/success?token=${token}`,
        cancel_url: `${appURL}/callback/cancel`,
    }
    if (email != null) {
        stripeData = Object.assign(stripeData, { ...stripeData, customer_email: email })
    }

    // It gives us a URL for the person to check out with
    const session = await stripe.checkout.sessions.create(stripeData);

    console.log(session)

    if (session.url != null) {
        return new Response(null, {
            status: 302,
            headers: {
                location: session.url
            }
        });

    } else {
        throw error(400, "session could not created")
    }

};