/* ===== APAVAN SST — Gestão: auditoria, perfis, dashboard cliente, fotos ===== */
window.APAVAN_PAGES = window.APAVAN_PAGES || {};
window.APAVAN_FORMS = window.APAVAN_FORMS || {};

/* ============ MODO AUDITORIA (Fiscalização) ============ */
window.APAVAN_PAGES.auditoria = async function(){
  const auditorias = await App.db.getAll('auditorias');
  const nrs = Object.keys(window.NR_CHECKLISTS);
  return `
    <div class="page-head">
      <div><h2>Modo Auditoria SST</h2><div class="sub">Checklist de fiscalização por NR + setor</div></div>
    </div>

    <div class="card">
      <h3>Nova auditoria</h3>
      <div class="grid-2">
        <div class="field"><label>NR</label>
          <select id="aud-nr">${nrs.map(n=>`<option value="${n}">${n}</option>`).join('')}</select></div>
        <div class="field"><label>Setor</label>
          <select id="aud-setor"><option value="">—</option>
            ${App.cache.setores.map(s=>`<option value="${s.id}">${App.esc(s.nome)}</option>`).join('')}</select></div>
      </div>
      <div class="grid-2">
        <div class="field"><label>Auditor</label><input id="aud-auditor" placeholder="Nome"></div>
        <div class="field"><label>Data</label><input id="aud-data" type="date" value="${new Date().toISOString().slice(0,10)}"></div>
      </div>
      <button class="btn btn-primary" id="aud-iniciar">▶ Iniciar auditoria</button>
    </div>

    <div class="card">
      <h3>Histórico (${auditorias.length})</h3>
      ${auditorias.length ? `<div class="tbl-wrap"><table>
        <thead><tr><th>Data</th><th>NR</th><th>Auditor</th><th>Conformes</th><th>NCs</th><th>Índice</th><th></th></tr></thead>
        <tbody>${auditorias.slice().reverse().map(a => {
          const c = Object.values(a.respostas||{}).filter(v=>v==='C').length;
          const nc = Object.values(a.respostas||{}).filter(v=>v==='NC').length;
          const tot = c+nc || 1;
          const pct = Math.round(c/tot*100);
          return `<tr>
            <td>${App.fmtDate(a.data)}</td>
            <td><span class="tag-nr">${App.esc(a.nr)}</span></td>
            <td>${App.esc(a.auditor||'—')}</td>
            <td>${c}</td><td>${nc}</td>
            <td><span class="badge ${pct>=80?'b-verde':pct>=50?'b-amarelo':'b-vermelho'}">${pct}%</span></td>
            <td><button class="btn btn-ghost btn-sm" data-action="ver-aud" data-id="${a.id}">Ver</button></td>
          </tr>`;
        }).join('')}</tbody></table></div>` : '<div class="muted small">Nenhuma auditoria realizada.</div>'}
    </div>
  `;
};

