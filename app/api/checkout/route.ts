/**
 * @module API Route — Checkout Stripe
 * @description Cria sessão de pagamento Stripe e retorna URL de checkout.
 * Chamado pelo formulário da página /checkout.
 */

import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia' as any,
});

/**
 * Normaliza número de telefone para formato E.164 brasileiro.
 */
function formatPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.startsWith('55') && digits.length >= 12) return digits;
  if (digits.length === 11) return `55${digits}`;
  if (digits.length === 10) return `55${digits}`;
  return `55${digits}`;
}

export async function POST(req: NextRequest) {
  try {
    const { name, email, phone } = await req.json();

    if (!name || !email || !phone) {
      return NextResponse.json(
        { error: 'Nome, e-mail e telefone são obrigatórios' },
        { status: 400 }
      );
    }

    const formattedPhone = formatPhone(phone);
    const webUrl = process.env.NEXT_PUBLIC_WEB_URL || process.env.NEXTAUTH_URL || 'https://lembrymed.vercel.app';

    // Criar sessão de checkout Stripe
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [
        {
          price: process.env.STRIPE_PRICE_ANNUAL!,
          quantity: 1,
        },
      ],
      customer_email: email,
      metadata: {
        name,
        phone: formattedPhone,
        source: 'landing-page',
      },
      phone_number_collection: {
        enabled: false, // Já coletamos no formulário
      },
      custom_text: {
        submit: {
          message: 'Após o pagamento você receberá uma mensagem no WhatsApp para ativar seus lembretes.',
        },
      },
      success_url: `${webUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${webUrl}/checkout?canceled=1`,
      locale: 'pt-BR',
      payment_method_types: ['card', 'boleto'],
      billing_address_collection: 'required',
      allow_promotion_codes: true,
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error('Checkout error:', error.message);
    return NextResponse.json(
      { error: 'Erro ao criar sessão de pagamento' },
      { status: 500 }
    );
  }
}
