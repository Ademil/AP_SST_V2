/* ===== APAVAN SST — Base de Checklists Normativos + Motor de Regras =====
   NOTA: Cada item é um "requisito verificado". Onde não houver certeza
   da literalidade do texto, marcamos "VERIFICAR TEXTO VIGENTE DA NORMA".
   Este arquivo é a fonte primária para gerar checklists, auditorias e NCs.
*/

window.NR_CHECKLISTS = {

  'NR-06': {
    titulo:'Equipamento de Proteção Individual',
    itens:[
      { id:'6-1', item:'6.2', req:'EPI adequado ao risco é fornecido gratuitamente ao trabalhador.', obs:'VERIFICAR TEXTO VIGENTE DA NORMA' },
      { id:'6-2', item:'6.6', req:'Todo EPI possui CA (Certificado de Aprovação) válido.', obs:'VERIFICAR TEXTO VIGENTE DA NORMA' },
      { id:'6-3', item:'6.7', req:'Registro de entrega de EPI assinado pelo trabalhador.', obs:'VERIFICAR TEXTO VIGENTE DA NORMA' },
      { id:'6-4', item:'6.6', req:'EPI em bom estado de conservação e funcionamento.', obs:'VERIFICAR TEXTO VIGENTE DA NORMA' },
      { id:'6-5', item:'6.9', req:'Treinamento sobre uso, guarda e conservação do EPI.', obs:'VERIFICAR TEXTO VIGENTE DA NORMA' }
    ]
  },

  'NR-10': {
    titulo:'Segurança em Instalações e Serviços em Eletricidade',
    itens:[
      { id:'10-1', item:'10.2', req:'Prontuário das instalações elétricas disponível.', obs:'VERIFICAR TEXTO VIGENTE DA NORMA' },
      { id:'10-2', item:'10.2', req:'Diagramas unifilares atualizados.', obs:'VERIFICAR TEXTO VIGENTE DA NORMA' },
      { id:'10-3', item:'10.3', req:'Medidas de controle do risco elétrico implantadas.', obs:'VERIFICAR TEXTO VIGENTE DA NORMA' },
      { id:'10-4', item:'10.7', req:'Documentação e treinamentos previstos na NR-10.', obs:'VERIFICAR TEXTO VIGENTE DA NORMA' },
      { id:'10-5', item:'10.8', req:'Trabalhadores autorizados e capacitados por nível.', obs:'VERIFICAR TEXTO VIGENTE DA NORMA' },
      { id:'10-6', item:'10.9', req:'EPIs dielétricos e ferramentas isoladas adequadas.', obs:'VERIFICAR TEXTO VIGENTE DA NORMA' },
      { id:'10-7', item:'10.10', req:'Bloqueio e etiquetagem (LOTO) aplicados.', obs:'VERIFICAR TEXTO VIGENTE DA NORMA' },
      { id:'10-8', item:'10.11', req:'Sinalização de segurança em instalações elétricas.', obs:'VERIFICAR TEXTO VIGENTE DA NORMA' },
      { id:'10-9', item:'10.12', req:'Procedimentos de trabalho documentados.', obs:'VERIFICAR TEXTO VIGENTE DA NORMA' },
      { id:'10-10', item:'10.13', req:'Inspeções periódicas registradas.', obs:'VERIFICAR TEXTO VIGENTE DA NORMA' }
    ]
  },

  'NR-12': {
    titulo:'Segurança no Trabalho em Máquinas e Equipamentos',
    itens:[
      { id:'12-1', item:'12.1', req:'Inventário de máquinas e equipamentos atualizado.', obs:'VERIFICAR TEXTO VIGENTE DA NORMA' },
      { id:'12-2', item:'12.38', req:'Proteções fixas em partes móveis acessíveis.', obs:'VERIFICAR TEXTO VIGENTE DA NORMA' },
      { id:'12-3', item:'12.38', req:'Dispositivos de proteção móveis interligados.', obs:'VERIFICAR TEXTO VIGENTE DA NORMA' },
      { id:'12-4', item:'12.56', req:'Botão de parada de emergência acessível.', obs:'VERIFICAR TEXTO VIGENTE DA NORMA' },
      { id:'12-5', item:'12.10', req:'Comandos identificados e protegidos contra acionamento involuntário.', obs:'VERIFICAR TEXTO VIGENTE DA NORMA' },
      { id:'12-6', item:'12.4', req:'Arranjo físico adequado e espaços seguros de operação.', obs:'VERIFICAR TEXTO VIGENTE DA NORMA' },
      { id:'12-7', item:'12.135', req:'Sinalização de segurança nas máquinas.', obs:'VERIFICAR TEXTO VIGENTE DA NORMA' },
      { id:'12-8', item:'12.112', req:'Manutenção preventiva e registro.', obs:'VERIFICAR TEXTO VIGENTE DA NORMA' },
      { id:'12-9', item:'12.135', req:'Capacitação dos operadores de máquinas.', obs:'VERIFICAR TEXTO VIGENTE DA NORMA' },
      { id:'12-10', item:'12.15', req:'Documentação técnica e manuais disponíveis.', obs:'VERIFICAR TEXTO VIGENTE DA NORMA' }
    ]
  },

  'NR-13': {
    titulo:'Caldeiras, Vasos de Pressão, Tubulações e Tanques',
    itens:[
      { id:'13-1', item:'13.2', req:'Caldeiras possuem Prontuário completo.', obs:'VERIFICAR TEXTO VIGENTE DA NORMA' },
      { id:'13-2', item:'13.3', req:'Vasos de pressão categorizados e inspecionados.', obs:'VERIFICAR TEXTO VIGENTE DA NORMA' },
      { id:'13-3', item:'13.4', req:'Inspeções periódicas (inicial, periódica, extraordinária) em dia.', obs:'VERIFICAR TEXTO VIGENTE DA NORMA' },
      { id:'13-4', item:'13.5', req:'Sistema de segurança operacional (válvulas, indicadores).', obs:'VERIFICAR TEXTO VIGENTE DA NORMA' },
      { id:'13-5', item:'13.6', req:'Operadores capacitados e certificados.', obs:'VERIFICAR TEXTO VIGENTE DA NORMA' }
    ]
  },

  'NR-17': {
    titulo:'Ergonomia',
    itens:[
      { id:'17-1', item:'17.4', req:'Avaliação ergonômica preliminar das atividades realizada.', obs:'VERIFICAR TEXTO VIGENTE DA NORMA' },
      { id:'17-2', item:'17.5', req:'Análise Ergonômica do Trabalho (AET) quando aplicável.', obs:'VERIFICAR TEXTO VIGENTE DA NORMA' },
      { id:'17-3', item:'17.6', req:'Mobiliário e posto de trabalho adequados.', obs:'VERIFICAR TEXTO VIGENTE DA NORMA' },
      { id:'17-4', item:'17.7', req:'Levantamento, transporte e descarga de cargas avaliados.', obs:'VERIFICAR TEXTO VIGENTE DA NORMA' },
      { id:'17-5', item:'17.8', req:'Fatores psicossociais e organização do trabalho considerados.', obs:'VERIFICAR TEXTO VIGENTE DA NORMA' }
    ]
  },

  'NR-18': {
    titulo:'Segurança na Indústria da Construção',
    itens:[
      { id:'18-1', item:'18.3', req:'PGR específico da obra elaborado.', obs:'VERIFICAR TEXTO VIGENTE DA NORMA' },
      { id:'18-2', item:'18.4', req:'Áreas de vivência (vestiário, sanitário, refeitório) adequadas.', obs:'VERIFICAR TEXTO VIGENTE DA NORMA' },
      { id:'18-3', item:'18.5', req:'Instalações elétricas provisórias seguras.', obs:'VERIFICAR TEXTO VIGENTE DA NORMA' },
      { id:'18-4', item:'18.6', req:'Escavações, fundações e desmonte com proteção.', obs:'VERIFICAR TEXTO VIGENTE DA NORMA' },
      { id:'18-5', item:'18.12', req:'Andaimes com projeto e inspeção.', obs:'VERIFICAR TEXTO VIGENTE DA NORMA' },
      { id:'18-6', item:'18.13', req:'Plataformas de proteção contra queda.', obs:'VERIFICAR TEXTO VIGENTE DA NORMA' },
      { id:'18-7', item:'18.14', req:'Escadas, rampas e passarelas com guarda-corpo.', obs:'VERIFICAR TEXTO VIGENTE DA NORMA' },
      { id:'18-8', item:'18.23', req:'Cintos, sistemas de ancoragem e trava-queda.', obs:'VERIFICAR TEXTO VIGENTE DA NORMA' }
    ]
  },

  'NR-20': {
    titulo:'Segurança com Inflamáveis e Combustíveis',
    itens:[
      { id:'20-1', item:'20.5', req:'Análise de risco para instalações classe I, II ou III.', obs:'VERIFICAR TEXTO VIGENTE DA NORMA' },
      { id:'20-2', item:'20.6', req:'Plano de resposta a emergências específico.', obs:'VERIFICAR TEXTO VIGENTE DA NORMA' },
      { id:'20-3', item:'20.7', req:'Treinamento específico por classe e nível.', obs:'VERIFICAR TEXTO VIGENTE DA NORMA' },
      { id:'20-4', item:'20.8', req:'Procedimentos operacionais documentados.', obs:'VERIFICAR TEXTO VIGENTE DA NORMA' },
      { id:'20-5', item:'20.9', req:'Medidas de controle de fontes de ignição.', obs:'VERIFICAR TEXTO VIGENTE DA NORMA' }
    ]
  },

  'NR-23': {
    titulo:'Proteção Contra Incêndios',
    itens:[
      { id:'23-1', item:'23.1', req:'Saídas de emergência desobstruídas e sinalizadas.', obs:'VERIFICAR TEXTO VIGENTE DA NORMA' },
      { id:'23-2', item:'23.2', req:'Extintores com carga em dia e desobstruídos.', obs:'VERIFICAR TEXTO VIGENTE DA NORMA' },
      { id:'23-3', item:'23.3', req:'Iluminação de emergência funcional.', obs:'VERIFICAR TEXTO VIGENTE DA NORMA' },
      { id:'23-4', item:'23.4', req:'Rotas de fuga e pontos de encontro definidos.', obs:'VERIFICAR TEXTO VIGENTE DA NORMA' },
      { id:'23-5', item:'23.5', req:'Treinamento de combate a incêndio e abandono.', obs:'VERIFICAR TEXTO VIGENTE DA NORMA' }
    ]
  },

  'NR-33': {
    titulo:'Segurança e Saúde nos Trabalhos em Espaços Confinados',
    itens:[
      { id:'33-1', item:'33.2', req:'Espaços confinados identificados e sinalizados.', obs:'VERIFICAR TEXTO VIGENTE DA NORMA' },
      { id:'33-2', item:'33.3', req:'Permissão de Entrada e Trabalho (PET) emitida.', obs:'VERIFICAR TEXTO VIGENTE DA NORMA' },
      { id:'33-3', item:'33.5', req:'Monitoramento atmosférico antes e durante a entrada.', obs:'VERIFICAR TEXTO VIGENTE DA NORMA' },
      { id:'33-4', item:'33.4', req:'Trabalhadores autorizados e capacitados.', obs:'VERIFICAR TEXTO VIGENTE DA NORMA' },
      { id:'33-5', item:'33.5', req:'Vigia designado durante o trabalho.', obs:'VERIFICAR TEXTO VIGENTE DA NORMA' },
      { id:'33-6', item:'33.6', req:'Supervisor de entrada designado.', obs:'VERIFICAR TEXTO VIGENTE DA NORMA' },
      { id:'33-7', item:'33.7', req:'Plano de emergência e resgate documentado.', obs:'VERIFICAR TEXTO VIGENTE DA NORMA' }
    ]
  },

  'NR-35': {
    titulo:'Trabalho em Altura',
    itens:[
      { id:'35-1', item:'35.2', req:'Análise de risco e medidas preventivas documentadas.', obs:'VERIFICAR TEXTO VIGENTE DA NORMA' },
      { id:'35-2', item:'35.3', req:'Permissão de Trabalho (PT) emitida quando aplicável.', obs:'VERIFICAR TEXTO VIGENTE DA NORMA' },
      { id:'35-3', item:'35.4', req:'Sistema de ancoragem em boas condições.', obs:'VERIFICAR TEXTO VIGENTE DA NORMA' },
      { id:'35-4', item:'35.5', req:'EPI contra queda: cinturão paraquedista e talabarte/trava-queda.', obs:'VERIFICAR TEXTO VIGENTE DA NORMA' },
      { id:'35-5', item:'35.6', req:'Trabalhadores autorizados, aptos e capacitados.', obs:'VERIFICAR TEXTO VIGENTE DA NORMA' },
      { id:'35-6', item:'35.7', req:'Plano de emergência e resgate disponível.', obs:'VERIFICAR TEXTO VIGENTE DA NORMA' },
      { id:'35-7', item:'35.5', req:'Inspeção periódica dos EPIs e sistemas de ancoragem.', obs:'VERIFICAR TEXTO VIGENTE DA NORMA' }
    ]
  }
};

