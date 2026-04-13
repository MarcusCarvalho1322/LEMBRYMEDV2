'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../layout';
import { api } from '@/lib/api';

export default function PatientsPage() {
  const { token } = useAuth();
  const [patients, setPatients] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (!token) return;
    const params = new URLSearchParams({ search, limit: '20', page: '1' });
    api(`/admin/patients?${params}`, { token })
      .then(d => { setPatients(d.patients); setTotal(d.total); })
      .catch(() => {});
  }, [token, search]);

  const Badge = ({ active }: { active: boolean }) => (
    <span style={{ padding: '2px 8px', borderRadius: 20, fontSize: 11, fontWeight: 500,
      background: active ? '#E8F0EB' : '#FEF3C7', color: active ? '#1A5632' : '#92400E' }}>
      {active ? 'Ativo' : 'Onboarding'}
    </span>
  );

  return (<>
    <h1 style={{ fontSize: 22, fontWeight: 700, color: '#1A5632', marginBottom: 24 }}>Pacientes</h1>
    <div style={{ background: '#fff', border: '1px solid #E0E7E3', borderRadius: 12, padding: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <h2 style={{ fontSize: 15, fontWeight: 600, color: '#1A5632' }}>{total} pacientes</h2>
        <input placeholder="Buscar por nome ou telefone..."
          value={search} onChange={e => setSearch(e.target.value)}
          style={{ padding: '7px 12px', border: '1px solid #E0E7E3', borderRadius: 8, fontSize: 13, width: 220, fontFamily: 'inherit', outline: 'none' }} />
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
        <thead>
          <tr>{['Nome','Telefone','Meds','Status','OK hoje','Perdidos','Atividade'].map(h =>
            <th key={h} style={{ textAlign: 'left', padding: '8px 10px', color: '#6B7280', fontWeight: 500, fontSize: 11, textTransform: 'uppercase' as const, letterSpacing: .3, borderBottom: '1px solid #E0E7E3' }}>{h}</th>
          )}</tr>
        </thead>
        <tbody>
          {patients.map((p: any) => (
            <tr key={p.id} style={{ cursor: 'pointer' }} onClick={() => window.location.href = `/admin/patient/${p.phone}`}>
              <td style={{ padding: '9px 10px', borderBottom: '1px solid #F3F4F6', fontWeight: 500 }}>{p.full_name}</td>
              <td style={{ padding: '9px 10px', borderBottom: '1px solid #F3F4F6', fontFamily: 'monospace', fontSize: 12 }}>{p.phone}</td>
              <td style={{ padding: '9px 10px', borderBottom: '1px solid #F3F4F6' }}>{p.med_count}</td>
              <td style={{ padding: '9px 10px', borderBottom: '1px solid #F3F4F6' }}><Badge active={p.onboarding_step === 'active'} /></td>
              <td style={{ padding: '9px 10px', borderBottom: '1px solid #F3F4F6', color: '#1A5632', fontWeight: 600 }}>{p.confirmed_today || 0}</td>
              <td style={{ padding: '9px 10px', borderBottom: '1px solid #F3F4F6', color: Number(p.missed_today) > 0 ? '#DC2626' : '#6B7280', fontWeight: Number(p.missed_today) > 0 ? 600 : 400 }}>{p.missed_today || 0}</td>
              <td style={{ padding: '9px 10px', borderBottom: '1px solid #F3F4F6', color: '#6B7280' }}>{p.last_activity ? new Date(p.last_activity).toLocaleString('pt-BR') : '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </>);
}
