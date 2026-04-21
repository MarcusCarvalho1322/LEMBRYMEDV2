/**
 * @module Webhook WhatsApp (Z-API)
 * @description Recebe mensagens dos pacientes via Z-API e roteia:
 * - Se está em onboarding → conversa com Claude (messages.create)
 * - Se é paciente ativo  → processa SIM/NÃO de lembrete
 *
 * Formato Z-API (diferente do 360dialog):
 *   body.phone        → número do remetente
 *   body.text.message → conteúdo de texto
 *   body.image        → objeto com imageUrl
 *   body.fromMe       → true se a mensagem foi enviada por nós
 *   body.type         → "ReceivedCallback" para mensagens recebidas
 */

import { Router } from 'express';
import Anthropic from '@anthropic-ai/sdk';
import {
  db, patients, messageLogs, medicationConfirmations,
  reminderLogs, medications, eq, and, desc,
} from '@lembrymed/database';
import { sql } from 'drizzle-orm';
import { WhatsAppClient } from '../../clients/dialog360.client';
import { logger } from '@lembrymed/shared/logger';

const router = Router();
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const whatsapp = new WhatsAppClient();

// ═══════════════════════════════════════════════════════════
// WEBHOOK PRINCIPAL
// ═══════════════════════════════════════════════════════════

router.post('/webhook/whatsapp', async (req, res) => {
  res.sendStatus(200); // Responder imediatamente ao Z-API

  const body = req.body as any;

  // Z-API pode enviar arrays (batch) ou objeto único
  const payloads: any[] = Array.isArray(body) ? body : [body];

  for (const payload of payloads) {
    try {
      await processWebhookPayload(payload);
    } catch (err: any) {
      logger.error('Erro ao processar payload WhatsApp', {
        error: err.message,
        stack: err.stack,
        phone: payload?.phone,
      });
    }
  }
});

async function processWebhookPayload(payload: any): Promise<void> {
  // Ignorar mensagens enviadas por nós e non-ReceivedCallback
  if (payload.fromMe === true) return;
  if (payload.type && payload.type !== 'ReceivedCallback') return;

  // Extrair dados do formato Z-API
  const phone = payload.phone as string | undefined;
  const text = (payload.text?.message || payload.text?.body || '') as string;
  const imageUrl = payload.image?.imageUrl || payload.image?.url || null;
  const msgId = payload.zaapId || payload.msgId || null;

  if (!phone) {
    logger.debug('Payload sem phone — ignorado', { payload });
    return;
  }

  logger.info('Mensagem recebida via Z-API', {
    phone: phone.substring(0, 8) + '****',
    textLen: text?.length || 0,
    hasImage: !!imageUrl,
    msgId,
  });

  // Registrar mensagem recebida no log
  await db.insert(messageLogs).values({
    phone,
    direction: 'inbound',
    content: text || '[media]',
    mediaType: imageUrl ? 'image' : 'text',
    whatsappMessageId: msgId,
  }).catch((err) => {
    logger.warn('Falha ao registrar messageLog inbound', { error: err.message });
  });

  // Buscar paciente pelo telefone
  // Z-API envia sem 55 às vezes — tentar com e sem
  let patient = await db.query.patients.findFirst({
    where: eq(patients.phone, phone),
  });

  if (!patient && !phone.startsWith('55')) {
    patient = await db.query.patients.findFirst({
      where: eq(patients.phone, '55' + phone),
    });
  }

  if (!patient) {
    logger.debug('Mensagem de número desconhecido', {
      phone: phone.substring(0, 8) + '****',
    });
    return;
  }

  // ═══ ROTA 1: Paciente em onboarding → Claude conversa ═══
  if (patient.onboardingStep !== 'active') {
    await handleOnboardingConversation(patient, text, imageUrl);
    return;
  }

  // ═══ ROTA 2: Paciente ativo → resposta a lembrete (SIM/NÃO) ═══
  if (text) {
    const normalized = text.trim().toUpperCase();
    if (['SIM', 'S', 'SI', 'YES', '1', 'TOMEI', 'TOMEI SIM', 'JÁ TOMEI', 'JA TOMEI'].includes(normalized)) {
      await handleConfirmation(patient, 'confirmed');
    } else if (['NÃO', 'NAO', 'N', 'NO', '0', 'NÃO TOMEI', 'NAO TOMEI', 'AINDA NÃO', 'AINDA NAO'].includes(normalized)) {
      await handleConfirmation(patient, 'denied');
    }
    // Outras mensagens → silencioso por ora
  }
}

