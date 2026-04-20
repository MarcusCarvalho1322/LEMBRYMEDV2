'use client';

import { useState, useEffect, useRef } from "react";

const S = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600;700;800;900&family=DM+Sans:wght@400;500;600;700&display=swap');
* { margin:0; padding:0; box-sizing:border-box; }
:root {
  --green: #1A5632; --green-light: #E8F0EB; --green-mid: #2D7A4A; --green-dark: #0F3D23;
  --bg: #FEFEFE; --text: #1A1A1A; --sub: #4B5563; --hint: #9CA3AF;
  --card: #F8FAF9; --border: #1A5632;
  --font: 'DM Sans', sans-serif; --serif: 'Playfair Display', serif;
}
body { font-family: var(--font); color: var(--text); background: var(--bg); }
.container { max-width: 1080px; margin: 0 auto; padding: 0 24px; }

/* ── NAV ── */
.nav {
  padding: 14px 0;
  background: var(--green);
  position: sticky; top: 0; z-index: 50;
  box-shadow: 0 2px 16px rgba(0,0,0,0.18);
}
.nav-inner { display: flex; justify-content: space-between; align-items: center; }
.nav-logo { height: 42px; filter: brightness(0) invert(1); }
.nav-cta {
  background: #fff; color: var(--green);
  padding: 10px 26px; border-radius: 8px; border: none;
  font-size: 14px; font-weight: 700; cursor: pointer; font-family: var(--font);
  transition: all .2s;
}
.nav-cta:hover { background: var(--green-light); transform: translateY(-1px); box-shadow: 0 4px 12px rgba(0,0,0,0.15); }

