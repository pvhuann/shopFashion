
export const stripe = require('stripe')(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY, {
    apiVersion: '2024-09-30.acacia',
});