import type { RequestHandler } from './$types';
import { env } from '$env/dynamic/private';
import Stripe from 'stripe';
import { sign } from 'jsonwebtoken';

const stripeKey = env.STRIPE_PRIVATE_KEY ?? ""
const productId = env.PRODUCT_ID ?? ""
const stripe = new Stripe(stripeKey, { apiVersion: "2022-11-15" });

export const GET: RequestHandler = async ({ url }) => {

    const lineItems = [{
        price: productId,
        quantity: 1,
    }];

    const jwtSecret = env.JWT_TOKEN
    const userId = url.searchParams.get("user")

    // generate token
    const token = sign({ userId: userId }, jwtSecret);

    console.log(token)

    // It gives us a URL for the person to check out with
    const session = await stripe.checkout.sessions.create({
        line_items: lineItems,
        mode: 'payment',
        success_url: `${url.origin}/callback/success?token=${token}`,
        cancel_url: `${url.origin}/callback/cancel`,
    });

    return new Response(
        JSON.stringify({ url: session.url }),
        {
            status: 200,
            headers: { 'content-type': 'application/json' }
        }
    );
};