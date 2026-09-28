/* ===== APAVAN SST — Inteligência: IA assistiva, busca, vencimentos ===== */
window.APAVAN_PAGES = window.APAVAN_PAGES || {};

/* ============ IA ASSISTIVA (heurística local, offline-first) ============
   Não substitui profissional habilitado. Não usa API externa por padrão.
   Pode ser conectada a backend depois substituindo `analisar()`.
*/
window.IA = {
  // Palavras-chave → sugestões técnicas
  regras: [
    { chaves:['altura','andaime','telhado','cobertura','queda'],
      risco:'Queda de altura', categoria:'Acidente', nr:'NR-35',
      medidas:'Sistema de ancoragem, cinturão paraquedista com talabarte duplo, análise de risco e Permissão de Trabalho.' },
    { chaves:['espaço confinado','tanque','silo','poço','galeria'],
      risco:'Atmosfera perigosa / asfixia', categoria:'Acidente', nr:'NR-33',
      medidas:'PET, monitoramento atmosférico contínuo, vigia, ventilação, plano de resgate.' },
    { chaves:['choque','elétric','painel','fiação','cabo','quadro'],
      risco:'Choque elétrico / arco elétrico', categoria:'Acidente', nr:'NR-10',
      medidas:'Bloqueio e etiquetagem (LOTO), EPI dielétrico, procedimento de trabalho, capacitação.' },
    { chaves:['máquina','engrenagem','correia','prensa','torno'],
      risco:'Aprisionamento / esmagamento', categoria:'Acidente', nr:'NR-12',
      medidas:'Proteções fixas/móveis, botão de emergência, dispositivo de segurança interligado.' },
    { chaves:['ruído','som alto','decib'],
      risco:'Exposição a ruído', categoria:'Físico', nr:'NR-09/NR-15',
      medidas:'Avaliação quantitativa, protetor auricular, medidas de engenharia.' },
    { chaves:['químic','vapor','poeira','fumo','ácido','solvente'],
      risco:'Exposição química', categoria:'Químico', nr:'NR-09/NR-15',
      medidas:'Ventilação, EPI adequado, monitoramento, FISPQ.' },
    { chaves:['ergonom','postura','repetitiv','levantar peso','L.E.R'],
      risco:'Sobrecarga ergonômica', categoria:'Ergonômico', nr:'NR-17',
      medidas:'Análise ergonômica, pausas, mobiliário adequado, mecanização.' },
    { chaves:['incêndio','extintor','fogo','inflamáv','combustív'],
      risco:'Incêndio / explosão', categoria:'Acidente', nr:'NR-23/NR-20',
      medidas:'Extintores, sinalização, rotas de fuga, treinamento, plano de emergência.' },
    { chaves:['caldeira','vaso de pressão','tanque','pressuriz'],
      risco:'Ruptura por pressão', categoria:'Acidente', nr:'NR-13',
      medidas:'Inspeções periódicas, prontuário, válvulas de segurança.' },
    { chaves:['escada','rampa','piso','escorreg'],
      risco:'Queda em mesmo nível', categoria:'Acidente', nr:'NR-08/NR-18',
      medidas:'Sinalização, corrimão, piso antiderrapante, iluminação adequada.' }
  ],

  /**
   * Analisa texto ou descrição de foto e sugere riscos.
   * Retorna array de sugestões com selo "requer validação".
   */
  analisar(texto){
    const t = String(texto||'').toLowerCase();
    if (!t.trim()) return [];
    const sugestoes = [];
    this.regras.forEach(r => {
      const match = r.chaves.some(k => t.includes(k));
      if (match) sugestoes.push({
        risco: r.risco, categoria: r.categoria, nr: r.nr,
        medidas: r.medidas,
        confianca: 'possível',
        aviso: 'Possível não conformidade — requer validação do profissional.'
      });
    });
    return sugestoes;
  },

  /**
   * Analisa uma imagem capturada (dataURL) — puramente heurístico,
   * delegamos para analisar(texto de contexto fornecido pelo usuário).
   */
  async analisarFoto(dataUrl, contextoTexto){
    return this.analisar(contextoTexto);
  },

  /**
   * Gera descrição técnica a partir de campos estruturados.
   */
  descreverTecnico({ perigo, fonte, consequencia, categoria }){
    const partes = [];
    if (perigo) partes.push(`Identificado perigo: ${perigo}.`);
    if (fonte)  partes.push(`Fonte geradora: ${fonte}.`);
    if (consequencia) partes.push(`Possíveis consequências: ${consequencia}.`);
    if (categoria) partes.push(`Classificação preliminar: risco ${categoria}.`);
    partes.push('Análise sujeita a validação técnica pelo responsável habilitado.');
    return partes.join(' ');
  }
};

