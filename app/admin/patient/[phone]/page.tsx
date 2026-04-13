'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useAuth } from '../../layout';
import { api } from '@/lib/api';

export default function PatientDetailPage() {
  const { phone } = useParams();
  const { token } = useAuth();
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token || !phone) return;
    api(`/admin/patients/${phone}`, { token })
      .then(setData)
      .catch(e => setError(e.message));
  }, [token, phone]);

  if (error) return <div style={{ color: '#DC2626' }}>Erro: {error}</div>;
  if (!data) return <div style={{ color: '#6B7280' }}>Carregando...</div>;

  const p = data.patient;
  const sub = p.subscriptions?.[0];

  const statusColor = (s: string) =>
    s === 'confirmed' ? '#1A5632' : s === 'denied' ? '#DC2626' : '#D97706';
  const statusLabel = (s: string) =>
    s === 'confirmed' ? 'Confirmou' : s === 'denied' ? 'Negou' : 'Sem resposta';

  return (<>
    <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
      <button onClick={() => window.history.back()} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: '#6B7280' }}>←</button>
      <div>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: '#1A5632' }}>{p.fullName}</h1>
        <div style={{ color: '#6B7280', fontSize: 13 }}>{p.phone} · {p.email || 'sem e-mail'}</div>
      </div>
      <span style={{ padding: '2px 10px', borderRadius: 20, fontSize: 11, fontWeight: 500,
        background: p.onboardingStep === 'active' ? '#E8F0EB' : '#FEF3C7',
        color: p.onboardingStep === 'active' ? '#1A5632' : '#92400E', marginLeft: 'auto' }}>
        {p.onboardingStep === 'active' ? 'Ativo' : p.onboardingStep}
      </span>
    </div>

    {/* Info cards */}
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14, marginBottom: 24 }}>
      <div style={{ background: '#fff', border: '1px solid #E0E7E3', borderRadius: 12, padding: 16 }}>
        <div style={{ fontSize: 11, color: '#6B7280', textTransform: 'uppercase' as const, marginBottom: 4 }}>Assinatura</div>
        <div style={{ fontWeight: 600 }}>{sub?.status === 'active' ? 'Ativa' : sub?.status || '—'}</div>
        {sub && <div style={{ fontSize: 12, color: '#6B7280', marginTop: 2 }}>Vence: {new Date(sub.expiresAt).toLocaleDateString('pt-BR')}</div>}
      </div>
      <div style={{ background: '#fff', border: '1px solid #E0E7E3', borderRadius: 12, padding: 16 }}>
        <div style={{ fontSize: 11, color: '#6B7280', textTransform: 'uppercase' as const, marginBottom: 4 }}>Medicamentos</div>
        <div style={{ fontWeight: 600 }}>{p.medications?.length || 0} ativos</div>
        {p.medications?.map((m: any) => (
          <div key={m.id} style={{ fontSize: 12, color: '#4B5563', marginTop: 2 }}>💊 {m.name} {m.dosage} — {m.times?.join(', ')}</div>
        ))}
      </div>
      <div style={{ background: '#fff', border: '1px solid #E0E7E3', borderRadius: 12, padding: 16 }}>
        <div style={{ fontSize: 11, color: '#6B7280', textTransform: 'uppercase' as const, marginBottom: 4 }}>Familiar</div>
        {p.familyContacts?.length > 0
          ? <div style={{ fontWeight: 500 }}>{p.familyContacts[0].name}<br/><span style={{ fontSize: 12, color: '#6B7280' }}>{p.familyContacts[0].phone}</span></div>
          : <div style={{ color: '#9CA3AF' }}>Não cadastrado</div>}
      </div>
    </div>

    {/* Histórico 7 dias */}
    <div style={{ background: '#fff', border: '1px solid #E0E7E3', borderRadius: 12, padding: 20 }}>
      <h2 style={{ fontSize: 15, fontWeight: 600, color: '#1A5632', marginBottom: 14 }}>Histórico de confirmações (7 dias)</h2>
      {data.history?.length === 0 && <div style={{ color: '#9CA3AF', fontSize: 14 }}>Nenhum registro encontrado.</div>}
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
        <thead>
          <tr>{['Data','Horário','Medicamento','Status','Familiar alertado'].map(h =>
            <th key={h} style={{ textAlign: 'left', padding: '8px 10px', color: '#6B7280', fontWeight: 500, fontSize: 11, textTransform: 'uppercase' as const, borderBottom: '1px solid #E0E7E3' }}>{h}</th>
          )}</tr>
        </thead>
        <tbody>
          {data.history?.map((h: any, i: number) => (
            <tr key={i}>
              <td style={{ padding: '9px 10px', borderBottom: '1px solid #F3F4F6' }}>{new Date(h.date).toLocaleDateString('pt-BR')}</td>
              <td style={{ padding: '9px 10px', borderBottom: '1px solid #F3F4F6' }}>{h.medication_time}</td>
              <td style={{ padding: '9px 10px', borderBottom: '1px solid #F3F4F6' }}>{h.med_name} {h.dosage}</td>
              <td style={{ padding: '9px 10px', borderBottom: '1px solid #F3F4F6' }}>
                <span style={{ color: statusColor(h.confirmation_status), fontWeight: 600 }}>{statusLabel(h.confirmation_status)}</span>
              </td>
              <td style={{ padding: '9px 10px', borderBottom: '1px solid #F3F4F6', color: h.family_alerted ? '#DC2626' : '#9CA3AF' }}>
                {h.family_alerted ? 'Sim' : '—'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </>);
}