document.addEventListener('click', async (e) => {
  if (e.target.id === 'aud-iniciar'){
    const nr = document.getElementById('aud-nr').value;
    const setorId = document.getElementById('aud-setor').value;
    const auditor = document.getElementById('aud-auditor').value;
    const data = document.getElementById('aud-data').value;
    const base = window.NR_CHECKLISTS[nr];
    if (!base) return alert('NR sem checklist nesta base.');

    const body = `
      <div class="small muted mb-2">NR: <strong>${nr}</strong> — ${App.esc(base.titulo)}</div>
      ${base.itens.map(i => `
        <div style="border:1px solid var(--cinza-borda);border-radius:8px;padding:10px 12px;margin-bottom:8px">
          <div style="font-size:13px;margin-bottom:8px">
            <strong>${i.item}</strong> — ${App.esc(i.req)}
            <div class="small muted">${App.esc(i.obs)}</div>
          </div>
          <div style="display:flex;gap:14px;font-size:12.5px;flex-wrap:wrap">
            <label><input type="radio" name="a_${i.id}" value="C" checked> Conforme</label>
            <label><input type="radio" name="a_${i.id}" value="NC"> Não conforme</label>
            <label><input type="radio" name="a_${i.id}" value="NA"> Não aplicável</label>
          </div>
          <textarea data-obs="${i.id}" placeholder="Comentário (opcional)" style="margin-top:8px;width:100%;font-size:12px"></textarea>
        </div>
      `).join('')}
    `;
    App.openModal(`Auditoria — ${nr}`, body, '', async () => {
      const respostas = {}, obs = {};
      base.itens.forEach(i => {
        respostas[i.id] = document.querySelector(`input[name="a_${i.id}"]:checked`).value;
        const o = document.querySelector(`textarea[data-obs="${i.id}"]`).value;
        if (o.trim()) obs[i.id] = o.trim();
      });
      await App.db.add('auditorias', { nr, setorId: Number(setorId)||null, auditor, data, respostas, obs, itensBase: base.itens });

      // Gera NCs
      let ncCount = 0;
      for (const i of base.itens){
        if (respostas[i.id] === 'NC'){
          ncCount++;
          await App.db.add('ncs', {
            codigo:`AUD-${nr.replace('NR-','')}-${Date.now().toString().slice(-5)}-${ncCount}`,
            data, setorId:Number(setorId)||null, local:App.setorNome(setorId),
            descricao:`[Auditoria] ${i.item} — ${i.req}`,
            nr, requisito:i.item, gravidade:'Alta', responsavel:auditor,
            prazo:new Date(Date.now()+30*864e5).toISOString().slice(0,10),
            acaoCorretiva:'Definir plano de ação conforme análise técnica.',
            status:'Aberta', origem:'auditoria'
          });
        }
      }
      await App.log(`auditoria ${nr} — ${ncCount} NC(s)`);
      App.render();
    });
    return;
  }

  const verAud = e.target.closest('[data-action="ver-aud"]');
  if (verAud){
    const a = await App.db.get('auditorias', verAud.dataset.id);
    if (!a) return;
    const body = (a.itensBase||[]).map(i => {
      const r = a.respostas[i.id];
      const badge = r==='C'?'b-verde':r==='NC'?'b-vermelho':'b-cinza';
      const txt = r==='C'?'Conforme':r==='NC'?'Não conforme':'Não aplicável';
      return `<div style="border-bottom:1px solid var(--cinza-borda);padding:8px 0">
        <div><strong>${i.item}</strong> — ${App.esc(i.req)}</div>
        <div style="margin-top:4px"><span class="badge ${badge}">${txt}</span></div>
        ${a.obs && a.obs[i.id] ? `<div class="small muted mt-1">${App.esc(a.obs[i.id])}</div>` : ''}
      </div>`;
    }).join('');
    App.openModal(`Auditoria ${a.nr} — ${App.fmtDate(a.data)}`, body, '', async () => App.closeModal());
  }
});

/* ============ RELATÓRIO FOTOGRÁFICO ============ */
window.APAVAN_PAGES.fotos = async function(){
  const fotos = await App.db.getAll('fotos');
  return `
    <div class="page-head">
      <div><h2>Relatório Fotográfico</h2><div class="sub">${fotos.length} foto(s) registrada(s)</div></div>
      <div style="display:flex;gap:8px">
        <button class="btn btn-ghost" data-action="print">🖨 Gerar PDF</button>
        <button class="btn btn-primary" id="foto-add">📷 Nova foto</button>
      </div>
    </div>

    <div class="grid-2" id="galeria">
      ${fotos.length ? fotos.slice().reverse().map(f => `
        <div class="card" style="padding:0;overflow:hidden">
          <img src="${f.dataUrl}" style="width:100%;display:block;max-height:280px;object-fit:cover">
          <div style="padding:12px">
            <div class="small"><strong>Foto #${f.numero||f.id}</strong> · ${App.fmtDate(f.data)}</div>
            <div class="small mt-1">${App.esc(f.local||'—')} — ${App.esc(App.setorNome(f.setorId))}</div>
            <div class="small mt-1">${App.esc(f.descricao||'')}</div>
            ${f.nr ? `<div class="mt-1"><span class="tag-nr">${App.esc(f.nr)}</span></div>` : ''}
            ${f.recomendacao ? `<div class="small muted mt-1"><b>Recomendação:</b> ${App.esc(f.recomendacao)}</div>` : ''}
            <div style="margin-top:10px;display:flex;gap:6px">
              <button class="btn btn-ghost btn-sm" data-action="foto-del" data-id="${f.id}">🗑 Remover</button>
            </div>
          </div>
        </div>`).join('') : '<div class="card"><div class="empty"><span class="big">📷</span>Nenhuma foto ainda.</div></div>'}
    </div>
  `;
};