// ═══════════════════════════════════════════════════════════
// ONBOARDING: Claude API (stateless messages.create)
// ═══════════════════════════════════════════════════════════

async function handleOnboardingConversation(
  patient: { id: string; fullName: string; phone: string; onboardingStep: string | null },
  text: string,
  imageUrl: string | null,
): Promise<void> {
  const firstName = patient.fullName.split(' ')[0];
  const step = patient.onboardingStep || 'welcome_sent';

  // Buscar histórico de mensagens recentes para contexto
  const recentLogs = await db.query.messageLogs.findMany({
    where: eq(messageLogs.patientId, patient.id),
    orderBy: [desc(messageLogs.createdAt)],
    limit: 12,
  });

  // Construir histórico no formato Claude (mais antigo → mais recente)
  const history = recentLogs
    .reverse()
    .filter((m) => m.content && m.content !== '[media]')
    .map((m) => ({
      role: m.direction === 'inbound' ? ('user' as const) : ('assistant' as const),
      content: m.content as string,
    }));

  // Adicionar mensagem atual
  const userContent = imageUrl
    ? `${text ? text + '\n' : ''}[Paciente enviou uma foto — URL: ${imageUrl}]`
    : text || '[mensagem sem texto]';

  history.push({ role: 'user', content: userContent });

  // System prompt com contexto do paciente e passo atual
  const systemPrompt = buildSystemPrompt(firstName, step);

  logger.info('Chamando Claude API para onboarding', {
    patientId: patient.id,
    step,
    historyLen: history.length,
  });

  let agentReply = '';
  try {
    const response = await anthropic.messages.create({
      model: 'claude-3-5-haiku-20241022',
      max_tokens: 1024,
      system: systemPrompt,
      messages: history,
    });

    agentReply = response.content
      .filter((c) => c.type === 'text')
      .map((c) => (c as any).text as string)
      .join('');
  } catch (err: any) {
    logger.error('Falha na chamada Claude API', {
      error: err.message,
      patientId: patient.id,
    });
    await whatsapp.sendTextMessage(
      patient.phone,
      `Olá, ${firstName}! Tive um problema técnico momentâneo. Por favor, repita sua mensagem em alguns instantes. 🙏`
    );
    return;
  }

  // Limpar marcadores internos antes de enviar
  const cleanReply = agentReply
    .replace(/\[MEDICAMENTOS_CONFIRMADOS\]/g, '')
    .replace(/\[ONBOARDING_COMPLETO\]/g, '')
    .trim();

  if (!cleanReply) return;

  // Enviar resposta ao paciente
  await whatsapp.sendTextMessage(patient.phone, cleanReply);

  // Registrar resposta no log
  await db.insert(messageLogs).values({
    patientId: patient.id,
    phone: patient.phone,
    direction: 'outbound',
    content: cleanReply,
  }).catch(() => {});

  // ── Verificar transições de estado ──────────────────────────────
  if (agentReply.includes('[MEDICAMENTOS_CONFIRMADOS]') || agentReply.includes('[ONBOARDING_COMPLETO]')) {
    // Onboarding concluído → ativar paciente
    await db.update(patients)
      .set({
        onboardingStep: 'active',
        agentSessionId: null,
        updatedAt: new Date(),
      })
      .where(eq(patients.id, patient.id));

    logger.info('Paciente ativado via onboarding Claude', { patientId: patient.id });

  } else if (step === 'welcome_sent' && text.length > 5) {
    // Paciente enviou algo → avançar estado
    await db.update(patients)
      .set({ onboardingStep: 'medications_requested', updatedAt: new Date() })
      .where(eq(patients.id, patient.id));

  } else if (step === 'medications_requested') {
    // Recebeu lista de medicamentos
    await db.update(patients)
      .set({ onboardingStep: 'medications_received', updatedAt: new Date() })
      .where(eq(patients.id, patient.id));
  }
}

