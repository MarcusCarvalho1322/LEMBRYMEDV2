'use client';

import { useState } from 'react';

export default function CheckoutPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.phone) return alert('Preencha todos os campos');
    setLoading(true);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else alert('Erro ao criar checkout');
    } catch { alert('Erro de conexão'); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F8FAF9', padding: 24 }}>
      <div style={{ background: '#fff', borderRadius: 20, padding: 40, maxWidth: 440, width: '100%', boxShadow: '0 12px 40px rgba(26,86,50,0.08)', border: '1px solid #E0E7E3' }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <img src="/logo.png" alt="Lembrymed" style={{ height: 44, marginBottom: 8 }} />
          <div style={{ color: '#4B5563', fontSize: 14 }}>Assinatura Anual — R$ 149,00</div>
        </div>
        {[
          { key: 'name', label: 'Seu nome completo', placeholder: 'João da Silva', type: 'text' },
          { key: 'email', label: 'E-mail', placeholder: 'joao@email.com', type: 'email' },
          { key: 'phone', label: 'WhatsApp (com DDD)', placeholder: '11 99999-9999', type: 'tel' },
        ].map(f => (
          <div key={f.key} style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 6, color: '#4B5563' }}>{f.label}</label>
            <input
              type={f.type} placeholder={f.placeholder}
              value={(form as any)[f.key]}
              onChange={e => setForm({ ...form, [f.key]: e.target.value })}
              style={{ width: '100%', padding: '13px 14px', border: '1px solid #E0E7E3', borderRadius: 10, fontSize: 15, fontFamily: 'var(--font)', outline: 'none' }}
            />
          </div>
        ))}
        <button
          onClick={handleSubmit} disabled={loading}
          style={{ width: '100%', marginTop: 8, background: '#1A5632', color: '#fff', padding: 16, borderRadius: 10, fontSize: 16, fontWeight: 700, border: 'none', cursor: 'pointer', fontFamily: 'var(--font)', opacity: loading ? 0.6 : 1 }}
        >
          {loading ? 'Processando...' : 'Pagar com cartão ou Pix'}
        </button>
        <div style={{ textAlign: 'center', fontSize: 11, color: '#9CA3AF', marginTop: 12 }}>Pagamento seguro via Stripe</div>
      </div>
    </div>
  );
}