document.addEventListener('click', async (e) => {
  if (e.target.id === 'foto-add'){
    const body = `
      <div class="field">
        <label>Foto</label>
        <input type="file" accept="image/*" capture="environment" id="foto-file">
        <div class="small muted" style="margin-top:4px">No celular, abre a câmera diretamente.</div>
      </div>
      <div class="grid-2">
        <div class="field"><label>Local</label><input id="foto-local" placeholder="Ex: Setor Produção — corredor B"></div>
        <div class="field"><label>Setor</label>
          <select id="foto-setor"><option value="">—</option>
            ${App.cache.setores.map(s=>`<option value="${s.id}">${App.esc(s.nome)}</option>`).join('')}</select></div>
      </div>
      <div class="field"><label>Descrição</label><textarea id="foto-desc"></textarea></div>
      <div class="grid-2">
        <div class="field"><label>NR relacionada</label>
          <select id="foto-nr"><option value="">—</option>
            ${Object.keys(window.NR_CHECKLISTS).map(n=>`<option>${n}</option>`).join('')}</select></div>
        <div class="field"><label>Risco identificado</label><input id="foto-risco"></div>
      </div>
      <div class="field"><label>Recomendação</label><textarea id="foto-rec"></textarea></div>
      <button type="button" class="btn btn-ghost btn-sm" id="foto-sugerir">🧠 Sugerir com IA</button>
      <div id="foto-sugestao" class="mt-1"></div>
    `;
    App.openModal('Nova foto do relatório', body, '', async () => {
      const file = document.getElementById('foto-file').files[0];
      if (!file) throw new Error('Selecione uma foto.');
      const dataUrl = await new Promise((res) => {
        const r = new FileReader(); r.onload = () => res(r.result); r.readAsDataURL(file);
      });
      const total = (await App.db.getAll('fotos')).length + 1;
      await App.db.add('fotos', {
        numero: total,
        dataUrl,
        data: new Date().toISOString().slice(0,10),
        local: document.getElementById('foto-local').value,
        setorId: Number(document.getElementById('foto-setor').value) || null,
        descricao: document.getElementById('foto-desc').value,
        nr: document.getElementById('foto-nr').value,
        risco: document.getElementById('foto-risco').value,
        recomendacao: document.getElementById('foto-rec').value
      });
      App.render();
    });
    // IA suggest
    setTimeout(() => {
      const btn = document.getElementById('foto-sugerir');
      if (btn) btn.onclick = () => {
        const txt = document.getElementById('foto-desc').value;
        const sug = window.IA.analisar(txt);
        const out = document.getElementById('foto-sugestao');
        if (!sug.length){ out.innerHTML = '<div class="small muted">Sem sugestões. Descreva melhor.</div>'; return; }
        out.innerHTML = sug.map(s => `<div class="small" style="margin-top:6px">
          <strong>${App.esc(s.risco)}</strong> · <span class="tag-nr">${App.esc(s.nr)}</span><br>
          <button type="button" class="btn btn-ghost btn-sm" onclick="
            document.getElementById('foto-nr').value='${s.nr}';
            document.getElementById('foto-risco').value='${s.risco.replace(/'/g,'')}';
            document.getElementById('foto-rec').value='${s.medidas.replace(/'/g,'')}';
          ">Usar sugestão</button>
        </div>`).join('');
      };
    }, 40);
  }

  const del = e.target.closest('[data-action="foto-del"]');
  if (del){
    if (!confirm('Remover esta foto?')) return;
    await App.db.delete('fotos', del.dataset.id);
    App.render();
  }
});

