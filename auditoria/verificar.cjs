// Diagnóstico da auditoria. Executa os scripts reais em um DOM mínimo simulado.
// Não reproduz layout, validação nativa dos formulários ou execução de HTML.
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const crypto = require('node:crypto');
const root = path.resolve(__dirname, '..');
const sources = {};
function walk(dir) {
  for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
    if (item.name === 'auditoria') continue;
    const full = path.join(dir, item.name);
    if (item.isDirectory()) walk(full);
    else if (/\.(html|js|css)$/.test(item.name)) sources[path.relative(root, full).replaceAll('\\', '/')] = fs.readFileSync(full, 'utf8');
  }
}
walk(root);
const clean = html => html.replace(/<!--[\s\S]*?-->/g, '');
function attrs(source) {
  const result = {};
  for (const match of source.matchAll(/([\w-]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g)) result[match[1]] = match[2] ?? match[3] ?? match[4] ?? '';
  return result;
}
class Element {
  constructor(tag, attributes = {}) {
    this.tag = tag; this.attributes = attributes; this.value = attributes.value ?? '';
    this.defaultValue = this.value; this.className = attributes.class ?? '';
    this.textContent = ''; this.innerText = ''; this._html = ''; this.children = [];
    this.events = {}; this.style = {}; this.offsetWidth = 0;
    this.classList = {
      contains: name => this.className.split(/\s+/).includes(name),
      add: (...names) => { this.className = [...new Set([...this.className.split(/\s+/).filter(Boolean), ...names])].join(' '); },
      remove: (...names) => { this.className = this.className.split(/\s+/).filter(name => !names.includes(name)).join(' '); },
      toggle: (name, force) => { const use = force ?? !this.classList.contains(name); use ? this.classList.add(name) : this.classList.remove(name); return use; }
    };
  }
  get innerHTML() { return this._html; }
  set innerHTML(value) { this._html = String(value); this.children = []; }
  addEventListener(event, callback) { (this.events[event] ??= []).push(callback); }
  fire(event, props = {}) { for (const callback of this.events[event] ?? []) callback({ preventDefault() {}, target: this, ...props }); }
  click() { this.fire('click'); }
  focus() {}
  getAttribute(name) { return this.attributes[name] ?? null; }
  setAttribute(name, value) { this.attributes[name] = value; }
  removeAttribute(name) { delete this.attributes[name]; }
  appendChild(child) { this.children.push(child); }
  querySelector(selector) { return selector === '.status-icon' ? { remove() {} } : null; }
  insertAdjacentHTML(position, value) { this._html += value; }
}
function load(htmlPath, storage = {}) {
  const html = clean(sources[htmlPath]); const nodes = {}; const controls = [];
  for (const match of html.matchAll(/<([a-z][\w-]*)\b([^>]*)>/gi)) {
    const at = attrs(match[2]); const node = new Element(match[1], at);
    if (at.id) nodes[at.id] = node;
    if (/^(input|select|textarea)$/i.test(match[1])) controls.push(node);
  }
  for (const match of html.matchAll(/<select\b([^>]*)>([\s\S]*?)<\/select>/gi)) {
    const at = attrs(match[1]); if (!nodes[at.id]) continue;
    const options = [...match[2].matchAll(/<option\b([^>]*)>([\s\S]*?)<\/option>/gi)];
    const chosen = options.find(option => Object.hasOwn(attrs(option[1]), 'selected')) ?? options[0];
    nodes[at.id].value = attrs(chosen[1]).value ?? chosen[2].trim(); nodes[at.id].defaultValue = nodes[at.id].value;
  }
  const menuItems = []; const links = [];
  if (htmlPath === 'index.html') for (const match of html.matchAll(/<li\b([^>]*)>\s*<a\b([^>]*)>/gi)) {
    const li = new Element('li', attrs(match[1])); const link = new Element('a', attrs(match[2])); link.parentElement = li;
    menuItems.push(li); links.push(link);
  }
  const document = {
    getElementById: id => nodes[id] ?? null,
    createElement: tag => new Element(tag),
    addEventListener(event, callback) { if (event === 'DOMContentLoaded') callback(); },
    querySelectorAll: selector => selector === '.nav__link' ? links : menuItems
  };
  for (const node of Object.values(nodes)) if (node.tag === 'form') node.reset = () => {
    for (const control of controls) control.value = control.defaultValue;
    node.fire('reset');
  };
  const messages = []; const logs = []; const timers = [];
  const sandbox = {
    document, alert: message => messages.push(message), confirm: () => true,
    console: { log: (...values) => logs.push(values) },
    localStorage: { getItem: key => storage[key] ?? null, setItem: (key, value) => { storage[key] = String(value); } },
    setInterval: callback => { timers.push(callback); return timers.length; },
    setTimeout: callback => { timers.push(callback); return timers.length; }, clearTimeout() {}
  };
  sandbox.window = sandbox; const context = vm.createContext(sandbox);
  const script = [...html.matchAll(/<script\b[^>]*src="([^"]+)"/gi)][0][1];
  const scriptPath = path.posix.normalize(path.posix.join(path.posix.dirname(htmlPath), script));
  let error = null;
  try { vm.runInContext(sources[scriptPath], context, { filename: scriptPath, timeout: 1000 }); }
  catch (caught) { error = { message: caught.message, stack: caught.stack }; }
  return { nodes, context, error, messages, logs, storage, links, menuItems };
}
function setValues(session, values) { for (const [id, value] of Object.entries(values)) session.nodes[id].value = value; }
const evidence = { dataAuditoria: '2026-10-08', metodo: 'Leitura estática e execução dos scripts reais em VM com DOM mínimo; sem validação visual ou execução de HTML pelo navegador.', arquivos: Object.keys(sources).length, verificacoes: [] };
function record(id, observed) { evidence.verificacoes.push({ id, ...observed }); }
record('sintaxe-js', { arquivos: Object.entries(sources).filter(([p]) => /\.js$/.test(p)).map(([p, s]) => { try { new vm.Script(s); return { arquivo: p, valido: true }; } catch (e) { return { arquivo: p, valido: false, erro: e.message }; } }) });
const resources = [];
const structure = [];
for (const [htmlPath, source] of Object.entries(sources).filter(([p]) => /\.html$/.test(p))) {
  const html = clean(source); const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(m => m[1]);
  for (const match of html.matchAll(/<(a|link|script|iframe)\b([^>]*)>/gi)) {
    const at = attrs(match[2]); const url = at.href ?? at.src;
    if (!url || url.startsWith('#') || /^(https?:|data:)/.test(url)) continue;
    const full = path.resolve(root, path.dirname(htmlPath), decodeURIComponent(url));
    resources.push({ origem: htmlPath, destino: url, existe: fs.existsSync(full) });
  }
  structure.push({ arquivo: htmlPath, idsDuplicados: ids.filter((id, i) => ids.indexOf(id) !== i), viewport: /name="viewport"/.test(html), linksSemDestino: [...html.matchAll(/href="#"/g)].length, labelsSemAssociacao: [...html.matchAll(/<label\b([^>]*)>([\s\S]*?)<\/label>/gi)].filter(m => !attrs(m[1]).for && !/<(?:input|select|textarea)\b/.test(m[2])).map(m => m[2].trim()) });
}
record('recursos-locais', { recursos: resources }); record('estrutura-html', { paginas: structure });
record('inicializacao', { paginas: Object.keys(sources).filter(p => /\.html$/.test(p)).map(p => ({ arquivo: p, erro: load(p).error })) });
let cadastro = load('modulos/mod01-cadastros/index.html');
setValues(cadastro, { plano: 'Mensal', dataInicio: '2026-01-31' }); cadastro.nodes.plano.fire('change');
record('vencimento-fim-do-mes', { inicio: '2026-01-31', plano: 'Mensal', vencimento: cadastro.nodes.dataVencimento.value });
setValues(cadastro, { plano: 'Anual', dataInicio: '2024-02-29' }); cadastro.nodes.plano.fire('change');
record('vencimento-ano-bissexto', { inicio: '2024-02-29', plano: 'Anual', vencimento: cadastro.nodes.dataVencimento.value });
cadastro = load('modulos/mod01-cadastros/index.html');
setValues(cadastro, { plano: 'Mensal', dataInicio: '2099-01-01' }); cadastro.nodes.plano.fire('change'); cadastro.context.trancarMatricula();
const suspended = cadastro.nodes.statusContrato.value; cadastro.nodes.dataVencimento.fire('change');
record('suspensao-sobrescrita', { antes: suspended, depois: cadastro.nodes.statusContrato.value });
setValues(cadastro, { cpf: 'abc', valor: '-10', foto: 'foto-teste.png', nome: 'Aluno Teste', restricoes: 'Nenhuma' }); cadastro.nodes.formCadastro.fire('submit');
const saved = JSON.parse(cadastro.logs.at(-1)[1]);
record('cadastro-semantica', { cpfNoObjeto: saved.cpf, valorNoObjeto: saved.contrato.valor, fotoIncluida: Object.hasOwn(saved, 'foto'), mensagem: cadastro.messages.at(-1), armazenamento: cadastro.storage });
let financeiro = load('modulos/modulo 2/index.html');
setValues(financeiro, { aluno: '<b>Teste</b>', plano: 'Anual', pagamento: 'Pix', dataInicio: '2026-10-08', dataVencimento: '2026-01-01', tolerancia: '5', status: 'Pago' }); financeiro.nodes.formFinanceiro.fire('submit');
record('financeiro-renderizacao', { htmlDaLinha: financeiro.nodes.tabelaDados.children.at(-1).innerHTML, dataInicioLidaPeloScript: /getElementById\(['"]dataInicio['"]\)/.test(sources['modulos/modulo 2/script.js']), linhasAdicionadas: financeiro.nodes.tabelaDados.children.length, linhasAdicionadasAposReabrir: load('modulos/modulo 2/index.html').nodes.tabelaDados.children.length });
let avaliacao = load('modulos/Modulo 5/index.html');
setValues(avaliacao, { data: '2026-10-08', intervalo: '60' }); avaliacao.nodes.data.fire('change'); const next = avaliacao.nodes.proxima.innerText; avaliacao.nodes.formAvaliacao.reset();
record('avaliacao-reset', { proximaAntes: next, dataDepois: avaliacao.nodes.data.value, intervaloDepois: avaliacao.nodes.intervalo.value, proximaDepois: avaliacao.nodes.proxima.innerText });
setValues(avaliacao, { aluno: '<b>Teste</b>', matricula: 'TESTE', data: '2026-10-08', peso: '-5', gordura: '120', altura: '180', objetivo: 'Outro' }); avaliacao.nodes.data.fire('change'); avaliacao.nodes.formAvaliacao.fire('submit');
record('avaliacao-renderizacao', { htmlDaLinha: avaliacao.nodes.historico.children.at(-1).innerHTML, alturaLidaPeloScript: /getElementById\(['"]altura['"]\)/.test(sources['modulos/Modulo 5/script.js']), linhasAdicionadas: avaliacao.nodes.historico.children.length, linhasAdicionadasAposReabrir: load('modulos/Modulo 5/index.html').nodes.historico.children.length });
const relatorio = load('modulos/mod06-relatorios/index.html');
setValues(relatorio, { status: 'todos', dataInicio: '2099-01-01', dataFim: '2099-01-02' }); relatorio.nodes.btnFiltrar.click();
record('relatorio-periodo', { inicio: '2099-01-01', fim: '2099-01-02', registros: relatorio.nodes.tabelaCorpo.children.length, mensagem: relatorio.nodes.mensagemInfo.innerText });
relatorio.nodes.status.value = 'inativo'; relatorio.nodes.btnFiltrar.click(); record('relatorio-status', { registros: relatorio.nodes.tabelaCorpo.children.length });
const catraca = load('modulos/mod03-catraca/index.html'); catraca.nodes.matricula.value = '1111'; catraca.nodes['btn-validar'].click();
record('catraca-regras', { erroInicial: catraca.error?.message ?? null, resultado: catraca.nodes['status-title'].textContent, vencimentoExibido: catraca.nodes['student-due'].textContent, eventoManualRegistradoAntesDoErro: true });
catraca.nodes.matricula.value = '<b>x</b>'; catraca.nodes['btn-validar'].click();
record('catraca-html-no-log', { entrada: '<b>x</b>', comprimento: '<b>x</b>'.length, html: catraca.nodes['log-body'].innerHTML });
for (let n = 0; n < 6; n++) { catraca.nodes.matricula.value = '1111'; catraca.nodes['btn-validar'].click(); }
record('catraca-retencao', { registrosRetidos: vm.runInContext('logEntries.length', catraca.context), eventosContados: vm.runInContext('logCounter', catraca.context) });
const liberacao = load('modulos/mod04-auditoria/index.html');
setValues(liberacao, { aluno: 'Aluno inexistente', acesso: 'entrada', responsavel: 'supervisor', usuario: 'Usuario informado manualmente', justificativa: 'Teste de auditoria' }); liberacao.nodes.liberacaoForm.fire('submit');
record('liberacao-simulada', { mensagem: liberacao.nodes.feedback.textContent, armazenamento: liberacao.storage });
const shell = load('index.html', { perfilAtivo: 'portaria' });
record('navegacao-perfis', { perfil: shell.nodes.perfil.value, itensVisiveis: shell.links.filter(l => !l.parentElement.classList.contains('is-hidden')).map(l => l.getAttribute('href')), moduloInicial: shell.nodes.conteudo.src });
shell.nodes.perfil.value = 'admin'; shell.nodes.perfil.fire('change');
record('navegacao-admin', { itensVisiveis: shell.links.filter(l => !l.parentElement.classList.contains('is-hidden')).map(l => l.getAttribute('href')) });
record('hashes-do-codigo', { arquivos: Object.entries(sources).map(([arquivo, source]) => ({ arquivo, sha256: crypto.createHash('sha256').update(source).digest('hex') })) });
fs.writeFileSync(path.join(__dirname, 'evidencias.json'), JSON.stringify(evidence, null, 2) + '\n');
console.log(JSON.stringify(evidence, null, 2));
