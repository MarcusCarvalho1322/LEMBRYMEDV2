'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api';

const QBox = ({ label, value, bg, color }: any) => (
  <div style={{ textAlign: 'center', padding: 18, borderRadius: 10, background: bg }}>
    <div style={{ fontSize: 26, fontWeight: 700, color }}>{value}</div>
    <div style={{ fontSize: 12, color: '#6B7280', marginTop: 2 }}>{label}</div>
  </div>
);

export default function QueuePage() {
  const { token } = useAuth();
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    if (!token) return;
    const load = () => api('/admin/queue', { token }).then(setData).catch(() => {});
    load();
    const interval = setInterval(load, 5000); // Refresh a cada 5s
    return () => clearInterval(interval);
  }, [token]);

  if (!data) return <div style={{ color: '#6B7280' }}>Carregando...</div>;

  return (<>
    <h1 style={{ fontSize: 22, fontWeight: 700, color: '#1A5632', marginBottom: 24 }}>Fila de envios</h1>
    <div style={{ background: '#fff', border: '1px solid #E0E7E3', borderRadius: 12, padding: 20, marginBottom: 20 }}>
      <div style={{ fontSize: 13, fontWeight: 600, color: '#1A5632', marginBottom: 16 }}>Lembretes — BullMQ (atualiza a cada 5s)</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
        <QBox label="Ativos" value={data.reminders.active} bg="#EFF6FF" color="#2563EB" />
        <QBox label="Aguardando" value={data.reminders.waiting + data.reminders.delayed} bg="#FEF3C7" color="#D97706" />
        <QBox label="Concluídos" value={data.reminders.completed} bg="#E8F0EB" color="#1A5632" />
        <QBox label="Falha" value={data.reminders.failed} bg="#FEF2F2" color="#DC2626" />
      </div>
    </div>
    <div style={{ background: '#fff', border: '1px solid #E0E7E3', borderRadius: 12, padding: 20 }}>
      <div style={{ fontSize: 13, fontWeight: 600, color: '#1A5632', marginBottom: 16 }}>Alertas familiares</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
        <QBox label="Ativos" value={data.familyAlerts.active} bg="#EFF6FF" color="#2563EB" />
        <QBox label="Aguardando" value={data.familyAlerts.waiting + data.familyAlerts.delayed} bg="#FEF3C7" color="#D97706" />
        <QBox label="Concluídos" value={data.familyAlerts.completed} bg="#E8F0EB" color="#1A5632" />
        <QBox label="Falha" value={data.familyAlerts.failed} bg="#FEF2F2" color="#DC2626" />
      </div>
    </div>
  </>);
}