/* ── IMPACT HERO (nova seção) ── */
.impact {
  background: linear-gradient(135deg, var(--green-dark) 0%, var(--green) 60%, #22614a 100%);
  min-height: 92vh;
  display: flex; align-items: center; justify-content: center;
  text-align: center;
  position: relative; overflow: hidden;
  padding: 80px 0;
}
.impact::before {
  content: '';
  position: absolute; inset: 0;
  background: radial-gradient(ellipse 70% 50% at 50% 60%, rgba(255,255,255,0.04) 0%, transparent 70%);
  pointer-events: none;
}
.impact-bg-number {
  position: absolute;
  font-family: var(--serif);
  font-size: clamp(220px, 35vw, 460px);
  font-weight: 900;
  color: rgba(255,255,255,0.03);
  line-height: 1;
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
  user-select: none;
  letter-spacing: -10px;
}
.impact-inner { position: relative; z-index: 2; }
.impact-eyebrow {
  display: inline-block;
  background: rgba(255,255,255,0.12);
  border: 1px solid rgba(255,255,255,0.22);
  color: #B9F5CC;
  padding: 6px 18px; border-radius: 20px;
  font-size: 12px; font-weight: 600; letter-spacing: 1.2px;
  text-transform: uppercase; margin-bottom: 28px;
  opacity: 0; animation: fadeInDown .7s .1s forwards;
}
.impact h1 {
  font-family: var(--serif);
  font-size: clamp(32px, 5.5vw, 62px);
  font-weight: 900;
  color: #fff;
  max-width: 820px; margin: 0 auto 24px;
  line-height: 1.1;
  opacity: 0; animation: fadeInUp .8s .3s forwards;
}
.impact h1 .highlight {
  color: #5EE88A;
  position: relative; display: inline-block;
}
.impact-sub {
  font-size: clamp(17px, 2.2vw, 22px);
  color: rgba(255,255,255,0.72);
  max-width: 520px; margin: 0 auto 44px;
  line-height: 1.6;
  opacity: 0; animation: fadeInUp .8s .55s forwards;
}
.impact-cta {
  display: inline-block;
  background: #fff; color: var(--green);
  padding: 18px 48px; border-radius: 12px;
  font-size: 16px; font-weight: 700;
  border: none; cursor: pointer; font-family: var(--font);
  box-shadow: 0 8px 28px rgba(0,0,0,0.25);
  transition: all .25s;
  opacity: 0; animation: fadeInUp .8s .75s forwards;
}
.impact-cta:hover { transform: translateY(-3px); box-shadow: 0 14px 36px rgba(0,0,0,0.3); background: #f0fff4; }
.impact-hint {
  font-size: 12px; color: rgba(255,255,255,0.45);
  margin-top: 14px;
  opacity: 0; animation: fadeInUp .6s .95s forwards;
}
.impact-dots {
  display: flex; justify-content: center; gap: 8px; margin-top: 52px;
  opacity: 0; animation: fadeInUp .6s 1.1s forwards;
}
.impact-dot {
  width: 8px; height: 8px; border-radius: 50%;
  background: rgba(255,255,255,0.25);
  animation: dotPulse 2.4s infinite;
}
.impact-dot:nth-child(2) { animation-delay: .4s; }
.impact-dot:nth-child(3) { animation-delay: .8s; }

/* ── HERO ORIGINAL ── */
.hero { padding: 80px 0 60px; text-align: center; background: linear-gradient(180deg, var(--green-light) 0%, #FEFEFE 100%); }
.hero-pill { display: inline-block; background: var(--green-light); color: var(--green); padding: 6px 16px; border-radius: 20px; font-size: 13px; font-weight: 600; margin-bottom: 20px; border: 1px solid var(--border); }
.hero h1 { font-family: var(--serif); font-size: 46px; font-weight: 800; line-height: 1.12; max-width: 700px; margin: 0 auto 16px; color: var(--green); }
.hero p { font-size: 18px; color: var(--sub); max-width: 520px; margin: 0 auto 32px; line-height: 1.65; }
.hero-cta { display: inline-block; background: var(--green); color: #fff; padding: 16px 40px; border-radius: 10px; font-size: 16px; font-weight: 700; border: none; cursor: pointer; font-family: var(--font); box-shadow: 0 4px 14px rgba(26,86,50,0.25); transition: all .2s; }
.hero-cta:hover { background: var(--green-mid); transform: translateY(-2px); box-shadow: 0 8px 22px rgba(26,86,50,0.3); }
.hero-sub { margin-top: 12px; font-size: 13px; color: var(--hint); }

/* ── STATS — bordas verdes dinâmicas ── */
.stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; padding: 48px 0; }
.stat {
  text-align: center; padding: 28px 16px;
  background: var(--card);
  border-radius: 14px;
  border: 2px solid var(--border);
  position: relative; overflow: hidden;
  transition: all .3s cubic-bezier(.34,1.56,.64,1);
  opacity: 0; transform: translateY(24px);
}
.stat.visible { opacity: 1; transform: translateY(0); }
.stat::before {
  content: '';
  position: absolute; inset: 0;
  background: linear-gradient(135deg, rgba(26,86,50,0.04) 0%, transparent 60%);
  opacity: 0; transition: opacity .3s;
}
.stat:hover { transform: translateY(-4px) scale(1.02); box-shadow: 0 12px 32px rgba(26,86,50,0.14); border-color: var(--green-mid); }
.stat:hover::before { opacity: 1; }
.stat-num { font-family: var(--serif); font-size: 38px; font-weight: 800; color: var(--green); }
.stat-label { font-size: 13px; color: var(--sub); margin-top: 6px; line-height: 1.4; }

/* ── SECTIONS ── */
.section { padding: 64px 0; }
.section-title { text-align: center; font-family: var(--serif); font-size: 32px; font-weight: 700; color: var(--green); margin-bottom: 8px; }
.section-sub { text-align: center; color: var(--sub); font-size: 16px; margin-bottom: 44px; }

/* ── STEPS — bordas verdes dinâmicas ── */
.steps { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
.step {
  background: var(--card);
  border: 2px solid var(--border);
  border-radius: 16px; padding: 32px 24px; text-align: center;
  transition: all .3s cubic-bezier(.34,1.56,.64,1);
  position: relative; overflow: hidden;
  opacity: 0; transform: translateY(24px);
}
.step.visible { opacity: 1; transform: translateY(0); }
.step::after {
  content: '';
  position: absolute;
  bottom: 0; left: 0; right: 0; height: 3px;
  background: linear-gradient(90deg, var(--green), #5EE88A, var(--green));
  background-size: 200% 100%;
  transform: scaleX(0); transform-origin: left;
  transition: transform .4s ease;
  animation: none;
}
.step:hover { box-shadow: 0 12px 32px rgba(26,86,50,0.14); transform: translateY(-5px); border-color: var(--green-mid); }
.step:hover::after { transform: scaleX(1); animation: shimmer 1.5s infinite; }
.step-num { width: 44px; height: 44px; background: var(--green); color: #fff; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-family: var(--serif); font-size: 20px; font-weight: 700; margin-bottom: 16px; }
.step h3 { font-size: 17px; font-weight: 600; margin-bottom: 8px; }
.step p { font-size: 14px; color: var(--sub); line-height: 1.55; }

/* ── WA SECTION ── */
.wa-section { padding: 64px 0; background: var(--card); border-top: 2px solid var(--border); border-bottom: 2px solid var(--border); }
.wa-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 48px; align-items: center; }
.wa-phone { background: #E5DDD5; border-radius: 16px; padding: 20px; max-width: 360px; margin: 0 auto; box-shadow: 0 8px 30px rgba(0,0,0,0.1); border: 2px solid var(--border); }
.wa-header { background: var(--green); color: #fff; padding: 10px 14px; border-radius: 12px 12px 0 0; margin: -20px -20px 16px; font-size: 14px; font-weight: 600; }
.wa-msg { background: #fff; border-radius: 0 8px 8px 8px; padding: 10px 14px; margin-bottom: 8px; font-size: 13.5px; line-height: 1.5; box-shadow: 0 1px 1px rgba(0,0,0,0.05); }
.wa-msg.bot { background: #DCF8C6; border-radius: 8px 0 8px 8px; }
.wa-msg .time { font-size: 10px; color: #999; text-align: right; margin-top: 4px; }
.wa-msg strong { color: var(--text); }
.wa-text h3 { font-family: var(--serif); font-size: 26px; font-weight: 700; margin-bottom: 14px; color: var(--green); }
.wa-text p { color: var(--sub); line-height: 1.65; font-size: 15px; margin-bottom: 16px; }
.wa-check { display: flex; align-items: flex-start; gap: 10px; margin-bottom: 10px; font-size: 14px; color: var(--sub); }
.wa-check span { color: var(--green); font-size: 18px; font-weight: 700; }

/* ── PRICING ── */
.pricing { padding: 64px 0; text-align: center; }
.price-card {
  max-width: 440px; margin: 0 auto; background: #fff;
  border: 2px solid var(--border);
  border-radius: 20px; padding: 40px;
  box-shadow: 0 12px 40px rgba(26,86,50,0.08);
  transition: all .3s;
  position: relative; overflow: hidden;
}
.price-card::before {
  content: '';
  position: absolute; top: 0; left: 0; right: 0; height: 4px;
  background: linear-gradient(90deg, var(--green), #5EE88A, var(--green));
  background-size: 200% 100%;
  animation: shimmer 3s infinite;
}
.price-card:hover { transform: translateY(-4px); box-shadow: 0 20px 52px rgba(26,86,50,0.16); }
.price-badge { display: inline-block; background: var(--green); color: #fff; padding: 5px 16px; border-radius: 20px; font-size: 12px; font-weight: 600; margin-bottom: 20px; }
.price-amount { font-family: var(--serif); font-size: 52px; font-weight: 800; color: var(--green); }
.price-per { font-size: 16px; color: var(--sub); }
.price-monthly { font-size: 14px; color: var(--hint); margin: 6px 0 24px; }
.price-features { text-align: left; margin-bottom: 28px; }
.price-feat { display: flex; align-items: center; gap: 10px; padding: 7px 0; font-size: 14px; color: var(--sub); border-bottom: 1px solid rgba(26,86,50,0.08); }
.price-feat:last-child { border-bottom: none; }
.price-feat span { color: var(--green); font-weight: 700; }

/* ── MODAL ── */
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.45); display: flex; align-items: center; justify-content: center; z-index: 999; }
.modal { background: #fff; border-radius: 20px; padding: 40px; max-width: 440px; width: 92%; border: 2px solid var(--border); }
.form-group { margin-bottom: 16px; }
.form-group label { display: block; font-size: 13px; font-weight: 500; margin-bottom: 6px; color: var(--sub); }
.form-input { width: 100%; padding: 13px 14px; border: 1.5px solid #E0E7E3; border-radius: 10px; font-size: 15px; font-family: var(--font); outline: none; transition: border-color .2s; }
.form-input:focus { border-color: var(--green); box-shadow: 0 0 0 3px rgba(26,86,50,0.08); }

/* ── FAQ ── */
.faq { padding: 64px 0; }
.faq-item {
  border-bottom: 1px solid rgba(26,86,50,0.15);
  padding: 18px 0; cursor: pointer;
  transition: all .2s;
}
.faq-item:hover { padding-left: 8px; }
.faq-q { font-weight: 600; font-size: 15px; display: flex; justify-content: space-between; align-items: center; }
.faq-a { font-size: 14px; color: var(--sub); line-height: 1.6; margin-top: 10px; border-left: 3px solid var(--green); padding-left: 12px; }

/* ── FOOTER ── */
.footer { padding: 36px 0; border-top: 2px solid var(--border); text-align: center; background: var(--card); }
.footer p { font-size: 12px; color: var(--hint); }
.footer .disc { font-size: 11px; color: var(--hint); margin-top: 6px; font-style: italic; }

/* ── KEYFRAMES ── */
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(28px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes fadeInDown {
  from { opacity: 0; transform: translateY(-16px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes shimmer {
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
@keyframes dotPulse {
  0%, 80%, 100% { opacity: .25; transform: scale(1); }
  40%           { opacity: 1;   transform: scale(1.4); }
}
@keyframes borderGlow {
  0%, 100% { box-shadow: 0 0 0 0 rgba(26,86,50,0); }
  50%       { box-shadow: 0 0 0 4px rgba(26,86,50,0.12); }
}

/* ── RESPONSIVE ── */
@media(max-width:768px) {
  .impact h1 { font-size: 30px; }
  .impact-cta { padding: 15px 32px; }
  .hero h1 { font-size: 30px; }
  .stats { grid-template-columns: repeat(2, 1fr); }
  .steps { grid-template-columns: 1fr; }
  .wa-grid { grid-template-columns: 1fr; }
  .nav-logo { height: 34px; }
}
`;

const FAQS = [
  { q: "Preciso baixar algum aplicativo?", a: "Não. O Lembrymed funciona 100% via WhatsApp, que você já usa." },
  { q: "Como cadastro meus medicamentos?", a: "Digite em linguagem natural ou envie foto da receita. Nossa IA identifica tudo." },
  { q: "O que acontece se eu não responder?", a: "Após 30 minutos, seu familiar cadastrado recebe um alerta automático." },
  { q: "Posso alterar meus medicamentos depois?", a: "Sim. Envie ALTERAR no WhatsApp e nossa equipe auxiliará." },
  { q: "Isso substitui meu médico?", a: "Não. O Lembrymed é apenas um serviço de lembretes." },
];

function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.15 }
    );
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return { ref, visible };
}

export default function LembrymedLanding() {
  const [show, setShow] = useState(false);
  const [faq, setFaq] = useState(-1);
  const [form, setForm] = useState({ name: "", email: "", phone: "" });

  const stats = useReveal();
  const steps = useReveal();

  const Logo = ({ h, white }: { h: number; white?: boolean }) => (
    <img
      src="/logo.png"
      alt="Lembrymed"
      style={{ height: h, objectFit: "contain" as const, filter: white ? "brightness(0) invert(1)" : "none" }}
    />
  );

  return (<>
    <style>{S}</style>

    {/* ── NAV verde com logo branca ── */}
    <nav className="nav">
      <div className="container nav-inner">
        <Logo h={42} white />
        <button className="nav-cta" onClick={() => setShow(true)}>Assinar agora</button>
      </div>
    </nav>

    {/* ── NOVA HERO DE IMPACTO ── */}
    <section className="impact">
      <div className="impact-bg-number">5/10</div>
      <div className="container impact-inner">
        <div className="impact-eyebrow">📊 Dado Clínico — OMS / Fiocruz</div>
        <h1>
          <span className="highlight">5 em cada 10</span> pacientes não tomam
          suas medicações de forma correta
        </h1>
        <p className="impact-sub">
          A principal causa é o <strong style={{color:'#fff', fontWeight:700}}>esquecimento</strong>.
          Uma solução simples pode mudar esse número.
        </p>
        <button className="impact-cta" onClick={() => setShow(true)}>
          Quero parar de esquecer →
        </button>
        <div className="impact-hint">Já ajudamos centenas de pacientes · Sem app · 100% WhatsApp</div>
        <div className="impact-dots">
          <div className="impact-dot" />
          <div className="impact-dot" />
          <div className="impact-dot" />
        </div>
      </div>
    </section>

    {/* ── HERO ORIGINAL ── */}
    <section className="hero"><div className="container">
      <Logo h={64} /><br/><br/>
      <div className="hero-pill">100% via WhatsApp — sem app</div>
      <h1>Nunca mais esqueça seus medicamentos</h1>
      <p>Lembretes inteligentes direto no seu WhatsApp. Cadastre uma vez, receba avisos todos os dias. Se esquecer, seu familiar é avisado.</p>
      <button className="hero-cta" onClick={() => setShow(true)}>Assinar por R$ 149/ano</button>
      <div className="hero-sub">Equivale a R$ 12,42/mês — cancele quando quiser</div>
    </div></section>

    {/* ── STATS com bordas verdes animadas ── */}
    <section className="container">
      <div
        ref={stats.ref}
        className="stats"
        style={{ transitionDelay: '0ms' }}
      >
        {[
          { num: "50%", label: "dos pacientes crônicos esquecem medicamentos" },
          { num: "98%", label: "dos brasileiros usam WhatsApp" },
          { num: "3x",  label: "lembretes por medicamento por dia" },
          { num: "0",   label: "aplicativos para baixar" },
        ].map((s, i) => (
          <div
            key={i}
            className={`stat${stats.visible ? " visible" : ""}`}
            style={{ transitionDelay: `${i * 90}ms` }}
          >
            <div className="stat-num">{s.num}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>
    </section>

    {/* ── COMO FUNCIONA — cards com bordas verdes ── */}
    <section className="section">
      <div className="container">
        <div className="section-title">Como funciona</div>
        <div className="section-sub">Da assinatura aos lembretes em menos de 5 minutos</div>
        <div ref={steps.ref} className="steps">
          {[
            { n: "1", h: "Assine e cadastre", p: "Faça sua assinatura e cadastre seus medicamentos por texto ou foto da receita. Nossa IA identifica tudo." },
            { n: "2", h: "Receba lembretes",  p: "30 min antes, 5 min antes e na hora. Confirme com um simples "SIM" no WhatsApp." },
            { n: "3", h: "Familiar protegido", p: "Se não confirmar em 30 min, seu familiar cadastrado recebe alerta automático." },
          ].map((s, i) => (
            <div
              key={i}
              className={`step${steps.visible ? " visible" : ""}`}
              style={{ transitionDelay: `${i * 120}ms` }}
            >
              <div className="step-num">{s.n}</div>
              <h3>{s.h}</h3>
              <p>{s.p}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* ── WHATSAPP ── */}
    <section className="wa-section"><div className="container"><div className="wa-grid">
      <div className="wa-phone">
        <div className="wa-header">Lembrymed</div>
        <div className="wa-msg bot">Olá, João! 👋 Bem-vindo ao Lembrymed!<br/>Sua assinatura está ativa.<div className="time">09:01</div></div>
        <div className="wa-msg">Tomo losartana 50mg às 8h e metformina 850mg às 8h e 20h<div className="time">09:05 ✓✓</div></div>
        <div className="wa-msg bot">Entendi! Aqui está o que identifiquei:<br/><br/>💊 <strong>Losartana 50mg</strong> — 08:00<br/>💊 <strong>Metformina 850mg</strong> — 08:00 e 20:00<br/><br/>Está correto? (SIM para confirmar)<div className="time">09:05</div></div>
        <div className="wa-msg">SIM<div className="time">09:06 ✓✓</div></div>
        <div className="wa-msg bot">🎉 Perfeito! Seus lembretes estão ativados.<div className="time">09:06</div></div>
      </div>
      <div className="wa-text">
        <h3>Tudo pelo WhatsApp que você já usa</h3>
        <p>Sem apps novos, sem senhas, sem complicação. Cadastre em linguagem natural ou envie foto da receita.</p>
        <div className="wa-check"><span>✓</span> Identificação automática por IA</div>
        <div className="wa-check"><span>✓</span> Confirmação com registro de horário</div>
        <div className="wa-check"><span>✓</span> Alerta ao familiar se não confirmar</div>
        <div className="wa-check"><span>✓</span> Suporte a múltiplos horários</div>
      </div>
    </div></div></section>

    {/* ── PRICING ── */}
    <section className="pricing"><div className="container">
      <div className="section-title">Plano simples, preço justo</div>
      <div className="section-sub">Sem surpresas, sem taxas escondidas</div>
      <div className="price-card">
        <div className="price-badge">Plano único</div>
        <div className="price-amount">R$ 149</div><div className="price-per">/ano</div>
        <div className="price-monthly">Equivale a R$ 12,42/mês</div>
        <div className="price-features">
          {["Lembretes ilimitados via WhatsApp","Até 20 medicamentos","3 lembretes por dose","Alerta ao familiar","Cadastro por texto ou foto","Histórico de confirmações","100% WhatsApp — sem app"].map(f => (
            <div key={f} className="price-feat"><span>✓</span> {f}</div>
          ))}
        </div>
        <button className="hero-cta" style={{width:"100%"}} onClick={() => setShow(true)}>Começar agora</button>
      </div>
    </div></section>

    {/* ── MODAL ── */}
    {show && (
      <div className="modal-overlay" onClick={() => setShow(false)}>
        <div className="modal" onClick={e => e.stopPropagation()}>
          <div style={{textAlign:"center",marginBottom:24}}>
            <Logo h={44} />
            <div style={{color:"var(--sub)",fontSize:14,marginTop:8}}>Assinatura Anual — R$ 149,00</div>
          </div>
          <div className="form-group"><label>Seu nome completo</label><input className="form-input" placeholder="João da Silva" value={form.name} onChange={e => setForm({...form, name: e.target.value})} /></div>
          <div className="form-group"><label>E-mail</label><input className="form-input" type="email" placeholder="joao@email.com" value={form.email} onChange={e => setForm({...form, email: e.target.value})} /></div>
          <div className="form-group"><label>WhatsApp (com DDD)</label><input className="form-input" placeholder="11 99999-9999" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} /></div>
          <button className="hero-cta" style={{width:"100%",marginTop:8}} onClick={() => setShow(false)}>Pagar com cartão ou Pix</button>
          <div style={{textAlign:"center",fontSize:11,color:"var(--hint)",marginTop:12}}>Pagamento seguro via Stripe</div>
        </div>
      </div>
    )}

    {/* ── FAQ ── */}
    <section className="faq"><div className="container">
      <div className="section-title">Perguntas frequentes</div>
      <div style={{maxWidth:640,margin:"24px auto 0"}}>
        {FAQS.map((f, i) => (
          <div className="faq-item" key={i} onClick={() => setFaq(faq === i ? -1 : i)}>
            <div className="faq-q">{f.q} <span style={{fontSize:20,color:"var(--green)"}}>{faq === i ? "−" : "+"}</span></div>
            {faq === i && <div className="faq-a">{f.a}</div>}
          </div>
        ))}
      </div>
    </div></section>

    <footer className="footer"><div className="container">
      <Logo h={28} />
      <p style={{marginTop:8}}>BIZZ.IA Intelligence Ecosystem © 2026</p>
      <p className="disc">Este serviço não substitui orientação médica profissional.</p>
    </div></footer>
  </>);
}