/* ===== MOTOR DE REGRAS =====
   Determina NRs aplicáveis a partir do perfil do estabelecimento.
   NÃO substitui análise técnica — apenas orienta a geração de checklists.
*/
window.MotorRegras = {
  /**
   * @param {Object} ctx { cnae, atividades:[], temMaquinas, temEletricidade,
   *                       temEspacoConfinado, temTrabalhoAltura, temInflamaveis,
   *                       temConstrucao, temCaldeiras, temQuimicos, numTrabalhadores }
   * @returns {string[]} lista de NRs aplicáveis
   */
  avaliar(ctx = {}){
    const aplicaveis = new Set(['NR-01','NR-06','NR-07','NR-09','NR-17','NR-24','NR-26']);

    const cnae = String(ctx.cnae || '');
    const ativ = (ctx.atividades || []).map(a => String(a).toLowerCase()).join(' ');

    // CNAE → heurísticas amplamente conhecidas
    if (/41|42|43/.test(cnae) || /constru|obra/.test(ativ)) {
      aplicaveis.add('NR-18'); aplicaveis.add('NR-35'); aplicaveis.add('NR-06'); aplicaveis.add('NR-12');
    }
    if (/10|11|13|14|15|16|17|18|19|20|21|22|23|24|25|26|27|28|29|30/.test(cnae) || /ind[uú]stria|fabric/.test(ativ)){
      aplicaveis.add('NR-12'); aplicaveis.add('NR-11');
    }
    if (/86|87|75/.test(cnae) || /sa[uú]de|hospital|cl[ií]nica/.test(ativ)) aplicaveis.add('NR-32');
    if (/01|02|03/.test(cnae) || /agro|pecu|silvic/.test(ativ)) aplicaveis.add('NR-31');
    if (/35|38/.test(cnae) || /res[ií]duo|limpeza urbana/.test(ativ)) aplicaveis.add('NR-38');
    if (/porto|portu/.test(ativ)) aplicaveis.add('NR-29');
    if (/minera/.test(ativ)) aplicaveis.add('NR-22');
    if (/a[çc]ougue|abate|carnes/.test(ativ)) aplicaveis.add('NR-36');
    if (/plataforma|petr[oó]leo/.test(ativ)) aplicaveis.add('NR-37');

    if (ctx.temMaquinas)            aplicaveis.add('NR-12');
    if (ctx.temEletricidade !== false) aplicaveis.add('NR-10');
    if (ctx.temEspacoConfinado)     aplicaveis.add('NR-33');
    if (ctx.temTrabalhoAltura)      aplicaveis.add('NR-35');
    if (ctx.temInflamaveis)         { aplicaveis.add('NR-20'); aplicaveis.add('NR-23'); }
    if (ctx.temConstrucao)          aplicaveis.add('NR-18');
    if (ctx.temCaldeiras)           aplicaveis.add('NR-13');
    if (ctx.temQuimicos)            aplicaveis.add('NR-15');
    if (ctx.temFornos)              aplicaveis.add('NR-14');
    if (ctx.temExplosivos)          aplicaveis.add('NR-19');
    if (ctx.temRadiacao)            aplicaveis.add('NR-15');
    if (ctx.temPericulosidade)      aplicaveis.add('NR-16');

    // Sempre aplicáveis em ambiente industrial
    if (Number(ctx.numTrabalhadores || 0) > 0) aplicaveis.add('NR-05');

    return Array.from(aplicaveis).sort();
  },

  /**
   * Gera checklist personalizado a partir do contexto do estabelecimento
   * juntando os itens aplicáveis de NR_CHECKLISTS.
   */
  gerarChecklist(ctx){
    const nrs = this.avaliar(ctx);
    return nrs.map(nr => ({
      nr,
      titulo: (window.NR_CHECKLISTS[nr] && window.NR_CHECKLISTS[nr].titulo) || ((window.NR_BASE.nrs.find(n=>n.codigo===nr)||{}).titulo || 'NR'),
      itens: (window.NR_CHECKLISTS[nr] || { itens: [] }).itens
    }));
  }
};