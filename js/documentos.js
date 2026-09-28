/* ===== APAVAN SST — Documentos Técnicos: APR, PT, PET, OS, Assinatura ===== */
window.APAVAN_PAGES = window.APAVAN_PAGES || {};
window.APAVAN_FORMS = window.APAVAN_FORMS || {};

/* ---------- FORM configs ---------- */
window.APAVAN_FORMS.apr = { label:'APR — Análise Preliminar de Risco', fields:[
  { key:'titulo', label:'Título da APR', required:true },
  { key:'atividade', label:'Atividade', required:true },
  { key:'setorId', label:'Setor', type:'select', options:() => App.cache.setores.map(s=>({value:s.id,label:s.nome})) },
  { key:'data', label:'Data', type:'date', default: new Date().toISOString().slice(0,10) },
  { key:'responsavel', label:'Responsável', required:true },
  { key:'registro', label:'Registro Profissional (CREA/MTE)' },
  { key:'etapas', label:'Etapas da Atividade', type:'textarea' },
  { key:'observacoes', label:'Observações', type:'textarea' }
]};

window.APAVAN_FORMS.pt = { label:'Permissão de Trabalho (PT)', fields:[
  { key:'numero', label:'Número PT', required:true },
  { key:'tipo', label:'Tipo', type:'select', options:['Trabalho a Quente','Trabalho em Altura','Espaço Confinado','Eletricidade','Atividade Especial'], required:true },
  { key:'setorId', label:'Setor', type:'select', options:() => App.cache.setores.map(s=>({value:s.id,label:s.nome})) },
  { key:'dataEmissao', label:'Emissão', type:'date', default: new Date().toISOString().slice(0,10) },
  { key:'validade', label:'Validade', type:'date' },
  { key:'executante', label:'Executante', required:true },
  { key:'emitente', label:'Emitente', required:true },
  { key:'descricao', label:'Descrição do Trabalho', type:'textarea', required:true },
  { key:'medidas', label:'Medidas Preventivas', type:'textarea' },
  { key:'epis', label:'EPIs/EPCs Exigidos', type:'textarea' },
  { key:'status', label:'Status', type:'select', options:['Aberta','Em execução','Encerrada','Cancelada'] }
]};

window.APAVAN_FORMS.pet = { label:'PET — Permissão de Entrada e Trabalho (NR-33)', fields:[
  { key:'numero', label:'Número PET', required:true },
  { key:'espaco', label:'Espaço Confinado', required:true },
  { key:'setorId', label:'Setor', type:'select', options:() => App.cache.setores.map(s=>({value:s.id,label:s.nome})) },
  { key:'data', label:'Data', type:'date', default: new Date().toISOString().slice(0,10) },
  { key:'horaInicio', label:'Início', type:'time' },
  { key:'horaFim', label:'Término', type:'time' },
  { key:'supervisor', label:'Supervisor de Entrada', required:true },
  { key:'vigia', label:'Vigia' },
  { key:'trabalhadores', label:'Trabalhadores Autorizados' },
  { key:'o2', label:'O₂ (%)' },
  { key:'lel', label:'LEL (%)' },
  { key:'h2s', label:'H₂S (ppm)' },
  { key:'co', label:'CO (ppm)' },
  { key:'outrosGases', label:'Outros gases' },
  { key:'medidas', label:'Medidas de Controle', type:'textarea' },
  { key:'status', label:'Status', type:'select', options:['Aberta','Em execução','Encerrada','Cancelada'] }
]};

window.APAVAN_FORMS.os = { label:'Ordem de Serviço (OS)', fields:[
  { key:'numero', label:'Número OS', required:true },
  { key:'trabalhadorId', label:'Trabalhador', type:'select', options:() => App.cache.trabalhadores.map(t=>({value:t.id,label:t.nome})), required:true },
  { key:'cargo', label:'Cargo' },
  { key:'setorId', label:'Setor', type:'select', options:() => App.cache.setores.map(s=>({value:s.id,label:s.nome})) },
  { key:'atividade', label:'Atividade', required:true },
  { key:'riscos', label:'Riscos', type:'textarea' },
  { key:'medidas', label:'Medidas Preventivas', type:'textarea' },
  { key:'epis', label:'EPIs / EPCs', type:'textarea' },
  { key:'procedimentos', label:'Procedimentos', type:'textarea' },
  { key:'responsabilidades', label:'Responsabilidades', type:'textarea' },
  { key:'data', label:'Data', type:'date', default: new Date().toISOString().slice(0,10) }
]};