function buildSystemPrompt(firstName: string, step: string): string {
  return `Você é a assistente virtual do Lembrymed, um serviço de lembretes de medicamentos via WhatsApp.
Você está ajudando ${firstName} a configurar seus lembretes de medicamentos.

Estado atual do onboarding: ${step}

Suas responsabilidades:
1. Coletar a lista de medicamentos do paciente (nome, dosagem e horários de cada um)
2. Confirmar as informações com linguagem clara e amigável
3. Quando o paciente confirmar, finalizar o onboarding

Regras de comportamento:
- Responda SEMPRE em português brasileiro, de forma calorosa e simples
- Use emojis com moderação (💊 🕐 ✅)
- Se o paciente enviar foto de receita, mencione que você "viu a receita" e peça confirmação dos medicamentos
- Mantenha respostas curtas (máx. 3 parágrafos)
- NÃO peça informações que já foram fornecidas

Quando o paciente confirmar explicitamente os medicamentos listados (ex: "sim", "correto", "está certo"),
adicione o marcador [MEDICAMENTOS_CONFIRMADOS] ao final da sua resposta e encerre o onboarding
com uma mensagem de boas-vindas informando que os lembretes serão configurados em breve.

Exemplo de resposta final:
"Perfeito! Seus lembretes estão configurados. A partir de agora você receberá mensagens nos horários combinados. Qualquer dúvida, é só me chamar! 🌟 [MEDICAMENTOS_CONFIRMADOS]"`;
}

// ═══════════════════════════════════════════════════════════
// CONFIRMAÇÃO DE MEDICAMENTO (paciente ativo)
// ═══════════════════════════════════════════════════════════

async function handleConfirmation(
  patient: { id: string; fullName: string; phone: string },
  status: 'confirmed' | 'denied',
): Promise<void> {
  // Buscar último T+5 enviado hoje para este paciente
  const lastReminder = await db.execute(sql`
    SELECT id, medication_id, medication_time
    FROM reminder_logs
    WHERE patient_id = ${patient.id}::uuid
      AND reminder_type = 't_plus_5'
      AND DATE(scheduled_for) = CURRENT_DATE
    ORDER BY sent_at DESC NULLS LAST
    LIMIT 1
  `);

  if (lastReminder.rows.length === 0) {
    logger.debug('Nenhum lembrete T+5 encontrado hoje', { patientId: patient.id });
    return;
  }

  const reminder = lastReminder.rows[0] as any;

  // Registrar confirmação (upsert — ignora duplicatas)
  await db.insert(medicationConfirmations).values({
    patientId: patient.id,
    medicationId: reminder.medication_id,
    reminderLogId: reminder.id,
    confirmationStatus: status,
    medicationTime: reminder.medication_time,
    confirmedAt: new Date(),
    responseText: status === 'confirmed' ? 'SIM' : 'NÃO',
    date: new Date().toISOString().split('T')[0],
  }).onConflictDoNothing();

  // Responder ao paciente
  if (status === 'confirmed') {
    const hora = new Date().toLocaleTimeString('pt-BR', {
      hour: '2-digit', minute: '2-digit', timeZone: 'America/Sao_Paulo',
    });
    const firstName = patient.fullName.split(' ')[0];
    await whatsapp.sendTextMessage(
      patient.phone,
      `✅ Ótimo, ${firstName}! Registrado às ${hora}. Continue assim! 💪`
    );
  }
  // Se 'denied' → family alerter job vai notificar familiares
}

export default router;