/* ============ PERFIS E USUÁRIOS ============ */
window.APAVAN_PAGES.perfis = async function(){
  const perfis = await App.db.getAll('perfis');
  const usuarios = await App.db.getAll('usuarios');
  return `
    <div class="page-head">
      <div><h2>Perfis e Usuários</h2><div class="sub">Controle local de acesso</div></div>
    </div>

    <div class="card">
      <h3>Perfis disponíveis</h3>
      <div class="tbl-wrap"><table>
        <thead><tr><th>Perfil</th><th>Nível</th><th>Permissões</th></tr></thead>
        <tbody>${perfis.map(p => `<tr>
          <td><strong>${App.esc(p.nome)}</strong></td>
          <td><span class="badge b-azul">${App.esc(p.nivel)}</span></td>
          <td>${App.esc((p.permissoes||[]).join(', '))}</td>
        </tr>`).join('')}</tbody>
      </table></div>
    </div>

    <div class="card">
      <h3>Usuários (${usuarios.length})</h3>
      <button class="btn btn-primary btn-sm" id="usr-add">+ Novo usuário</button>
      <div class="mt-2">
        ${usuarios.length ? `<div class="tbl-wrap"><table>
          <thead><tr><th>Nome</th><th>E-mail</th><th>Perfil</th></tr></thead>
          <tbody>${usuarios.map(u => `<tr>
            <td>${App.esc(u.nome)}</td>
            <td>${App.esc(u.email||'—')}</td>
            <td><span class="badge b-azul">${App.esc(u.perfil||'—')}</span></td>
          </tr>`).join('')}</tbody></table></div>` : '<div class="muted small">Nenhum usuário cadastrado.</div>'}
      </div>
      <p class="small muted mt-2">⚠ A autenticação real com senha e sincronização deve ser conectada a um backend
      (Firebase Auth, Supabase, API própria). Este módulo é apenas cadastral e local.</p>
    </div>
  `;
};

document.addEventListener('click', async (e) => {
  if (e.target.id === 'usr-add'){
    const perfis = await App.db.getAll('perfis');
    const body = `
      <div class="field"><label>Nome</label><input id="u-nome" required></div>
      <div class="field"><label>E-mail</label><input id="u-email" type="email"></div>
      <div class="field"><label>Perfil</label>
        <select id="u-perfil">${perfis.map(p=>`<option value="${p.nome}">${App.esc(p.nome)}</option>`).join('')}</select></div>
    `;
    App.openModal('Novo usuário', body, '', async () => {
      const nome = document.getElementById('u-nome').value;
      if (!nome) throw new Error('Nome obrigatório');
      await App.db.add('usuarios', {
        nome, email: document.getElementById('u-email').value,
        perfil: document.getElementById('u-perfil').value
      });
      App.render();
    });
  }
});