/* ---------- ASSINATURA DIGITAL (canvas) ---------- */
window.Assinatura = {
  abrir(titulo, onSave){
    const html = `
      <div class="field">
        <label>Nome do signatário</label>
        <input type="text" name="signatario" placeholder="Nome completo">
      </div>
      <div class="field">
        <label>Registro profissional</label>
        <input type="text" name="registro" placeholder="CREA / MTE / outro">
      </div>
      <div class="field">
        <label>Assinatura (desenhe abaixo)</label>
        <canvas id="sig-canvas" width="600" height="180"
          style="width:100%;height:180px;border:1px solid var(--cinza-borda);border-radius:8px;background:#fff;touch-action:none"></canvas>
        <div style="margin-top:6px;display:flex;gap:8px">
          <button type="button" class="btn btn-ghost btn-sm" id="sig-clear">Limpar</button>
        </div>
      </div>
      <p class="small muted">A assinatura desenhada é um registro gráfico local. Sua validade jurídica
      depende do método adotado (ICP-Brasil, gov.br, etc.).</p>
    `;
    App.openModal(titulo || 'Assinatura Digital', html, '', async (values) => {
      const canvas = document.getElementById('sig-canvas');
      const dataUrl = canvas.toDataURL('image/png');
      await onSave({
        signatario: values.signatario,
        registro: values.registro,
        dataUrl,
        data: new Date().toISOString()
      });
    });
    // wiring do canvas
    setTimeout(() => {
      const canvas = document.getElementById('sig-canvas');
      const ctx = canvas.getContext('2d');
      ctx.lineWidth = 2; ctx.lineCap = 'round'; ctx.strokeStyle = '#0d2b4e';
      let drawing = false;
      const pos = (e) => {
        const r = canvas.getBoundingClientRect();
        const cx = (e.touches ? e.touches[0].clientX : e.clientX) - r.left;
        const cy = (e.touches ? e.touches[0].clientY : e.clientY) - r.top;
        return { x: cx * canvas.width / r.width, y: cy * canvas.height / r.height };
      };
      const start = (e) => { drawing = true; const p = pos(e); ctx.beginPath(); ctx.moveTo(p.x, p.y); e.preventDefault(); };
      const move  = (e) => { if (!drawing) return; const p = pos(e); ctx.lineTo(p.x, p.y); ctx.stroke(); e.preventDefault(); };
      const stop  = () => { drawing = false; };
      canvas.addEventListener('mousedown', start); canvas.addEventListener('mousemove', move);
      canvas.addEventListener('mouseup', stop);   canvas.addEventListener('mouseleave', stop);
      canvas.addEventListener('touchstart', start); canvas.addEventListener('touchmove', move);
      canvas.addEventListener('touchend', stop);
      document.getElementById('sig-clear').addEventListener('click', () => ctx.clearRect(0,0,canvas.width,canvas.height));
    }, 40);
  }
};

/* ---------- PÁGINAS ---------- */
window.APAVAN_PAGES.apr = async function(){
  return App.crudPage('apr','APR — Análise Preliminar de Risco',[
    { key:'titulo', label:'Título' },
    { key:'atividade', label:'Atividade' },
    { key:'setorId', label:'Setor', render:r => App.esc(App.setorNome(r.setorId)) },
    { key:'data', label:'Data', render:r => App.fmtDate(r.data) },
    { key:'responsavel', label:'Responsável' }
  ], `<button class="btn btn-ghost" data-action="gerar-apr">📄 Gerar APR (PDF)</button>`);
};

window.APAVAN_PAGES.pt = async function(){
  return App.crudPage('pt','Permissões de Trabalho (PT)',[
    { key:'numero', label:'Nº' },
    { key:'tipo', label:'Tipo' },
    { key:'executante', label:'Executante' },
    { key:'validade', label:'Validade', render:r => App.fmtDate(r.validade) },
    { key:'status', label:'Status' }
  ]);
};

