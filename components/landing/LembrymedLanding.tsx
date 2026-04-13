import { useState } from "react";

const S = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600;700;800;900&family=DM+Sans:wght@400;500;600;700&display=swap');
* { margin:0; padding:0; box-sizing:border-box; }
:root {
  --green: #1A5632; --green-light: #E8F0EB; --green-mid: #2D7A4A;
  --bg: #FEFEFE; --text: #1A1A1A; --sub: #4B5563; --hint: #9CA3AF;
  --card: #F8FAF9; --border: #E0E7E3;
  --font: 'DM Sans', sans-serif; --serif: 'Playfair Display', serif;
}
body { font-family: var(--font); color: var(--text); background: var(--bg); }
.container { max-width: 1080px; margin: 0 auto; padding: 0 24px; }
.nav { padding: 16px 0; border-bottom: 1px solid var(--border); background: #fff; position: sticky; top: 0; z-index: 50; }
.nav-inner { display: flex; justify-content: space-between; align-items: center; }
.nav-logo { height: 32px; }
.nav-cta { background: var(--green); color: #fff; padding: 10px 24px; border-radius: 8px; border: none; font-size: 14px; font-weight: 600; cursor: pointer; font-family: var(--font); }
.nav-cta:hover { background: var(--green-mid); }
.hero { padding: 80px 0 60px; text-align: center; background: linear-gradient(180deg, var(--green-light) 0%, #FEFEFE 100%); }
.hero-pill { display: inline-block; background: var(--green-light); color: var(--green); padding: 6px 16px; border-radius: 20px; font-size: 13px; font-weight: 600; margin-bottom: 20px; border: 1px solid var(--border); }
.hero h1 { font-family: var(--serif); font-size: 46px; font-weight: 800; line-height: 1.12; max-width: 700px; margin: 0 auto 16px; color: var(--green); }
.hero p { font-size: 18px; color: var(--sub); max-width: 520px; margin: 0 auto 32px; line-height: 1.65; }
.hero-cta { display: inline-block; background: var(--green); color: #fff; padding: 16px 40px; border-radius: 10px; font-size: 16px; font-weight: 700; border: none; cursor: pointer; font-family: var(--font); box-shadow: 0 4px 14px rgba(26,86,50,0.25); }
.hero-cta:hover { background: var(--green-mid); }
.hero-sub { margin-top: 12px; font-size: 13px; color: var(--hint); }
.stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; padding: 48px 0; }
.stat { text-align: center; padding: 28px 16px; background: var(--card); border-radius: 14px; border: 1px solid var(--border); }
.stat-num { font-family: var(--serif); font-size: 38px; font-weight: 800; color: var(--green); }
.stat-label { font-size: 13px; color: var(--sub); margin-top: 6px; line-height: 1.4; }
.section { padding: 64px 0; }
.section-title { text-align: center; font-family: var(--serif); font-size: 32px; font-weight: 700; color: var(--green); margin-bottom: 8px; }
.section-sub { text-align: center; color: var(--sub); font-size: 16px; margin-bottom: 44px; }
.steps { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
.step { background: var(--card); border: 1px solid var(--border); border-radius: 16px; padding: 32px 24px; text-align: center; }
.step:hover { box-shadow: 0 8px 24px rgba(26,86,50,0.08); }
.step-num { width: 44px; height: 44px; background: var(--green); color: #fff; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-family: var(--serif); font-size: 20px; font-weight: 700; margin-bottom: 16px; }
.step h3 { font-size: 17px; font-weight: 600; margin-bottom: 8px; }
.step p { font-size: 14px; color: var(--sub); line-height: 1.55; }
.wa-section { padding: 64px 0; background: var(--card); border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); }
.wa-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 48px; align-items: center; }
.wa-phone { background: #E5DDD5; border-radius: 16px; padding: 20px; max-width: 360px; margin: 0 auto; box-shadow: 0 8px 30px rgba(0,0,0,0.1); }
.wa-header { background: var(--green); color: #fff; padding: 10px 14px; border-radius: 12px 12px 0 0; margin: -20px -20px 16px; font-size: 14px; font-weight: 600; }
.wa-msg { background: #fff; border-radius: 0 8px 8px 8px; padding: 10px 14px; margin-bottom: 8px; font-size: 13.5px; line-height: 1.5; box-shadow: 0 1px 1px rgba(0,0,0,0.05); }
.wa-msg.bot { background: #DCF8C6; border-radius: 8px 0 8px 8px; }
.wa-msg .time { font-size: 10px; color: #999; text-align: right; margin-top: 4px; }
.wa-msg strong { color: var(--text); }
.wa-text h3 { font-family: var(--serif); font-size: 26px; font-weight: 700; margin-bottom: 14px; color: var(--green); }
.wa-text p { color: var(--sub); line-height: 1.65; font-size: 15px; margin-bottom: 16px; }
.wa-check { display: flex; align-items: flex-start; gap: 10px; margin-bottom: 10px; font-size: 14px; color: var(--sub); }
.wa-check span { color: var(--green); font-size: 18px; font-weight: 700; }
.pricing { padding: 64px 0; text-align: center; }
.price-card { max-width: 440px; margin: 0 auto; background: #fff; border: 2px solid var(--green); border-radius: 20px; padding: 40px; box-shadow: 0 12px 40px rgba(26,86,50,0.08); }
.price-badge { display: inline-block; background: var(--green); color: #fff; padding: 5px 16px; border-radius: 20px; font-size: 12px; font-weight: 600; margin-bottom: 20px; }
.price-amount { font-family: var(--serif); font-size: 52px; font-weight: 800; color: var(--green); }
.price-per { font-size: 16px; color: var(--sub); }
.price-monthly { font-size: 14px; color: var(--hint); margin: 6px 0 24px; }
.price-features { text-align: left; margin-bottom: 28px; }
.price-feat { display: flex; align-items: center; gap: 10px; padding: 7px 0; font-size: 14px; color: var(--sub); }
.price-feat span { color: var(--green); font-weight: 700; }
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.45); display: flex; align-items: center; justify-content: center; z-index: 999; }
.modal { background: #fff; border-radius: 20px; padding: 40px; max-width: 440px; width: 92%; }
.form-group { margin-bottom: 16px; }
.form-group label { display: block; font-size: 13px; font-weight: 500; margin-bottom: 6px; color: var(--sub); }
.form-input { width: 100%; padding: 13px 14px; border: 1px solid var(--border); border-radius: 10px; font-size: 15px; font-family: var(--font); outline: none; }
.form-input:focus { border-color: var(--green); box-shadow: 0 0 0 3px rgba(26,86,50,0.08); }
.faq { padding: 64px 0; }
.faq-item { border-bottom: 1px solid var(--border); padding: 18px 0; cursor: pointer; }
.faq-q { font-weight: 600; font-size: 15px; display: flex; justify-content: space-between; align-items: center; }
.faq-a { font-size: 14px; color: var(--sub); line-height: 1.6; margin-top: 10px; }
.footer { padding: 36px 0; border-top: 1px solid var(--border); text-align: center; background: var(--card); }
.footer p { font-size: 12px; color: var(--hint); }
.footer .disc { font-size: 11px; color: var(--hint); margin-top: 6px; font-style: italic; }
@media(max-width:768px) {
  .hero h1 { font-size: 30px; }
  .stats { grid-template-columns: repeat(2, 1fr); }
  .steps { grid-template-columns: 1fr; }
  .wa-grid { grid-template-columns: 1fr; }
}
`;

const FAQS = [
  { q: "Preciso baixar algum aplicativo?", a: "Não. O Lembrymed funciona 100% via WhatsApp, que você já usa." },
  { q: "Como cadastro meus medicamentos?", a: "Digite em linguagem natural ou envie foto da receita. Nossa IA identifica tudo." },
  { q: "O que acontece se eu não responder?", a: "Após 30 minutos, seu familiar cadastrado recebe um alerta automático." },
  { q: "Posso alterar meus medicamentos depois?", a: "Sim. Envie ALTERAR no WhatsApp e nossa equipe auxiliará." },
  { q: "Isso substitui meu médico?", a: "Não. O Lembrymed é apenas um serviço de lembretes." },
];

export default function LembrymedLanding() {
  const [show, setShow] = useState(false);
  const [faq, setFaq] = useState(-1);
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const Logo = ({ h = 32 }) => <img src="/logo.png" alt="Lembrymed" style={{ height: h, objectFit: "contain" }} />;

  return (<>
    <style>{S}</style>
    <nav className="nav"><div className="container nav-inner"><Logo h={32} /><button className="nav-cta" onClick={() => setShow(true)}>Assinar agora</button></div></nav>

    <section className="hero"><div className="container">
      <Logo h={64} /><br/><br/>
      <div className="hero-pill">100% via WhatsApp — sem app</div>
      <h1>Nunca mais esqueça seus medicamentos</h1>
      <p>Lembretes inteligentes direto no seu WhatsApp. Cadastre uma vez, receba avisos todos os dias. Se esquecer, seu familiar é avisado.</p>
      <button className="hero-cta" onClick={() => setShow(true)}>Assinar por R$ 149/ano</button>
      <div className="hero-sub">Equivale a R$ 12,42/mês — cancele quando quiser</div>
    </div></section>

    <section className="container"><div className="stats">
      <div className="stat"><div className="stat-num">50%</div><div className="stat-label">dos pacientes crônicos esquecem medicamentos</div></div>
      <div className="stat"><div className="stat-num">98%</div><div className="stat-label">dos brasileiros usam WhatsApp</div></div>
      <div className="stat"><div className="stat-num">3x</div><div className="stat-label">lembretes por medicamento por dia</div></div>
      <div className="stat"><div className="stat-num">0</div><div className="stat-label">aplicativos para baixar</div></div>
    </div></section>

    <section className="section"><div className="container">
      <div className="section-title">Como funciona</div>
      <div className="section-sub">Da assinatura aos lembretes em menos de 5 minutos</div>
      <div className="steps">
        <div className="step"><div className="step-num">1</div><h3>Assine e cadastre</h3><p>Faça sua assinatura e cadastre seus medicamentos por texto ou foto da receita. Nossa IA identifica tudo.</p></div>
        <div className="step"><div className="step-num">2</div><h3>Receba lembretes</h3><p>30 min antes, 5 min antes e na hora. Confirme com um simples "SIM" no WhatsApp.</p></div>
        <div className="step"><div className="step-num">3</div><h3>Familiar protegido</h3><p>Se não confirmar em 30 min, seu familiar cadastrado recebe alerta automático.</p></div>
      </div>
    </div></section>

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

    <section className="pricing"><div className="container">
      <div className="section-title">Plano simples, preço justo</div>
      <div className="section-sub">Sem surpresas, sem taxas escondidas</div>
      <div className="price-card">
        <div className="price-badge">Plano único</div>
        <div className="price-amount">R$ 149</div><div className="price-per">/ano</div>
        <div className="price-monthly">Equivale a R$ 12,42/mês</div>
        <div className="price-features">
          <div className="price-feat"><span>✓</span> Lembretes ilimitados via WhatsApp</div>
          <div className="price-feat"><span>✓</span> Até 20 medicamentos</div>
          <div className="price-feat"><span>✓</span> 3 lembretes por dose</div>
          <div className="price-feat"><span>✓</span> Alerta ao familiar</div>
          <div className="price-feat"><span>✓</span> Cadastro por texto ou foto</div>
          <div className="price-feat"><span>✓</span> Histórico de confirmações</div>
          <div className="price-feat"><span>✓</span> 100% WhatsApp — sem app</div>
        </div>
        <button className="hero-cta" style={{width:"100%"}} onClick={() => setShow(true)}>Começar agora</button>
      </div>
    </div></section>

    {show && <div className="modal-overlay" onClick={() => setShow(false)}><div className="modal" onClick={e => e.stopPropagation()}>
      <div style={{textAlign:"center",marginBottom:24}}><Logo h={44} /><div style={{color:"var(--sub)",fontSize:14,marginTop:8}}>Assinatura Anual — R$ 149,00</div></div>
      <div className="form-group"><label>Seu nome completo</label><input className="form-input" placeholder="João da Silva" value={form.name} onChange={e => setForm({...form, name: e.target.value})} /></div>
      <div className="form-group"><label>E-mail</label><input className="form-input" type="email" placeholder="joao@email.com" value={form.email} onChange={e => setForm({...form, email: e.target.value})} /></div>
      <div className="form-group"><label>WhatsApp (com DDD)</label><input className="form-input" placeholder="11 99999-9999" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} /></div>
      <button className="hero-cta" style={{width:"100%",marginTop:8}}>Pagar com cartão ou Pix</button>
      <div style={{textAlign:"center",fontSize:11,color:"var(--hint)",marginTop:12}}>Pagamento seguro via Stripe</div>
    </div></div>}

    <section className="faq"><div className="container">
      <div className="section-title">Perguntas frequentes</div>
      <div style={{maxWidth:640,margin:"24px auto 0"}}>
        {FAQS.map((f, i) => <div className="faq-item" key={i} onClick={() => setFaq(faq === i ? -1 : i)}>
          <div className="faq-q">{f.q} <span style={{fontSize:20,color:"var(--green)"}}>{faq === i ? "−" : "+"}</span></div>
          {faq === i && <div className="faq-a">{f.a}</div>}
        </div>)}
      </div>
    </div></section>

    <footer className="footer"><div className="container">
      <Logo h={24} /><br/>
      <p style={{marginTop:8}}>BIZZ.IA Intelligence Ecosystem © 2026</p>
      <p className="disc">Este serviço não substitui orientação médica profissional.</p>
    </div></footer>
  </>);
}
