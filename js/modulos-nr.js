/* ===== APAVAN SST — Módulos específicos por NR ===== */
window.APAVAN_PAGES = window.APAVAN_PAGES || {};
window.APAVAN_FORMS = window.APAVAN_FORMS || {};

/* ---------- FORM: execução de checklist NR ---------- */
window.APAVAN_FORMS.checklistsNR = {
  label: 'Execução de Checklist NR',
  fields: [
    { key:'nr', label:'NR', required:true },
    { key:'setorId', label:'Setor', type:'select', options:() => App.cache.setores.map(s=>({value:s.id,label:s.nome})) },
    { key:'data', label:'Data', type:'date', default: new Date().toISOString().slice(0,10) },
    { key:'responsavel', label:'Responsável Técnico', required:true },
    { key:'observacoes', label:'Observações', type:'textarea' }
  ],
  beforeSave: (v) => ({ ...v, respostas: v.respostas || {} })
};

/* ---------- Página genérica de checklist NR ---------- */
function renderChecklistNR(nrCode){
  return async function(){
    const base = window.NR_CHECKLISTS[nrCode];
    const nrb = window.NR_BASE.nrs.find(n => n.codigo === nrCode) || { titulo:'' };
    if (!base) return `<div class="card"><h3>${nrCode}</h3><p class="muted small">Checklist não cadastrado nesta base.</p></div>`;

    const execs = (await App.db.getAll('checklistsNR')).filter(c => c.nr === nrCode);
    const setores = App.cache.setores;

    return `
      <div class="page-head">
        <div>
          <h2><span class="tag-nr">${nrCode}</span> ${App.esc(nrb.titulo || base.titulo)}</h2>
          <div class="sub">Checklist específico — ${base.itens.length} requisitos</div>
        </div>
        <div style="display:flex;gap:8px">
          <button class="btn btn-ghost" data-action="export-csv" data-store="checklistsNR">⬇ CSV</button>
          <button class="btn btn-primary" id="btn-exec-${nrCode}">+ Nova Execução</button>
        </div>
      </div>

      <div class="card" style="background:#fff8e1;border-left:4px solid var(--amarelo)">
        <strong>⚠ Aviso técnico:</strong> Itens marcados com <em>"VERIFICAR TEXTO VIGENTE DA NORMA"</em> devem ser
        confirmados no texto oficial. A conclusão técnica é de responsabilidade do profissional habilitado.
      </div>

      <div class="card">
        <h3>Requisitos verificáveis</h3>
        <div class="tbl-wrap"><table>
          <thead><tr><th style="width:80px">Item</th><th>Requisito</th><th style="width:220px">Observação</th></tr></thead>
          <tbody>${base.itens.map(i => `<tr>
            <td><strong>${i.item}</strong></td>
            <td>${App.esc(i.req)}</td>
            <td><span class="badge b-amarelo">${App.esc(i.obs)}</span></td>
          </tr>`).join('')}</tbody>
        </table></div>
      </div>

      <div class="card">
        <h3>Execuções registradas (${execs.length})</h3>
        ${execs.length ? `<div class="tbl-wrap"><table>
          <thead><tr><th>Data</th><th>Setor</th><th>Responsável</th><th>Conformes</th><th>NCs</th><th>Conformidade</th><th></th></tr></thead>
          <tbody>${execs.map(e => {
            const total = Object.values(e.respostas||{}).filter(v=>v!=='NA').length || 1;
            const c = Object.values(e.respostas||{}).filter(v=>v==='C').length;
            const pct = Math.round(c/total*100);
            const ncs = Object.values(e.respostas||{}).filter(v=>v==='NC').length;
            return `<tr>
              <td>${App.fmtDate(e.data)}</td>
              <td>${App.esc(App.setorNome(e.setorId))}</td>
              <td>${App.esc(e.responsavel||'—')}</td>
              <td>${c}</td>
              <td>${ncs ? `<span class="badge b-vermelho">${ncs}</span>` : '0'}</td>
              <td><span class="badge ${pct>=80?'b-verde':pct>=50?'b-amarelo':'b-vermelho'}">${pct}%</span></td>
              <td><button class="btn btn-ghost btn-sm" data-action="ver-exec" data-id="${e.id}">Ver</button></td>
            </tr>`;
          }).join('')}</tbody></table></div>` : '<div class="muted small">Nenhuma execução registrada ainda.</div>'}
      </div>
    `;
  };
}

// Registro das páginas
['NR-10','NR-12','NR-13','NR-17','NR-18','NR-20','NR-23','NR-33','NR-35'].forEach(nr => {
  const key = 'nr' + nr.replace('NR-','').replace('-','');
  window.APAVAN_PAGES[key] = renderChecklistNR(nr);
});