/* ============ PÁGINA: APAVAN SST IA ============ */
window.APAVAN_PAGES.ia = async function(){
  const sugestoes = await App.db.getAll('iaSugestoes');
  return `
    <div class="page-head">
      <div><h2>APAVAN SST IA</h2><div class="sub">Assistente técnico — não substitui o profissional habilitado</div></div>
    </div>

    <div class="card" style="background:#e3f2fd;border-left:4px solid var(--azul)">
      <strong>Sugestão gerada por IA.</strong> A análise, validação técnica e responsabilidade profissional
      permanecem com o responsável técnico. Nunca consideramos automaticamente que uma situação é infração legal.
    </div>

    <div class="card">
      <h3>Analisar descrição de risco</h3>
      <div class="field">
        <label>Descrição da situação observada</label>
        <textarea id="ia-input" placeholder="Ex: Funcionário em pé sobre andaime sem cinturão, próximo ao vão do 3º pavimento."></textarea>
      </div>
      <button class="btn btn-primary" id="ia-analisar">🧠 Analisar</button>
      <div id="ia-out" class="mt-2"></div>
    </div>

    <div class="card">
      <h3>Histórico de sugestões</h3>
      ${sugestoes.length ? `<div class="tbl-wrap"><table>
        <thead><tr><th>Data</th><th>Texto</th><th>Sugestões</th><th>Status</th></tr></thead>
        <tbody>${sugestoes.slice().reverse().map(s => `<tr>
          <td>${App.fmtDate(s.data)}</td>
          <td>${App.esc((s.texto||'').slice(0,60))}…</td>
          <td>${s.sugestoes?.length || 0}</td>
          <td><span class="badge ${s.status==='aceita'?'b-verde':s.status==='rejeitada'?'b-vermelho':'b-cinza'}">${App.esc(s.status||'pendente')}</span></td>
        </tr>`).join('')}</tbody></table></div>` : '<div class="muted small">Nenhuma análise anterior.</div>'}
    </div>
  `;
};

/* Wiring da página IA */
document.addEventListener('click', async (e) => {
  if (e.target.id !== 'ia-analisar') return;
  const txt = document.getElementById('ia-input').value;
  const sugestoes = window.IA.analisar(txt);
  const out = document.getElementById('ia-out');
  if (!sugestoes.length){
    out.innerHTML = `<div class="muted small">Nenhuma correspondência técnica conhecida. Reforce a descrição com termos como "altura", "elétrico", "máquina", "químico".</div>`;
    return;
  }
  out.innerHTML = sugestoes.map((s,i) => `
    <div class="card" style="box-shadow:none;border:1px solid var(--cinza-borda);margin-top:10px">
      <div style="display:flex;justify-content:space-between;gap:10px;align-items:center">
        <strong>${App.esc(s.risco)}</strong>
        <span class="tag-nr">${App.esc(s.nr)}</span>
      </div>
      <div class="small mt-1"><b>Categoria:</b> ${App.esc(s.categoria)}</div>
      <div class="small mt-1"><b>Medidas sugeridas:</b> ${App.esc(s.medidas)}</div>
      <div class="small muted mt-1" style="font-style:italic">${App.esc(s.aviso)}</div>
      <div style="display:flex;gap:8px;margin-top:10px">
        <button class="btn btn-primary btn-sm" data-ia-accept="${i}">✔ Aceitar como risco</button>
        <button class="btn btn-ghost btn-sm" data-ia-reject="${i}">✕ Rejeitar</button>
      </div>
    </div>
  `).join('');

  // guarda histórico
  const idHist = await App.db.add('iaSugestoes', {
    data: new Date().toISOString(), texto: txt, sugestoes, status: 'pendente'
  });

  // handlers
  out.querySelectorAll('[data-ia-accept]').forEach(b => b.onclick = async () => {
    const s = sugestoes[Number(b.dataset.iaAccept)];
    await App.db.add('riscos', {
      atividade:'(gerado por IA)', perigo:s.risco, categoria:s.categoria, nr:s.nr,
      probabilidade:3, severidade:3, medidasPropostas:s.medidas,
      status:'Aberto', origem:'IA assistiva'
    });
    const h = await App.db.get('iaSugestoes', idHist);
    await App.db.put('iaSugestoes', { ...h, status:'aceita' });
    App.render();
  });
  out.querySelectorAll('[data-ia-reject]').forEach(b => b.onclick = async () => {
    const h = await App.db.get('iaSugestoes', idHist);
    await App.db.put('iaSugestoes', { ...h, status:'rejeitada' });
    alert('Sugestão rejeitada.');
  });
});

