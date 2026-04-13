export default function SuccessPage() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#E8F0EB', padding: 24, textAlign: 'center' }}>
      <div style={{ maxWidth: 480 }}>
        <img src="/logo.png" alt="Lembrymed" style={{ height: 56, marginBottom: 24 }} />
        <div style={{ fontSize: 48, marginBottom: 16 }}>🎉</div>
        <h1 style={{ fontFamily: 'var(--serif)', fontSize: 32, color: '#1A5632', marginBottom: 12 }}>Pagamento confirmado!</h1>
        <p style={{ fontSize: 17, color: '#4B5563', lineHeight: 1.65, marginBottom: 28 }}>
          Sua assinatura do Lembrymed está ativa. Em instantes você receberá uma mensagem no WhatsApp
          para iniciar o cadastro dos seus medicamentos.
        </p>
        <div style={{ background: '#fff', borderRadius: 16, padding: 24, border: '1px solid #E0E7E3', textAlign: 'left' }}>
          <div style={{ fontWeight: 600, marginBottom: 12, color: '#1A5632' }}>Próximos passos:</div>
          <div style={{ fontSize: 15, color: '#4B5563', lineHeight: 1.8 }}>
            1. Abra o WhatsApp e aguarde nossa mensagem<br/>
            2. Cadastre seus medicamentos (texto ou foto)<br/>
            3. Confirme o resumo e pronto!<br/>
            4. A partir de amanhã, seus lembretes começam
          </div>
        </div>
        <p style={{ fontSize: 12, color: '#9CA3AF', marginTop: 24, fontStyle: 'italic' }}>
          Este serviço não substitui orientação médica profissional.
        </p>
      </div>
    </div>
  );
}