window.APAVAN_PAGES.pet = async function(){
  return App.crudPage('pet','PET — Espaço Confinado (NR-33)',[
    { key:'numero', label:'Nº' },
    { key:'espaco', label:'Espaço' },
    { key:'setorId', label:'Setor', render:r => App.esc(App.setorNome(r.setorId)) },
    { key:'supervisor', label:'Supervisor' },
    { key:'o2', label:'O₂ %' },
    { key:'status', label:'Status' }
  ], `<button class="btn btn-ghost" data-action="gerar-pet">📄 Gerar PET (PDF)</button>`);
};

window.APAVAN_PAGES.os = async function(){
  return App.crudPage('os','Ordens de Serviço de SST',[
    { key:'numero', label:'Nº' },
    { key:'trabalhadorId', label:'Trabalhador', render:r => App.esc(App.trabNome(r.trabalhadorId)) },
    { key:'atividade', label:'Atividade' },
    { key:'data', label:'Data', render:r => App.fmtDate(r.data) }
  ], `<button class="btn btn-ghost" data-action="gerar-os">📄 Gerar OS (PDF)</button>`);
};

/* ---------- GERADORES (impressão via window.print com layout próprio) ---------- */
window.gerarDocumento = function(titulo, conteudoHtml){
  const html = `
    <!doctype html><html><head><meta charset="utf-8">
    <title>${App.esc(titulo)}</title>
    <style>
      body{font-family:Arial,sans-serif;padding:32px;color:#111;font-size:12px}
      h1{font-size:16px;text-align:center;letter-spacing:1px}
      .brand{text-align:center;color:#0d2b4e;font-weight:bold;letter-spacing:2px;font-size:11px}
      h2{font-size:13px;border-bottom:1px solid #333;padding-bottom:4px;margin-top:20px}
      table{width:100%;border-collapse:collapse;margin-top:8px;font-size:11px}
      th,td{border:1px solid #666;padding:5px 6px;text-align:left}
      th{background:#eee}
      .foot{margin-top:36px;font-size:10px;color:#555;text-align:center;border-top:1px solid #999;padding-top:8px}
      .sign{margin-top:60px;display:flex;justify-content:space-between;gap:40px}
      .sign div{flex:1;text-align:center;border-top:1px solid #333;padding-top:4px}
      .obs{background:#fff8e1;border:1px solid #f9a825;padding:6px;font-size:10px;margin:8px 0}
    </style></head><body>
    <div class="brand">APAVAN ENGENHARIA E CONSULTORIA</div>
    <h1>${App.esc(titulo)}</h1>
    ${conteudoHtml}
    <div class="foot">
      Documento gerado pelo APAVAN SST · ${new Date().toLocaleString('pt-BR')}<br>
      APAVAN ENGENHARIA E CONSULTORIA — Revisão 00
    </div>
    <script>window.onload=()=>setTimeout(()=>window.print(),200)<\/script>
    </body></html>`;
  const w = window.open('', '_blank');
  w.document.write(html); w.document.close();
};

