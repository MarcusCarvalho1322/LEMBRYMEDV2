'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api';

export default function RenewalsPage() {
  const { token } = useAuth();
  const [renewals, setRenewals] = useState<any[]>([]);

  useEffect(() => {
    if (!token) return;
    api('/admin/renewals', { token }).then(d => setRenewals(d.renewals)).catch(() => {});
  }, [token]);

  const sendReminder = async (subId: string) => {
    if (!token) return;
    try {
      await api(`/admin/renewals/${subId}/remind`, { method: 'POST', token });
      alert('Lembrete enviado!');
    } catch { alert('Erro ao enviar'); }
  };

  return (<>
    <h1 style={{ fontSize: 22, fontWeight: 700, color: '#1A5632', marginBottom: 24 }}>Renovações</h1>
    <div style={{ background: '#fff', border: '1px solid #E0E7E3', borderRadius: 12, padding: 20 }}>
      <h2 style={{ fontSize: 15, fontWeight: 600, color: '#1A5632', marginBottom: 16 }}>Vencendo nos próximos 30 dias</h2>
      {renewals.length === 0 && <div style={{ color: '#6B7280', fontSize: 14 }}>Nenhuma assinatura vencendo.</div>}
      {renewals.map((r: any, i: number) => {
        const days = Math.round(Number(r.days_remaining));
        return (
          <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: i < renewals.length - 1 ? '1px solid #F3F4F6' : 'none' }}>
            <div>
              <div style={{ fontWeight: 500 }}>{r.full_name}</div>
              <div style={{ color: '#6B7280', fontSize: 12 }}>{r.phone}</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontWeight: 600, color: days <= 3 ? '#DC2626' : days <= 15 ? '#D97706' : '#6B7280' }}>{days} dias</div>
              <div style={{ fontSize: 11, color: '#9CA3AF' }}>p/ vencer</div>
            </div>
            <div>R$ {(Number(r.amount_cents) / 100).toFixed(0)}</div>
            <button onClick={() => sendReminder(r.sub_id)}
              style={{ padding: '5px 14px', borderRadius: 20, border: '1px solid #1A5632', color: '#1A5632', background: '#E8F0EB', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit', fontWeight: 500 }}>
              Enviar lembrete
            </button>
          </div>
        );
      })}
    </div>
  </>);
}
