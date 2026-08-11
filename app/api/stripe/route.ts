import Stripe from 'stripe';
import { NextResponse } from 'next/server';
export async function POST(req: Request) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, { apiVersion: '2023-10-16' });
  const { userId, email, plan } = await req.json();
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'], customer_email: email, metadata: { userId },
      line_items: [{ price: plan === 'premium' ? 'price_PREMIUM_ID' : 'price_ULTIMATE_ID', quantity: 1 }],
      mode: 'subscription', success_url: `${req.headers.get('origin')}/`, cancel_url: `${req.headers.get('origin')}/`
    });
    return NextResponse.json({ url: session.url });
  } catch (error: any) { return NextResponse.json({ error: error.message }, { status: 500 }); }
}
