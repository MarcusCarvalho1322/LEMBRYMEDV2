'use client';

import { useState, useEffect } from 'react';
import { useAuth } from './layout';
import { api } from '@/lib/api';

const KPI = ({ label, value, sub, color }: any) => (
  <div style={{ background: '#fff', border: '1px solid #E0E7E3', borderRadius: 12, padding: 18 }}>
    <div style={{ fontSize: 11, color: '#6B7280', textTransform: 'uppercase' as const, letterSpacing: .5, marginBottom: 6 }}>{label}</div>
    <div style={{ fontSize: 28, fontWeight: 700, color: color || '#1A1A1A', lineHeight: 1.1 }}>{value}</div>
    {sub && <div style={{ fontSize: 12, marginTop: 4, color: sub.startsWith('▲') ? '#2D7A4A' : sub.startsWith('▼') ? '#DC2626' : '#6B7280' }}>{sub}</div>}
  </div>
);

export default function AdminDashboard() {
  const { token } = useAuth();
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token) return;
    api('/admin/dashboard', { token }).then(setData).catch(e => setError(e.message));
  }, [token]);

  if (error) return <div style={{ color: '#DC2626' }}>Erro: {error}</div>;
  if (!data) return <div style={{ color: '#6B7280' }}>Carregando...</div>;

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: '#1A5632' }}>Visão geral</h1>
          <div style={{ color: '#6B7280', fontSize: 13 }}>
            Hoje, {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
          </div>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: 14, marginBottom: 24 }}>
        <KPI label="Assinantes ativos" value={data.activePatients} sub={`▲ +${data.newPatients30d} (30d)`} color="#1A5632" />
        <KPI label="MRR" value={`R$ ${data.mrr?.toLocaleString('pt-BR')}`} color="#1A5632" />
        <KPI label="ARR" value={`R$ ${data.arr?.toLocaleString('pt-BR')}`} sub="Projetado" />
        <KPI label="Mensagens hoje" value={data.msgsToday} sub={`Entrega: ${data.deliveryRate}%`} />
        <KPI label="Confirmação" value={`${data.confirmRate}%`} color="#1A5632" />
        <KPI label="Churn" value={`${data.churnRate}%`} color="#2563EB" />
      </div>
    </>
  );
}