/* Ações */
document.addEventListener('click', async (e) => {
  const a = e.target.closest('[data-action]');
  if (!a) return;

  if (a.dataset.action === 'gerar-apr'){
    const id = a.dataset.id || prompt('ID da APR:');
    if (!id) return;
    const apr = await App.db.get('apr', id); if (!apr) return alert('APR não encontrada');
    gerarDocumento('APR — Análise Preliminar de Risco', `
      <h2>1. Identificação</h2>
      <table><tr><th style="width:30%">Título</th><td>${App.esc(apr.titulo)}</td></tr>
        <tr><th>Atividade</th><td>${App.esc(apr.atividade||'—')}</td></tr>
        <tr><th>Setor</th><td>${App.esc(App.setorNome(apr.setorId))}</td></tr>
        <tr><th>Data</th><td>${App.fmtDate(apr.data)}</td></tr>
        <tr><th>Responsável</th><td>${App.esc(apr.responsavel||'—')} ${apr.registro?'— '+App.esc(apr.registro):''}</td></tr></table>
      <h2>2. Etapas da Atividade</h2><p>${App.esc(apr.etapas||'—')}</p>
      <h2>3. Observações</h2><p>${App.esc(apr.observacoes||'—')}</p>
      <div class="obs">Documento sujeito a validação técnica. Riscos devem ser confirmados por profissional habilitado.</div>
      <div class="sign"><div>Responsável Técnico<br>CREA/Registro</div><div>Data ___/___/_____</div></div>
    `);
  }

  if (a.dataset.action === 'gerar-pet'){
    const id = a.dataset.id || prompt('ID da PET:');
    if (!id) return;
    const pet = await App.db.get('pet', id); if (!pet) return alert('PET não encontrada');
    gerarDocumento('PET — Permissão de Entrada e Trabalho (NR-33)', `
      <table>
        <tr><th style="width:30%">Nº PET</th><td>${App.esc(pet.numero)}</td></tr>
        <tr><th>Espaço Confinado</th><td>${App.esc(pet.espaco)}</td></tr>
        <tr><th>Setor</th><td>${App.esc(App.setorNome(pet.setorId))}</td></tr>
        <tr><th>Data / Horário</th><td>${App.fmtDate(pet.data)} — ${App.esc(pet.horaInicio||'—')} às ${App.esc(pet.horaFim||'—')}</td></tr>
        <tr><th>Supervisor de Entrada</th><td>${App.esc(pet.supervisor||'—')}</td></tr>
        <tr><th>Vigia</th><td>${App.esc(pet.vigia||'—')}</td></tr>
        <tr><th>Trabalhadores Autorizados</th><td>${App.esc(pet.trabalhadores||'—')}</td></tr>
      </table>
      <h2>Monitoramento Atmosférico</h2>
      <table><tr><th>O₂ (%)</th><th>LEL (%)</th><th>H₂S (ppm)</th><th>CO (ppm)</th><th>Outros</th></tr>
        <tr><td>${App.esc(pet.o2||'—')}</td><td>${App.esc(pet.lel||'—')}</td>
        <td>${App.esc(pet.h2s||'—')}</td><td>${App.esc(pet.co||'—')}</td>
        <td>${App.esc(pet.outrosGases||'—')}</td></tr></table>
      <h2>Medidas de Controle</h2><p>${App.esc(pet.medidas||'—')}</p>
      <div class="obs">Valores-limite devem ser confirmados no texto vigente da NR-33 e em procedimentos da empresa.</div>
      <div class="sign"><div>Supervisor de Entrada</div><div>Vigia</div><div>Executante</div></div>
    `);
  }

  if (a.dataset.action === 'gerar-os'){
    const id = a.dataset.id || prompt('ID da OS:');
    if (!id) return;
    const os = await App.db.get('os', id); if (!os) return alert('OS não encontrada');
    gerarDocumento('Ordem de Serviço de Segurança do Trabalho', `
      <table>
        <tr><th style="width:30%">Nº OS</th><td>${App.esc(os.numero)}</td></tr>
        <tr><th>Trabalhador</th><td>${App.esc(App.trabNome(os.trabalhadorId))}</td></tr>
        <tr><th>Cargo</th><td>${App.esc(os.cargo||'—')}</td></tr>
        <tr><th>Setor</th><td>${App.esc(App.setorNome(os.setorId))}</td></tr>
        <tr><th>Atividade</th><td>${App.esc(os.atividade)}</td></tr>
        <tr><th>Data</th><td>${App.fmtDate(os.data)}</td></tr>
      </table>
      <h2>Riscos</h2><p>${App.esc(os.riscos||'—')}</p>
      <h2>Medidas Preventivas</h2><p>${App.esc(os.medidas||'—')}</p>
      <h2>EPIs / EPCs</h2><p>${App.esc(os.epis||'—')}</p>
      <h2>Procedimentos</h2><p>${App.esc(os.procedimentos||'—')}</p>
      <h2>Responsabilidades</h2><p>${App.esc(os.responsabilidades||'—')}</p>
      <div class="sign"><div>Assinatura do Trabalhador</div><div>Responsável SST</div></div>
    `);
  }
});