/** biome-ignore-all lint/style/noNonNullAssertion: STRIPE_SECRET_KEY! */
import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2026-04-22.dahlia'
})