/* ---------- Abre modal de execução ---------- */
window.abrirExecucaoNR = function(nrCode){
  const base = window.NR_CHECKLISTS[nrCode];
  const setores = App.cache.setores;
  const setOpts = setores.map(s => `<option value="${s.id}">${App.esc(s.nome)}</option>`).join('');

  const body = `
    <div class="grid-2">
      <div class="field"><label>Setor</label>
        <select name="setorId">${setOpts}</select></div>
      <div class="field"><label>Data</label>
        <input type="date" name="data" value="${new Date().toISOString().slice(0,10)}"></div>
    </div>
    <div class="field"><label>Responsável Técnico</label>
      <input type="text" name="responsavel" placeholder="Nome e registro profissional"></div>
    <div class="field"><label>Observações gerais</label>
      <textarea name="observacoes"></textarea></div>

    <h4 style="margin:18px 0 10px;color:var(--azul-escuro)">Itens do checklist</h4>
    <div id="ck-list">
      ${base.itens.map(i => `
        <div class="ck-item" data-id="${i.id}" style="border:1px solid var(--cinza-borda);border-radius:8px;padding:10px 12px;margin-bottom:8px">
          <div style="font-size:13px;margin-bottom:8px">
            <strong>${i.item}</strong> — ${App.esc(i.req)}
            <div class="small muted" style="margin-top:2px">${App.esc(i.obs)}</div>
          </div>
          <div style="display:flex;gap:14px;font-size:12.5px;flex-wrap:wrap">
            <label><input type="radio" name="r_${i.id}" value="C" checked> Conforme</label>
            <label><input type="radio" name="r_${i.id}" value="NC"> Não conforme</label>
            <label><input type="radio" name="r_${i.id}" value="NA"> Não aplicável</label>
          </div>
          <input class="small" style="margin-top:8px;width:100%;padding:6px 8px;border:1px solid var(--cinza-borda);border-radius:6px"
                 placeholder="Observação (opcional)" data-obs="${i.id}">
        </div>
      `).join('')}
    </div>
  `;

  App.openModal(`Execução ${nrCode} — ${base.titulo}`, body, '', async (values) => {
    const respostas = {};
    const observacoesItem = {};
    base.itens.forEach(i => {
      const sel = document.querySelector(`input[name="r_${i.id}"]:checked`);
      respostas[i.id] = sel ? sel.value : 'NA';
      const obs = document.querySelector(`[data-obs="${i.id}"]`);
      if (obs && obs.value.trim()) observacoesItem[i.id] = obs.value.trim();
    });
    await App.db.add('checklistsNR', {
      nr: nrCode,
      setorId: Number(values.setorId) || null,
      data: values.data,
      responsavel: values.responsavel,
      observacoes: values.observacoes,
      respostas,
      observacoesItem,
      itensBase: base.itens.map(i => ({ id:i.id, item:i.item, req:i.req }))
    });

    // Gera NCs automáticas para os itens marcados como NC
    const ncsGeradas = [];
    base.itens.forEach(i => {
      if (respostas[i.id] === 'NC') {
        ncsGeradas.push(i);
      }
    });
    for (const i of ncsGeradas) {
      await App.db.add('ncs', {
        codigo: `NC-${nrCode.replace('NR-','')}-${Date.now().toString().slice(-5)}`,
        data: values.data,
        setorId: Number(values.setorId) || null,
        local: App.setorNome(values.setorId),
        descricao: `[Auto] ${i.item} — ${i.req}`,
        nr: nrCode,
        requisito: i.item,
        gravidade: 'Média',
        responsavel: values.responsavel,
        prazo: new Date(Date.now()+30*864e5).toISOString().slice(0,10),
        acaoCorretiva: 'Definir plano de ação conforme análise técnica.',
        status: 'Aberta',
        origem: 'checklist ' + nrCode
      });
    }

    await App.log(`executou checklist ${nrCode} — ${ncsGeradas.length} NC(s) geradas`);
    App.render();
  });
};

/* ---------- Ação global para abrir execução ---------- */
document.addEventListener('click', async (e) => {
  const btn = e.target.closest('[id^="btn-exec-"]');
  if (btn) {
    const nr = btn.id.replace('btn-exec-','');
    window.abrirExecucaoNR(nr);
    return;
  }
  const ver = e.target.closest('[data-action="ver-exec"]');
  if (ver) {
    const id = ver.dataset.id;
    const exec = await App.db.get('checklistsNR', id);
    if (!exec) return;
    const base = exec.itensBase || [];
    const body = `
      <div class="small muted mb-2">Executado em ${App.fmtDate(exec.data)} por ${App.esc(exec.responsavel||'—')}</div>
      ${base.map(i => {
        const r = exec.respostas[i.id];
        const badge = r==='C'?'b-verde':r==='NC'?'b-vermelho':'b-cinza';
        const lbl = r==='C'?'Conforme':r==='NC'?'Não conforme':'Não aplicável';
        const obs = (exec.observacoesItem||{})[i.id];
        return `<div style="border-bottom:1px solid var(--cinza-borda);padding:8px 0">
          <div><strong>${i.item}</strong> — ${App.esc(i.req)}</div>
          <div style="margin-top:4px"><span class="badge ${badge}">${lbl}</span>
            ${obs ? `<span class="small muted" style="margin-left:8px">${App.esc(obs)}</span>` : ''}</div>
        </div>`;
      }).join('')}
    `;
    App.openModal(`Execução ${exec.nr}`, body, '', async () => { App.closeModal(); });
  }
});