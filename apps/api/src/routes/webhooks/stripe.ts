/**
 * @module Webhook Stripe
 * @description Recebe confirmação de pagamento:
 *   1. Criar/atualizar paciente + assinatura no banco (upsert — tolerante a duplicatas)
 *   2. Enviar mensagem WhatsApp de boas-vindas DIRETAMENTE via Z-API
 *   3. Onboarding continua via conversa WhatsApp (Claude messages.create em whatsapp.ts)
 */

import { Router } from 'express';
import Stripe from 'stripe';
import { db, patients, subscriptions } from '@lembrymed/database';
import { eq } from 'drizzle-orm';
import { WhatsAppClient } from '../../clients/dialog360.client';
import { logger } from '@lembrymed/shared/logger';

const router = Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const whatsapp = new WhatsAppClient();

/**
 * Mensagem de boas-vindas enviada imediatamente após pagamento confirmado.
 */
function buildWelcomeMessage(name: string): string {
  const firstName = name.split(' ')[0];
  return (
    `Olá, ${firstName}! 👋\n\n` +
    `Seu pagamento foi confirmado e o *Lembrymed* está ativado! ✅\n\n` +
    `Vou te ajudar a configurar seus lembretes de medicamentos em poucos minutos.\n\n` +
    `Para começar, me diga: *quais medicamentos você toma atualmente?*\n\n` +
    `Pode me enviar a lista ou uma foto da receita 📋`
  );
}

router.post('/webhook/stripe', async (req, res) => {
  const sig = req.headers['stripe-signature'] as string;
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body, sig, process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    logger.error('Stripe webhook verification failed', { error: err.message });
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Responder imediatamente ao Stripe (evita retries)
  res.json({ received: true });

  if (event.type !== 'checkout.session.completed') return;

  const session = event.data.object as Stripe.Checkout.Session;
  const phone = session.metadata?.phone;
  const name = session.metadata?.name;
  const email = session.customer_email;

  if (!phone || !name) {
    logger.error('Missing metadata in Stripe session', { sessionId: session.id });
    return;
  }

  logger.info('Processing checkout.session.completed', { name, phone, sessionId: session.id });

  // ─── PASSO 1: Criar/atualizar paciente (tolerante a duplicatas) ───────────
  let patientId: string;
  try {
    // Tenta inserir; se o telefone já existir (pagamento repetido/teste), atualiza
    const result = await db
      .insert(patients)
      .values({
        fullName: name,
        email: email || undefined,
        phone,
        onboardingStep: 'welcome_sent',
      })
      .onConflictDoUpdate({
        target: patients.phone,
        set: {
          fullName: name,
          email: email || undefined,
          onboardingStep: 'welcome_sent',
          updatedAt: new Date(),
        },
      })
      .returning();

    patientId = result[0].id;
    logger.info('Patient upserted', { patientId, phone });

    // Subscription — ignora se já existe para este paymentIntent
    const expiresAt = new Date();
    expiresAt.setFullYear(expiresAt.getFullYear() + 1);

    await db
      .insert(subscriptions)
      .values({
        patientId,
        stripeCustomerId: session.customer as string,
        stripePaymentIntentId: session.payment_intent as string,
        amountCents: session.amount_total || 14900,
        status: 'active',
        startsAt: new Date(),
        expiresAt,
      })
      .onConflictDoNothing();

    logger.info('Subscription recorded', { patientId });
  } catch (error: any) {
    logger.error('CRITICAL: Failed to upsert patient/subscription', {
      error: error.message,
      stack: error.stack,
      phone,
      name,
    });
    return;
  }

  // ─── PASSO 2: Enviar WhatsApp de boas-vindas DIRETAMENTE ─────────────────
  try {
    const welcomeMsg = buildWelcomeMessage(name);
    const result = await whatsapp.sendTextMessage(phone, welcomeMsg);
    logger.info('WhatsApp welcome sent', {
      phone,
      messageId: result.messages?.[0]?.id,
    });

    await db.update(patients)
      .set({ onboardingStep: 'welcome_sent' })
      .where(eq(patients.id, patientId));
  } catch (error: any) {
    logger.error('Failed to send WhatsApp welcome', {
      error: error.message,
      phone,
    });
  }

  // ─── PASSO 3: Onboarding via WhatsApp ────────────────────────────────────
  // O onboarding continua automaticamente quando o paciente responder o WhatsApp.
  // O webhook /webhook/whatsapp usa Claude (messages.create) para conduzir a conversa.
  logger.info('Stripe webhook processado com sucesso — aguardando resposta do paciente no WhatsApp', {
    patientId,
    phone,
  });
});

export default router;