/* ============ BUSCA GLOBAL ============ */
window.Busca = {
  async executar(termo){
    const t = termo.trim().toLowerCase();
    if (!t) return [];
    const resultados = [];

    const fontes = [
      { store:'empresas', label:'Empresa', campos:['razaoSocial','nomeFantasia','cnpj','cidade'] },
      { store:'setores', label:'Setor', campos:['nome','descricao','atividade'] },
      { store:'trabalhadores', label:'Trabalhador', campos:['nome','cargo','funcao','matricula'] },
      { store:'riscos', label:'Risco', campos:['perigo','fonte','consequencia','nr','categoria'] },
      { store:'ncs', label:'Não Conformidade', campos:['codigo','descricao','nr'] },
      { store:'planoAcao', label:'Ação', campos:['what','why','who','how'] },
      { store:'documentos', label:'Documento', campos:['titulo','tipo','responsavel'] },
      { store:'treinamentos', label:'Treinamento', campos:['treinamento','nr','instrutor'] },
      { store:'epis', label:'EPI', campos:['epi','ca','fabricante'] },
      { store:'inspecoes', label:'Inspeção', campos:['inspetor','tipo','observacoes'] }
    ];

    for (const f of fontes){
      const rows = await App.db.getAll(f.store);
      rows.forEach(r => {
        const match = f.campos.some(c => String(r[c]||'').toLowerCase().includes(t));
        if (match){
          resultados.push({
            store:f.store, label:f.label, id:r.id,
            titulo: r.razaoSocial || r.nomeFantasia || r.nome || r.perigo || r.codigo ||
                    r.what || r.titulo || r.treinamento || r.epi || r.inspetor ||
                    r.descricao || r.atividade || '(registro)',
            detalhe: f.campos.map(c => r[c]).filter(Boolean).slice(0,2).join(' · ')
          });
        }
      });
    }

    // base normativa
    window.NR_BASE.nrs.forEach(nr => {
      if (nr.codigo.toLowerCase().includes(t) || nr.titulo.toLowerCase().includes(t)){
        resultados.push({ store:'nr', label:'NR', id:nr.codigo, titulo:`${nr.codigo} — ${nr.titulo}`, detalhe:'Base normativa' });
      }
      (nr.itens||[]).forEach(it => {
        if ((it.requisito||'').toLowerCase().includes(t) || (it.item||'').toLowerCase().includes(t)){
          resultados.push({ store:'nr', label:'Requisito', id:nr.codigo, titulo:`${nr.codigo} · item ${it.item}`, detalhe: it.requisito });
        }
      });
    });

    // checklists
    Object.entries(window.NR_CHECKLISTS || {}).forEach(([nr, base]) => {
      base.itens.forEach(it => {
        if ((it.req||'').toLowerCase().includes(t)){
          resultados.push({ store:'nr', label:'Checklist', id:nr, titulo:`${nr} · item ${it.item}`, detalhe: it.req });
        }
      });
    });

    return resultados;
  }
};

window.APAVAN_PAGES.busca = async function(){
  return `
    <div class="page-head">
      <div><h2>Busca Inteligente</h2><div class="sub">Pesquise em todo o sistema: NRs, riscos, NCs, documentos, ações…</div></div>
    </div>
    <div class="card">
      <div class="field" style="margin-bottom:8px">
        <label>Termo</label>
        <input id="busca-input" placeholder="Ex.: NR-35, trabalho em altura, andaime, ruído, espaço confinado, máquina…">
      </div>
      <button class="btn btn-primary" id="busca-btn">🔎 Buscar</button>
      <div id="busca-out" class="mt-2"></div>
    </div>
  `;
};

document.addEventListener('click', async (e) => {
  if (e.target.id !== 'busca-btn') return;
  const t = document.getElementById('busca-input').value;
  const out = document.getElementById('busca-out');
  out.innerHTML = '<div class="muted small">Buscando…</div>';
  const res = await window.Busca.executar(t);
  if (!res.length){ out.innerHTML = '<div class="muted small">Nenhum resultado.</div>'; return; }
  out.innerHTML = `<div class="small muted mb-2">${res.length} resultado(s)</div>` + res.map(r => `
    <div style="border-bottom:1px solid var(--cinza-borda);padding:8px 0">
      <span class="badge b-azul">${App.esc(r.label)}</span>
      <strong style="margin-left:8px">${App.esc(r.titulo)}</strong>
      <div class="small muted">${App.esc(r.detalhe)}</div>
    </div>`).join('');
});