/* ============ DASHBOARD DO CLIENTE (visão simplificada) ============ */
window.APAVAN_PAGES.cliente = async function(){
  const [riscos, ncs, plano, docs, trein, insp] = await Promise.all([
    App.db.getAll('riscos'), App.db.getAll('ncs'), App.db.getAll('planoAcao'),
    App.db.getAll('documentos'), App.db.getAll('treinamentos'), App.db.getAll('inspecoes')
  ]);

  const riscoCrit = riscos.filter(r => App.riscoClassif(r.probabilidade,r.severidade).r >= 15).length;
  const ncAtras = ncs.filter(n => n.prazo && App.daysUntil(n.prazo) < 0 && n.status!=='Concluída').length;
  const docVenc = docs.filter(d => d.validade && App.daysUntil(d.validade) < 0).length;
  const trVenc = trein.filter(t => t.validade && App.daysUntil(t.validade) < 0).length;
  const inspPend = plano.filter(p => p.status !== 'Concluída').length;

  const proximos = [
    ...plano.filter(p => p.when && p.status!=='Concluída').map(p => ({ nome:(p.what||'').slice(0,50), when:p.when, tipo:'Ação' })),
    ...ncs.filter(n => n.prazo && n.status!=='Concluída').map(n => ({ nome:`NC ${n.codigo||''}`, when:n.prazo, tipo:'NC' })),
    ...docs.filter(d => d.validade).map(d => ({ nome:d.titulo, when:d.validade, tipo:'Doc' })),
    ...trein.filter(t => t.validade).map(t => ({ nome:`Trein. ${t.treinamento}`, when:t.validade, tipo:'Trein.' }))
  ].sort((a,b) => new Date(a.when) - new Date(b.when)).slice(0, 10);

  const progresso = plano.length
    ? Math.round(plano.reduce((a,p) => a + (Number(p.percentual)||0), 0) / plano.length)
    : 0;

  return `
    <div class="page-head">
      <div><h2>Situação Atual</h2><div class="sub">Visão gerencial simplificada</div></div>
    </div>

    <div class="kpis">
      <div class="kpi danger"><div class="v">${riscoCrit}</div><div class="l">Riscos Críticos</div></div>
      <div class="kpi danger"><div class="v">${ncAtras}</div><div class="l">Ações Atrasadas</div></div>
      <div class="kpi danger"><div class="v">${docVenc}</div><div class="l">Documentos Vencidos</div></div>
      <div class="kpi danger"><div class="v">${trVenc}</div><div class="l">Treinamentos Vencidos</div></div>
      <div class="kpi warn"><div class="v">${inspPend}</div><div class="l">Inspeções / Ações Pendentes</div></div>
    </div>

    <div class="grid-2">
      <div class="card">
        <h3>Progresso das Ações</h3>
        <div class="bar-row">
          <div class="lbl">Concluído</div>
          <div class="bar"><span style="width:${progresso}%;background:var(--verde)"></span></div>
          <div class="val">${progresso}%</div>
        </div>
        <div class="small muted mt-2">Baseado no % médio das ações do plano 5W2H.</div>
      </div>

      <div class="card">
        <h3>Próximos Prazos</h3>
        ${proximos.length ? `<div class="tbl-wrap"><table>
          <thead><tr><th>Tipo</th><th>Item</th><th>Quando</th></tr></thead>
          <tbody>${proximos.map(p => {
            const d = App.daysUntil(p.when);
            const cls = d<0?'b-vermelho':d<=7?'b-amarelo':'b-cinza';
            return `<tr>
              <td><span class="badge b-azul">${p.tipo}</span></td>
              <td>${App.esc(p.nome)}</td>
              <td>${App.fmtDate(p.when)} <span class="badge ${cls}">${d<0?Math.abs(d)+'d atraso':d+'d'}</span></td>
            </tr>`;
          }).join('')}</tbody></table></div>` : '<div class="muted small">Sem prazos próximos.</div>'}
      </div>
    </div>
  `;
};

