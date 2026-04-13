'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../layout';
import { api } from '@/lib/api';

export default function RevenuePage() {
  const { token } = useAuth();
  const [data, setData] = useState<any>(null);
  const [revenue, setRevenue] = useState<any[]>([]);

  useEffect(() => {
    if (!token) return;
    api('/admin/dashboard', { token }).then(setData).catch(() => {});
    api('/admin/dashboard/revenue', { token }).then(setRevenue).catch(() => {});
  }, [token]);

  if (!data) return <div style={{ color: '#6B7280' }}>Carregando...</div>;

  const KPI = ({ label, value }: any) => (
    <div style={{ background: '#fff', border: '1px solid #E0E7E3', borderRadius: 12, padding: 18 }}>
      <div style={{ fontSize: 11, color: '#6B7280', textTransform: 'uppercase' as const, letterSpacing: .5, marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: 28, fontWeight: 700, color: '#1A5632' }}>{value}</div>
    </div>
  );

  return (<>
    <h1 style={{ fontSize: 22, fontWeight: 700, color: '#1A5632', marginBottom: 24 }}>Receita e faturamento</h1>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14, marginBottom: 24 }}>
      <KPI label="MRR" value={`R$ ${data.mrr?.toLocaleString('pt-BR')}`} />
      <KPI label="ARR" value={`R$ ${data.arr?.toLocaleString('pt-BR')}`} />
      <KPI label="Ticket médio" value="R$ 149" />
      <KPI label="Pagantes" value={data.activePatients} />
    </div>
    <div style={{ background: '#fff', border: '1px solid #E0E7E3', borderRadius: 12, padding: 20 }}>
      <div style={{ fontSize: 13, fontWeight: 600, color: '#1A5632', marginBottom: 16 }}>Evolução mensal</div>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
        <thead>
          <tr>{['Mês','Assinaturas','Receita'].map(h =>
            <th key={h} style={{ textAlign: 'left', padding: '8px 10px', color: '#6B7280', fontWeight: 500, fontSize: 11, textTransform: 'uppercase' as const, borderBottom: '1px solid #E0E7E3' }}>{h}</th>
          )}</tr>
        </thead>
        <tbody>
          {revenue.map((r: any, i: number) => (
            <tr key={i}>
              <td style={{ padding: '9px 10px', borderBottom: '1px solid #F3F4F6' }}>{r.month}</td>
              <td style={{ padding: '9px 10px', borderBottom: '1px solid #F3F4F6' }}>{r.count}</td>
              <td style={{ padding: '9px 10px', borderBottom: '1px solid #F3F4F6', fontWeight: 600, color: '#1A5632' }}>R$ {(Number(r.total_cents) / 100).toLocaleString('pt-BR')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </>);
}