/* ============ CENTRAL DE VENCIMENTOS ============ */
window.APAVAN_PAGES.vencimentos = async function(){
  const [trein, docs, ncs, epis, plano, checklists, pt, pet] = await Promise.all([
    App.db.getAll('treinamentos'), App.db.getAll('documentos'), App.db.getAll('ncs'),
    App.db.getAll('epis'), App.db.getAll('planoAcao'),
    App.db.getAll('checklistsNR'), App.db.getAll('pt'), App.db.getAll('pet')
  ]);

  const itens = [];
  trein.forEach(t => t.validade && itens.push({ cat:'Treinamento', nome:`${t.treinamento} — ${App.trabNome(t.trabalhadorId)}`, venc:t.validade, origem:'treinamentos', id:t.id }));
  docs.forEach(d => d.validade && itens.push({ cat:'Documento', nome:d.titulo, venc:d.validade, origem:'documentos', id:d.id }));
  ncs.forEach(n => n.prazo && n.status!=='Concluída' && itens.push({ cat:'NC', nome:`${n.codigo||''} — ${(n.descricao||'').slice(0,40)}`, venc:n.prazo, origem:'ncs', id:n.id }));
  epis.forEach(e => e.validade && itens.push({ cat:'EPI', nome:`${e.epi} — ${App.trabNome(e.trabalhadorId)}`, venc:e.validade, origem:'epis', id:e.id }));
  plano.forEach(p => p.when && p.status!=='Concluída' && itens.push({ cat:'Ação', nome:(p.what||'').slice(0,50), venc:p.when, origem:'planoAcao', id:p.id }));
  pt.forEach(p => p.validade && p.status!=='Encerrada' && itens.push({ cat:'PT', nome:`${p.numero} — ${p.tipo||''}`, venc:p.validade, origem:'pt', id:p.id }));
  pet.forEach(p => p.data && p.status!=='Encerrada' && itens.push({ cat:'PET', nome:`${p.numero} — ${p.espaco||''}`, venc:p.data, origem:'pet', id:p.id }));
  checklists.forEach(c => itens.push({ cat:'Checklist', nome:`Checklist ${c.nr}`, venc:c.data, origem:'checklistsNR', id:c.id }));

  itens.sort((a,b) => new Date(a.venc) - new Date(b.venc));

  const venc  = itens.filter(i => App.daysUntil(i.venc) < 0);
  const d30   = itens.filter(i => { const d = App.daysUntil(i.venc); return d>=0 && d<=30; });
  const d60   = itens.filter(i => { const d = App.daysUntil(i.venc); return d>30 && d<=60; });
  const reg   = itens.filter(i => App.daysUntil(i.venc) > 60);

  const bloco = (t, cls, arr) => `
    <div class="card">
      <h3><span class="badge ${cls}">${t}</span> — ${arr.length} item(ns)</h3>
      ${arr.length ? `<div class="tbl-wrap"><table>
        <thead><tr><th>Categoria</th><th>Item</th><th>Vencimento</th><th>Dias</th></tr></thead>
        <tbody>${arr.map(i => {
          const d = App.daysUntil(i.venc);
          return `<tr>
            <td><span class="badge b-azul">${i.cat}</span></td>
            <td>${App.esc(i.nome)}</td>
            <td>${App.fmtDate(i.venc)}</td>
            <td>${d<0?`<span class="badge b-vermelho">${Math.abs(d)}d</span>`:d+'d'}</td>
          </tr>`;
        }).join('')}</tbody></table></div>` : '<div class="muted small">Nada nesta faixa.</div>'}
    </div>`;

  return `
    <div class="page-head">
      <div><h2>Central de Vencimentos</h2><div class="sub">${itens.length} registro(s) monitorado(s)</div></div>
      <button class="btn btn-ghost" data-action="print">🖨 Imprimir</button>
    </div>
    <div class="kpis">
      <div class="kpi danger"><div class="v">${venc.length}</div><div class="l">🔴 Vencidos</div></div>
      <div class="kpi warn"><div class="v">${d30.length}</div><div class="l">🟡 Vencem em 30 dias</div></div>
      <div class="kpi warn"><div class="v">${d60.length}</div><div class="l">🟠 Vencem em 60 dias</div></div>
      <div class="kpi ok"><div class="v">${reg.length}</div><div class="l">🟢 Regulares</div></div>
    </div>
    ${bloco('🔴 VENCIDOS','b-vermelho',venc)}
    ${bloco('🟡 Vencem em 30 dias','b-amarelo',d30)}
    ${bloco('🟠 Vencem em 60 dias','b-laranja',d60)}
    ${bloco('🟢 Regulares','b-verde',reg)}
  `;
};