/* ============ MOTOR DE REGRAS (checklist inteligente) ============ */
window.APAVAN_PAGES.checklistIntel = async function(){
  const nrs = Object.keys(window.NR_CHECKLISTS);
  const empresa = (App.cache.empresas[0]) || {};
  return `
    <div class="page-head">
      <div><h2>Checklist Inteligente</h2><div class="sub">Gerado a partir do perfil do estabelecimento</div></div>
    </div>

    <div class="card">
      <h3>Contexto do estabelecimento</h3>
      <div class="grid-2">
        <div class="field"><label>CNAE principal</label><input id="ci-cnae" value="${App.esc(empresa.cnae||'')}"></div>
        <div class="field"><label>Nº trabalhadores</label><input id="ci-num" type="number" value="${empresa.numEmpregados||0}"></div>
      </div>
      <div class="grid-2">
        <div class="field"><label>Atividades (separadas por vírgula)</label><input id="ci-atv" value="${App.esc(empresa.atividade||'')}"></div>
      </div>
      <div style="display:flex;gap:14px;flex-wrap:wrap;font-size:13px;margin:8px 0">
        <label><input type="checkbox" id="ci-maq"> Possui máquinas</label>
        <label><input type="checkbox" id="ci-elet" checked> Possui eletricidade</label>
        <label><input type="checkbox" id="ci-ec"> Espaço confinado</label>
        <label><input type="checkbox" id="ci-alt"> Trabalho em altura</label>
        <label><input type="checkbox" id="ci-inf"> Inflamáveis/combustíveis</label>
        <label><input type="checkbox" id="ci-constr"> Construção civil</label>
        <label><input type="checkbox" id="ci-cald"> Caldeiras/vasos</label>
        <label><input type="checkbox" id="ci-qui"> Agentes químicos</label>
        <label><input type="checkbox" id="ci-forno"> Fornos</label>
        <label><input type="checkbox" id="ci-expl"> Explosivos</label>
      </div>
      <button class="btn btn-primary" id="ci-gerar">⚙️ Gerar checklist personalizado</button>
    </div>
    <div id="ci-out"></div>
  `;
};

document.addEventListener('click', async (e) => {
  if (e.target.id !== 'ci-gerar') return;
  const ctx = {
    cnae: document.getElementById('ci-cnae').value,
    numTrabalhadores: Number(document.getElementById('ci-num').value)||0,
    atividades: document.getElementById('ci-atv').value.split(',').map(s=>s.trim()).filter(Boolean),
    temMaquinas: document.getElementById('ci-maq').checked,
    temEletricidade: document.getElementById('ci-elet').checked,
    temEspacoConfinado: document.getElementById('ci-ec').checked,
    temTrabalhoAltura: document.getElementById('ci-alt').checked,
    temInflamaveis: document.getElementById('ci-inf').checked,
    temConstrucao: document.getElementById('ci-constr').checked,
    temCaldeiras: document.getElementById('ci-cald').checked,
    temQuimicos: document.getElementById('ci-qui').checked,
    temFornos: document.getElementById('ci-forno').checked,
    temExplosivos: document.getElementById('ci-expl').checked
  };
  const nrs = window.MotorRegras.avaliar(ctx);
  const checklists = window.MotorRegras.gerarChecklist(ctx);
  const out = document.getElementById('ci-out');
  out.innerHTML = `
    <div class="card">
      <h3>NRs aplicáveis (${nrs.length})</h3>
      <div style="display:flex;gap:6px;flex-wrap:wrap">${nrs.map(n=>`<span class="tag-nr">${n}</span>`).join('')}</div>
      <p class="small muted mt-2">Classificação preliminar gerada por regras. Deve ser validada por profissional habilitado.</p>
    </div>
    ${checklists.filter(c => c.itens.length).map(c => `
      <div class="card">
        <h3><span class="tag-nr">${c.nr}</span> ${App.esc(c.titulo)}</h3>
        <div class="tbl-wrap"><table>
          <thead><tr><th style="width:80px">Item</th><th>Requisito</th></tr></thead>
          <tbody>${c.itens.map(i => `<tr>
            <td><strong>${i.item}</strong></td>
            <td>${App.esc(i.req)}</td>
          </tr>`).join('')}</tbody>
        </table></div>
        <button class="btn btn-primary btn-sm mt-2" onclick="App.navigate('nr${c.nr.replace('NR-','')}')">Ir para módulo ${c.nr}</button>
      </div>
    `).join('')}
    <div class="card" style="background:#fff8e1;border-left:4px solid var(--amarelo)">
      <strong>⚠</strong> Checklist orientativo. A aplicabilidade final depende de avaliação técnica
      e deve ser confirmada no texto vigente de cada NR.
    </div>
  `;
});