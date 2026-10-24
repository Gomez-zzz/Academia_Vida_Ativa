const fs=require('node:fs');const path=require('node:path');const vm=require('node:vm');const assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),source=fs.readFileSync(path.join(root,'assets/demo.js'),'utf8');
const FIXED='2026-10-08T15:00:00.000Z';
function fixedDate(value=FIXED){return class extends Date{constructor(...args){super(...(args.length?args:[value]));}static now(){return new Date(value).getTime();}};}
function model(storage=new Map()){const events=[],sandbox={Date:fixedDate(),structuredClone,Event:class{constructor(type){this.type=type;}},localStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v)},dispatchEvent:e=>events.push(e),console:{log(){throw new Error('Dados não devem ser registrados no console.');}}};sandbox.window=sandbox;sandbox.parent=sandbox;vm.createContext(sandbox);vm.runInContext(source,sandbox,{filename:'assets/demo.js'});return{D:sandbox.Demo,sandbox,storage};}
function attributes(value){const result={};for(const m of value.matchAll(/([\w-]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g))result[m[1]]=m[2]??m[3]??m[4]??'';return result;}
class Node{
 constructor(tag,attrs={}){this.tag=tag;this.id=attrs.id||'';this.attributes=attrs;this.nodeType=1;this._value=attrs.value||'';this.defaultValue=this._value;this.children=[];this._text='';this.events={};this.hidden=Object.hasOwn(attrs,'hidden');this.disabled=Object.hasOwn(attrs,'disabled');this.className=attrs.class||'';this.files=[];this.validationMessage='';this.style={};this.classList={contains:name=>this.className.split(/\s+/).includes(name),add:(...names)=>{this.className=[...new Set(this.className.split(/\s+/).concat(names))].join(' ');},remove:(...names)=>{this.className=this.className.split(/\s+/).filter(n=>!names.includes(n)).join(' ');},toggle:(name,on)=>{const enabled=on??!this.classList.contains(name);enabled?this.classList.add(name):this.classList.remove(name);return enabled;}};}
 get value(){return this._value;}set value(v){this._value=String(v);}
 get textContent(){return this._text+this.children.map(n=>n.textContent||'').join('');}set textContent(v){this._text=String(v);this.children=[];}
 append(...nodes){for(const n of nodes){if(this.tag==='select'&&!this.children.length)this.value=n.value;this.children.push(n);n.parentElement=this;}}
 appendChild(node){this.append(node);}replaceChildren(...nodes){this.children=[];this._text='';if(this.tag==='select')this.value='';this.append(...nodes);}
 setAttribute(name,value){this.attributes[name]=String(value);}getAttribute(name){return this.attributes[name]??null;}removeAttribute(name){delete this.attributes[name];}
 addEventListener(name,fn){(this.events[name]??=[]).push(fn);}async fire(name,props={}){const pending=[];for(const fn of this.events[name]||[])pending.push(fn({target:this,preventDefault(){},...props}));if(this.form&&['input','change'].includes(name))pending.push(this.form.fire(name,{target:this,...props}));await Promise.all(pending);}
 click(){return this.fire('click');}focus(){this.focused=true;}scrollIntoView(options){this.scrollOptions=options;}setCustomValidity(value){this.validationMessage=value;}reportValidity(){return !this.validationMessage;}showModal(){this.open=true;}close(){this.open=false;}
 querySelector(selector){if(selector==='span:last-child')return this.labelNode;return null;}
}
function page(file,storage=new Map()){
 const html=fs.readFileSync(path.join(root,file),'utf8').replace(/<!--[\s\S]*?-->/g,''),nodes={},all=[],timeouts=[],intervals=[],links=[];
 for(const m of html.matchAll(/<([a-z][\w-]*)\b([^>]*)>/gi)){const attrs=attributes(m[2]),n=new Node(m[1],attrs);all.push(n);if(attrs.id)nodes[attrs.id]=n;}
 for(const m of html.matchAll(/<select\b([^>]*)>([\s\S]*?)<\/select>/gi)){const attrs=attributes(m[1]),n=nodes[attrs.id];if(!n)continue;const list=[...m[2].matchAll(/<option\b([^>]*)>([\s\S]*?)<\/option>/gi)];let selected;for(const item of list){const a=attributes(item[1]),option=new Node('option',a);option.value=a.value??item[2].trim();option.textContent=item[2].trim();n.append(option);if(Object.hasOwn(a,'selected'))selected=option.value;}n.value=selected??n.value;n.defaultValue=n.value;}
 if(file==='index.html')for(const m of html.matchAll(/<li\b([^>]*)>\s*<a\b([^>]*)>([\s\S]*?)<\/a>/g)){const n=new Node('a',attributes(m[2]));n.parentElement=new Node('li',attributes(m[1]));n.labelNode=new Node('span');n.labelNode.textContent=m[3].replace(/<[^>]*>/g,'').replace(/^\s*\d+\s*/,'').trim();links.push(n);}
 for(const m of html.matchAll(/<form\b([^>]*)>([\s\S]*?)<\/form>/g)){const form=nodes[attributes(m[1]).id];for(const id of [...m[2].matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]))if(nodes[id]&&['input','select','textarea'].includes(nodes[id].tag))nodes[id].form=form;}
 const document={getElementById:id=>nodes[id]||null,createElement:tag=>new Node(tag),querySelector:selector=>all.find(n=>n.className.split(/\s+/).includes(selector.slice(1)))||null,querySelectorAll:selector=>selector==='.nav-link'?links:[]};
 const {D,sandbox}=model(storage);sandbox.document=document;sandbox.confirm=()=>true;sandbox.setTimeout=fn=>timeouts.push(fn);sandbox.setInterval=fn=>intervals.push(fn);
 for(const node of all)if(node.tag==='form'){node.reset=()=>{for(const control of all)if(['input','select','textarea'].includes(control.tag)){control.value=control.defaultValue;control.validationMessage='';}node.fire('reset');};node.requestSubmit=()=>node.fire('submit');}
 if(nodes.conteudo){nodes.conteudo.contentWindow={demoDirty:false};nodes.conteudo.contentDocument={title:'Módulo'};}
 for(const m of html.matchAll(/<script\b[^>]*src="([^"]+)"/g)){if(m[1].includes('demo.js'))continue;const scriptPath=path.resolve(root,path.dirname(file),m[1]);vm.runInContext(fs.readFileSync(scriptPath,'utf8'),sandbox,{filename:path.relative(root,scriptPath)});}
 async function flush(){while(timeouts.length)await timeouts.shift()();}
 return{D:sandbox.Demo,nodes,links,sandbox,flush,html};
}
const cases=[];function test(name,fn){cases.push({name,fn});}const clone=v=>structuredClone(v);
test('Os 8 scripts da aplicação têm sintaxe válida',()=>{for(const p of ['assets/demo.js','main.js','modulos/mod01-cadastros/script.js','modulos/modulo 2/script.js','modulos/mod03-catraca/script.js','modulos/mod04-auditoria/script.js','modulos/Modulo 5/script.js','modulos/mod06-relatorios/script.js'])new vm.Script(fs.readFileSync(path.join(root,p),'utf8'),{filename:p});});
test('Datas usam o último dia do mês sem transbordar',()=>{const{D}=model();assert.equal(D.addMonths('2026-01-31',1),'2026-02-28');assert.equal(D.addMonths('2024-02-29',12),'2025-02-28');assert.equal(D.addMonths('2026-03-31',3),'2026-06-30');assert.equal(D.addMonths('2026-12-31',1),'2027-01-31');assert.equal(D.addDays('2026-10-08',60),'2026-12-07');assert.equal(D.daysBetween('2026-01-31','2026-02-28'),28);assert.equal(D.date('2026-02-30'),null);});
test('CPF, telefones e datas de nascimento são validados',()=>{const{D}=model();assert.equal(D.validCpf('529.982.247-25'),true);assert.equal(D.validCpf('00000000000'),false);assert.equal(D.validCpf('abc'),false);const s={...D.getState().students[0],id:'4444',cpf:'12345678909',phone:'abc'},c={planId:'mensal',start:D.today(),due:D.addMonths(D.today(),1),state:'Ativo'};assert.throws(()=>D.upsertStudent(s),/telefones/);s.phone='11999991111';s.birth='2099-01-01';assert.throws(()=>D.upsertStudent(s),/nascimento/);});
test('Não é possível cadastrar CPF duplicado',()=>{const{D}=model(),s={...D.getState().students[0],id:'4444'};assert.throws(()=>D.upsertStudent(s),/CPF/);assert.equal(D.getState().students.length,3);});
test('Cadastro conserva foto e valores ao recarregar o estado',()=>{const storage=new Map(),{D}=model(storage),s={...D.getState().students[0],id:'4444',name:'Aluno Teste',cpf:'12345678909',photo:'data:image/png;base64,AAAA'};D.upsertStudent(s);const other=model(storage).D;assert.equal(other.getState().students.find(s=>s.id==='4444').photo,s.photo);assert.equal(other.getState().students.length,4);assert.equal(other.contract(other.getState(),'4444'),undefined);assert.equal(other.getState().payments.length,3);});
test('Suspensão é preservada ao editar e conserva saldo na reativação',()=>{const{D,sandbox}=model();D.changeStatus('1111','Suspenso');const state=D.getState(),s=state.students[0],c=D.contract(state,s.id);assert.equal(c.suspendedDays,20);D.upsertStudent(s);assert.equal(D.contract(D.getState(),'1111').state,'Suspenso');sandbox.Date=fixedDate('2026-10-13T15:00:00.000Z');D.changeStatus('1111','Ativo');assert.equal(D.contract(D.getState(),'1111').due,'2026-11-02');});
test('Catraca distingue em dia, tolerância, bloqueio e matrícula inexistente',()=>{const{D}=model(),s=D.getState();assert.equal(D.access(s,'1111').tone,'ok');assert.equal(D.access(s,'2222').tone,'warn');assert.equal(D.access(s,'2222').allowed,true);assert.equal(D.access(s,'3333').allowed,false);assert.equal(D.access(s,'9999').allowed,false);D.changeStatus('1111','Suspenso');assert.equal(D.access(D.getState(),'1111').allowed,false);});
test('Atualização financeira muda indicadores e a decisão de acesso',()=>{const{D}=model();D.saveFinance({studentId:'3333',planId:'mensal',start:D.today(),due:D.addMonths(D.today(),1),tolerance:5,method:'PIX',status:'Pago',paidDate:D.today()});const state=D.getState();assert.equal(D.access(state,'3333').allowed,true);assert.equal(state.payments.filter(p=>p.status!=='Pago').length,1);assert.equal(state.payments.find(p=>p.contractId==='c-3333').amount,12000);assert.equal(state.contracts.find(c=>c.id==='c-3333').start,D.today());});
test('Datas financeiras incoerentes não alteram o estado',()=>{const{D}=model(),before=JSON.stringify(D.getState());assert.throws(()=>D.saveFinance({studentId:'1111',planId:'mensal',start:'2026-10-08',due:'2026-01-01',tolerance:5,status:'Pago',paidDate:D.today(),method:'PIX'}),/vencimento/);assert.equal(JSON.stringify(D.getState()),before);});
test('Avaliação conserva altura, aceita gordura zero e calcula reavaliação',()=>{const{D}=model();D.saveEvaluation({studentId:'1111',date:D.today(),weight:74.5,height:175,fat:0,objective:'Outro',interval:60});const saved=D.getState().evaluations[0];assert.equal(saved.height,175);assert.equal(saved.fat,0);assert.equal(saved.next,'2026-12-07');});
test('Avaliação recusa peso negativo, percentual inválido e aluno desconhecido',()=>{const{D}=model(),value={studentId:'1111',date:D.today(),weight:70,height:null,fat:null,objective:'Outro',interval:30};assert.throws(()=>D.saveEvaluation({...value,weight:-5}),/peso/);assert.throws(()=>D.saveEvaluation({...value,fat:120}),/gordura/);assert.throws(()=>D.saveEvaluation({...value,studentId:'9999'}),/aluno/);});
test('Liberação excepcional funciona uma vez e registra autoria e uso',()=>{const{D}=model();D.authorize({studentId:'3333',type:'entrada',minutes:30,reason:'Autorização de teste'});const first=D.registerAccess('3333'),second=D.registerAccess('3333');assert.equal(first.allowed,true);assert.equal(second.allowed,false);const a=D.getState().authorizations[0];assert.ok(a.usedAt);assert.match(a.actor,/Administração/);assert.equal(D.getState().accesses.length,10);});
test('Liberação vencida, área restrita e justificativa vazia não abrem entrada',()=>{const{D,sandbox}=model();assert.throws(()=>D.authorize({studentId:'3333',type:'entrada',minutes:30,reason:'  '}),/justificativa/);D.authorize({studentId:'3333',type:'restrita',minutes:30,reason:'Autorização restrita'});assert.equal(D.access(D.getState(),'3333').allowed,false);D.authorize({studentId:'3333',type:'entrada',minutes:15,reason:'Autorização temporária'});sandbox.Date=fixedDate('2026-10-08T15:16:00.000Z');assert.equal(D.access(D.getState(),'3333').allowed,false);});
test('Histórico conserva mais de cinco acessos',()=>{const{D}=model();for(let i=0;i<12;i++)D.registerAccess('1111');assert.equal(D.getState().accesses.length,20);});
test('Relatório combina período e situação e exclui acessos bloqueados',()=>{const{D}=model();const filters={from:'2026-10-01',to:D.today(),status:'todos'};assert.equal(D.report(D.getState(),filters).reduce((sum,row)=>sum+row.count,0),8);D.registerAccess('3333');assert.equal(D.report(D.getState(),filters).reduce((sum,row)=>sum+row.count,0),8);assert.equal(D.report(D.getState(),{...filters,status:'Ativo'}).length,1);assert.equal(D.report(D.getState(),{from:'2099-01-01',to:'2099-01-02',status:'todos'}).length,0);assert.throws(()=>D.report(D.getState(),{from:'2026-10-08',to:'2026-10-01',status:'todos'}),/período/);});
test('Falha de espaço não confirma nem modifica uma gravação',()=>{const{D,sandbox}=model();D.saveState(D.getState());const before=JSON.stringify(D.getState());sandbox.localStorage.setItem=()=>{const error=new Error('Sem espaço');error.name='QuotaExceededError';throw error;};assert.throws(()=>D.changeStatus('1111','Suspenso'),/espaço/);assert.equal(JSON.stringify(D.getState()),before);});
test('Sem localStorage disponível, a prévia continua em memória',()=>{const{D,sandbox}=model();sandbox.localStorage.getItem=()=>{throw new Error('Bloqueado');};sandbox.localStorage.setItem=()=>{throw new Error('Bloqueado');};D.changeStatus('1111','Suspenso');assert.equal(D.contract(D.getState(),'1111').state,'Suspenso');});
test('Os seis controladores inicializam com o HTML correspondente',()=>{for(const p of ['mod01-cadastros','modulo 2','mod03-catraca','mod04-auditoria','Modulo 5','mod06-relatorios'])assert.doesNotThrow(()=>page('modulos/'+p+'/index.html'),p);});
test('Administração exibe cinco módulos e Portaria somente a catraca',async()=>{const p=page('index.html');assert.equal(p.links.length,6);assert.equal(p.links.filter(l=>!l.parentElement.hidden).length,5);p.nodes.perfil.value='portaria';await p.nodes.perfil.fire('change');assert.equal(p.links.filter(l=>!l.parentElement.hidden).length,1);assert.match(p.nodes.conteudo.src,/mod03-catraca/);});
test('Limpar avaliação atualiza também a previsão',async()=>{const p=page('modulos/Modulo 5/index.html');p.nodes.intervalo.value='60';await p.nodes.intervalo.fire('change');assert.equal(p.nodes.proxima.textContent,'07/12/2026');p.nodes.formAvaliacao.reset();await p.flush();assert.equal(p.nodes.intervalo.value,'30');assert.equal(p.nodes.proxima.textContent,'07/11/2026');});
test('Financeiro e avaliação exibem nome com HTML como texto',async()=>{const storage=new Map(),{D}=model(storage);D.transaction(state=>{state.students[0].name='<b>Aluno Teste</b>';});const f=page('modulos/modulo 2/index.html',storage);assert.match(f.nodes.tabelaDados.textContent,/<b>Aluno Teste<\/b>/);const a=page('modulos/Modulo 5/index.html',storage);assert.match(a.nodes.historico.textContent,/<b>Aluno Teste<\/b>/);for(const p of [f,a])assert.equal(p.nodes[p===f?'tabelaDados':'historico'].children.some(row=>row.children.some(cell=>cell.children.some(child=>child.tag==='b'))),false);});
test('Ações da catraca e relatório renderizam estados coerentes',async()=>{const storage=new Map(),p=page('modulos/mod03-catraca/index.html',storage);p.nodes.matricula.value='3333';await p.nodes.formCatraca.fire('submit');assert.equal(p.nodes['status-title'].textContent,'Acesso bloqueado');assert.equal(p.nodes.exemplos.children.length,3);const r=page('modulos/mod06-relatorios/index.html',storage);r.nodes.dataInicio.value='2099-01-01';r.nodes.dataFim.value='2099-01-02';await r.nodes.formRelatorio.fire('submit');assert.equal(r.nodes['total-acessos'].textContent,'0');assert.match(r.nodes.tabelaCorpo.textContent,/Nenhum acesso/);});
test('Páginas têm viewport, labels associados e recursos locais existentes',()=>{for(const p of ['index.html','modulos/mod01-cadastros/index.html','modulos/modulo 2/index.html','modulos/mod03-catraca/index.html','modulos/mod04-auditoria/index.html','modulos/Modulo 5/index.html','modulos/mod06-relatorios/index.html']){const html=fs.readFileSync(path.join(root,p),'utf8');assert.match(html,/name="viewport"/);const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);assert.equal(new Set(ids).size,ids.length,p);assert.doesNotMatch(html,/href="#"/);for(const m of html.matchAll(/<label\b([^>]*)>/g)){const attrs=attributes(m[1]);assert.ok(attrs.for&&ids.includes(attrs.for),p+': label sem associação');}for(const m of html.matchAll(/<(?:a|link|iframe|script)\b([^>]*)>/g)){const at=attributes(m[1]),url=at.href??at.src;if(!url||url.startsWith('#'))continue;assert.ok(fs.existsSync(path.resolve(root,path.dirname(p),decodeURIComponent(url))),p+' -> '+url);}}});
test('Renderizadores não inserem entradas em innerHTML nem registram dados no console',()=>{for(const p of ['assets/demo.js','modulos/mod01-cadastros/script.js','modulos/modulo 2/script.js','modulos/mod03-catraca/script.js','modulos/mod04-auditoria/script.js','modulos/Modulo 5/script.js','modulos/mod06-relatorios/script.js'])assert.doesNotMatch(fs.readFileSync(path.join(root,p),'utf8'),/\.innerHTML\s*=|insertAdjacentHTML|console\.log/);});
test('Estilos compactos preservam rótulos e os módulos compartilham os componentes',()=>{const css=fs.readFileSync(path.join(root,'style.css'),'utf8');assert.match(css,/@media\(max-width:760px\)/);assert.doesNotMatch(css,/\.nav__label[^}]*display:\s*none/);for(const p of ['mod01-cadastros','modulo 2','mod03-catraca','mod04-auditoria','Modulo 5','mod06-relatorios'])assert.match(fs.readFileSync(path.join(root,'modulos',p,'style.css'),'utf8'),/assets\/app\.css/);assert.match(fs.readFileSync(path.join(root,'assets/app.css'),'utf8'),/prefers-reduced-motion/);});
test('Contrato com início futuro aguarda a vigência',()=>{const{D}=model();D.saveFinance({studentId:'1111',planId:'mensal',start:'2026-10-09',due:'2026-11-09',tolerance:5,method:'PIX',status:'Pago',paidDate:D.today()});assert.equal(D.access(D.getState(),'1111').allowed,false);assert.equal(D.access(D.getState(),'1111').title,'Contrato ainda não iniciado');});
test('Troca de aluno no financeiro preserva alterações quando cancelada',async()=>{const p=page('modulos/modulo 2/index.html');p.nodes.aluno.value='1111';await p.nodes.aluno.fire('change');p.nodes.tolerancia.value='7';await p.nodes.tolerancia.fire('input');p.sandbox.confirm=()=>false;p.nodes.aluno.value='2222';await p.nodes.aluno.fire('change');assert.equal(p.nodes.aluno.value,'1111');assert.equal(p.nodes.tolerancia.value,'7');assert.equal(p.sandbox.demoDirty,true);});
test('Avaliação apresenta as métricas no formato brasileiro',()=>{const p=page('modulos/Modulo 5/index.html');assert.match(p.nodes.historico.textContent,/74,5 kg/);assert.match(p.nodes.historico.textContent,/18,2%/);});

test('Editar dados pessoais preserva integralmente contratos e pagamentos',()=>{
 const{D}=model();D.changeStatus('1111','Suspenso');const before=D.getState(),student={...before.students[0],name:'Lucas Atualizado'};
 D.upsertStudent(student);const after=D.getState();assert.deepEqual(after.contracts,before.contracts);assert.deepEqual(after.payments,before.payments);assert.equal(after.students[0].name,'Lucas Atualizado');
});
test('Cadastro salva aluno sem contrato e mantém o formulário aberto',async()=>{
 const p=page('modulos/mod01-cadastros/index.html'),student={...p.D.getState().students[0],cpf:'12345678909',name:'Aluno Novo'};
 const fields={nome:student.name,cpf:student.cpf,dataNascimento:student.birth,telefone:student.phone,endereco:student.address,nomeEmergencia:student.emergencyName,telEmergencia:student.emergencyPhone,restricoes:student.health,anotacoes:student.notes};
 for(const[id,value]of Object.entries(fields))p.nodes[id].value=value;await p.nodes.formCadastro.fire('submit');
 assert.equal(p.D.getState().students.length,4);assert.equal(p.D.getState().contracts.length,3);assert.equal(p.D.getState().payments.length,3);
 assert.equal(p.nodes.selecionarAluno.value,'3334');assert.equal(p.nodes.nome.value,'Aluno Novo');assert.match(p.nodes.feedback.textContent,/Cadastro salvo/);
 assert.equal(p.nodes.plano,undefined);assert.equal(p.nodes.suspender,undefined);assert.match(p.nodes['lista-alunos'].textContent,/123\.456\.789-09/);
});
test('Aluno sem contrato só recebe contrato e cobrança ao salvar no Financeiro',async()=>{
 const storage=new Map(),{D}=model(storage);D.upsertStudent({...D.getState().students[0],id:'4444',cpf:'12345678909'});
 const p=page('modulos/modulo 2/index.html',storage);p.nodes.aluno.value='4444';await p.nodes.aluno.fire('change');
 assert.match(p.nodes['contract-hint'].textContent,/não possui contrato/);assert.equal(p.nodes.suspender.disabled,true);assert.equal(D.getState().contracts.length,3);
 p.nodes.status.value='Pago';await p.nodes.status.fire('change');await p.nodes.formFinanceiro.fire('submit');
 const state=D.getState();assert.equal(state.contracts.length,4);assert.equal(state.payments.length,4);assert.equal(D.access(state,'4444').allowed,true);
 assert.match(p.nodes.tabelaDados.textContent,/Ativo/);assert.match(p.nodes.tabelaDados.textContent,/Pago/);
});
test('Suspender e reativar pelo Financeiro preserva pagamento e saldo',async()=>{
 const p=page('modulos/modulo 2/index.html');p.nodes.aluno.value='1111';await p.nodes.aluno.fire('change');const before=clone(p.D.getState().payments);
 await p.nodes.suspender.fire('click');assert.equal(p.D.contract(p.D.getState(),'1111').state,'Suspenso');assert.equal(p.D.access(p.D.getState(),'1111').allowed,false);assert.deepEqual(p.D.getState().payments,before);
 p.sandbox.Date=fixedDate('2026-10-13T15:00:00.000Z');await p.nodes.suspender.fire('click');
 assert.equal(p.D.contract(p.D.getState(),'1111').due,'2026-11-02');assert.equal(p.D.access(p.D.getState(),'1111').allowed,true);assert.deepEqual(p.D.getState().payments,before);
});
test('Salvar situação contratual no Financeiro respeita suspensão e reativação',()=>{
 const{D,sandbox}=model();const values={studentId:'1111',planId:'mensal',start:'2026-09-28',due:'2026-10-28',tolerance:5,method:'PIX',status:'Pago',paidDate:'2026-09-28'};
 D.saveFinance({...values,state:'Suspenso'});assert.equal(D.contract(D.getState(),'1111').suspendedDays,20);
 sandbox.Date=fixedDate('2026-10-13T15:00:00.000Z');D.saveFinance({...values,state:'Ativo'});assert.equal(D.contract(D.getState(),'1111').due,'2026-11-02');
 D.saveFinance({...values,state:'Cancelado'});assert.equal(D.access(D.getState(),'1111').allowed,false);
 const before=JSON.stringify(D.getState());assert.throws(()=>D.saveFinance({...values,state:'Inválido'}),/Situação/);assert.equal(JSON.stringify(D.getState()),before);
});
test('Aluno sem contrato é bloqueado e pode receber liberação excepcional',()=>{
 const{D}=model();D.upsertStudent({...D.getState().students[0],id:'4444',cpf:'12345678909'});assert.equal(D.access(D.getState(),'4444').title,'Sem contrato');
 D.authorize({studentId:'4444',type:'entrada',minutes:30,reason:'Entrada autorizada para teste'});assert.equal(D.registerAccess('4444').allowed,true);assert.equal(D.registerAccess('4444').allowed,false);
});
test('Preferência antiga da catraca na Administração recupera Cadastros',()=>{
 const storage=new Map([['perfilAtivo','admin'],['moduloAtivo','modulos/mod03-catraca/index.html']]),p=page('index.html',storage);
 assert.match(p.nodes.conteudo.src,/mod01-cadastros/);assert.equal(p.links.find(l=>l.getAttribute('href').includes('mod03-catraca')).parentElement.hidden,true);
 assert.equal(p.nodes['workspace-name'].textContent,'Administração');assert.equal(p.links.filter(l=>l.attributes['aria-current']==='page').length,1);
});
test('Interface não contém números de abas, avisos acadêmicos ou controles de restauração',()=>{
 const p=page('index.html');assert.equal(p.nodes.restaurar,undefined);assert.equal(p.nodes['reset-dialog'],undefined);assert.doesNotMatch(p.html,/nav-number|Prévia interativa|Projeto APS|Visualizar como/);
 for(const file of ['index.html',...['mod01-cadastros','modulo 2','mod03-catraca','mod04-auditoria','Modulo 5','mod06-relatorios'].map(m=>'modulos/'+m+'/index.html')])assert.doesNotMatch(fs.readFileSync(path.join(root,file),'utf8'),/demonstração|demonstrativa|nesta prévia|simule|simulação/i);
 assert.doesNotMatch(fs.readFileSync(path.join(root,'style.css'),'utf8'),/nav-number|preview-bar/);
 for(const module of ['mod01-cadastros','modulo 2','mod03-catraca','mod04-auditoria','Modulo 5','mod06-relatorios'])assert.doesNotMatch(fs.readFileSync(path.join(root,'modulos',module,'script.js'),'utf8'),/na demonstração|nesta prévia|Simular acesso|simulação/);
});
test('Restauração permanece disponível na função de apoio',()=>{const{D}=model();D.upsertStudent({...D.getState().students[0],id:'4444',cpf:'12345678909'});D.reset();assert.equal(D.getState().students.length,3);assert.equal(D.getState().contracts.length,3);});

function theme(){const css=fs.readFileSync(path.join(root,'assets/app.css'),'utf8'),block=css.match(/:root\s*\{([^}]+)\}/)[1];return{css,block,tokens:Object.fromEntries([...block.matchAll(/(--[\w-]+)\s*:\s*(#[\da-f]{6})\s*;/gi)].map(m=>[m[1],m[2]]))};}
function contrast(a,b){const luminance=hex=>{const rgb=hex.slice(1).match(/../g).map(v=>parseInt(v,16)/255).map(v=>v<=0.04045?v/12.92:((v+0.055)/1.055)**2.4);return rgb[0]*0.2126+rgb[1]*0.7152+rgb[2]*0.0722;};const x=luminance(a),y=luminance(b);return(Math.max(x,y)+0.05)/(Math.min(x,y)+0.05);}
test('Tema mantém contraste de texto, placeholders, ações e estados operacionais',()=>{
 const{tokens:t}=theme(),pairs=[];
 for(const text of ['--text','--muted','--accent'])for(const surface of ['--bg','--surface','--surface-soft','--accent-soft'])pairs.push([text,surface]);
 pairs.push(['--placeholder','--surface'],['--on-accent','--accent'],['--on-accent','--accent-hover'],['--muted','--disabled-bg']);
 for(const state of ['green','yellow','red'])pairs.push(['--'+state,'--'+state+'-soft'],['--text','--'+state+'-soft'],['--muted','--'+state+'-soft']);
 for(const[a,b]of pairs)assert.ok(contrast(t[a],t[b])>=4.5,a+' / '+b+': contraste abaixo de 4,5:1');
});
test('Bordas dos campos, foco e indicadores têm contraste mínimo de 3:1',()=>{
 const{tokens:t}=theme();
 for(const surface of ['--bg','--surface','--surface-soft'])assert.ok(contrast(t['--control-border'],t[surface])>=3,'--control-border / '+surface);
 for(const surface of ['--bg','--surface','--surface-soft','--accent-soft'])assert.ok(contrast(t['--accent'],t[surface])>=3,'--accent / '+surface);
 for(const state of ['green','yellow','red'])assert.ok(contrast(t['--'+state],t['--'+state+'-soft'])>=3,state);
});
test('Tema grafite usa cores centralizadas, sem branco puro, em todos os módulos',()=>{
 const{css,block}=theme(),shell=fs.readFileSync(path.join(root,'style.css'),'utf8'),definitions=new Set([...block.matchAll(/(--[\w-]+)\s*:/g)].map(m=>m[1]));
 assert.match(block,/color-scheme:\s*dark/);assert.doesNotMatch(block,/#(?:FFFFFF|FFF)\b/gi);assert.doesNotMatch(css.replace(/:root\s*\{[^}]+\}/,''),/#[\da-f]{3,8}\b/gi);assert.doesNotMatch(shell,/#[\da-f]{3,8}\b/gi);
 for(const stylesheet of [css,shell])for(const m of stylesheet.matchAll(/var\((--[\w-]+)\)/g))assert.ok(definitions.has(m[1]),'Variável não declarada: '+m[1]);
 const html=fs.readFileSync(path.join(root,'index.html'),'utf8');assert.match(html,/name="theme-color" content="#28323E"/);assert.match(html,/<svg[^>]+viewBox="0 0 24 24"/);assert.doesNotMatch(html,/⚡/);
 for(const module of ['mod01-cadastros','modulo 2','mod03-catraca','mod04-auditoria','Modulo 5','mod06-relatorios']){const local=fs.readFileSync(path.join(root,'modulos',module,'style.css'),'utf8');assert.doesNotMatch(local,/color-scheme:\s*(?:dark|light)|#[\da-f]{3,8}\b/gi);}
});


function financeRows(p){return p.nodes.tabelaDados.children.filter(n=>n.className==='record-row');}
function descendants(node){return node.children.flatMap(child=>[child,...descendants(child)]);}
function financeAction(p,id,key){const row=financeRows(p).find(n=>n.getAttribute('data-student-id')===id);return descendants(row).find(n=>n.getAttribute('data-action')===key);}
test('Financeiro inicia com consulta e abre a operação escolhida sem gravar',async()=>{
 const p=page('modulos/modulo 2/index.html'),before=JSON.stringify(p.D.getState());
 assert.equal(p.nodes['painel-operacao'].hidden,true);assert.equal(financeRows(p).length,3);
 await financeAction(p,'1111','edit').fire('click');
 assert.equal(p.nodes['painel-operacao'].hidden,false);assert.equal(p.nodes.aluno.disabled,true);
 assert.equal(p.nodes['operation-title'].textContent,'Editar contrato e pagamento');
 assert.equal(JSON.stringify(p.D.getState()),before);
 await p.nodes['fechar-operacao'].fire('click');
 assert.equal(p.nodes['painel-operacao'].hidden,true);assert.equal(financeAction(p,'1111','edit').focused,true);
});
test('Busca financeira ignora acentos e combina contrato, pagamento e vencimento',async()=>{
 const storage=new Map(),{D}=model(storage);D.transaction(s=>{s.students[0].name='Lúcas Ándrade';});
 const p=page('modulos/modulo 2/index.html',storage);
 p.nodes.busca.value='LUCAS';await p.nodes.busca.fire('input');assert.equal(financeRows(p).length,1);
 p.nodes['filtro-contrato'].value='Vigente';p.nodes['filtro-pagamento'].value='Pago';
 p.nodes['vencimento-de'].value='2026-10-28';p.nodes['vencimento-ate'].value='2026-10-28';await p.nodes['vencimento-ate'].fire('change');
 assert.equal(financeRows(p).length,1);
 p.nodes['filtro-pagamento'].value='Atrasado';await p.nodes['filtro-pagamento'].fire('change');assert.equal(financeRows(p).length,0);
 assert.match(p.nodes.tabelaDados.textContent,/Nenhum aluno/);
 await p.nodes['limpar-filtros'].fire('click');assert.equal(financeRows(p).length,3);assert.equal(p.nodes['limpar-filtros'].hidden,true);
 p.nodes.busca.value='2222';await p.nodes.busca.fire('input');assert.equal(financeRows(p)[0].getAttribute('data-student-id'),'2222');
});
test('Intervalo de filtro inválido tem orientação e não lista resultados enganosos',async()=>{
 const p=page('modulos/modulo 2/index.html');
 p.nodes['vencimento-de'].value='2026-11-01';p.nodes['vencimento-ate'].value='2026-10-01';await p.nodes['vencimento-ate'].fire('change');
 assert.equal(financeRows(p).length,0);assert.match(p.nodes['filtro-erro'].textContent,/intervalo válido/);
 assert.equal(p.nodes['vencimento-ate'].getAttribute('aria-invalid'),'true');
 await p.nodes['limpar-filtros'].fire('click');assert.equal(p.nodes['filtro-erro'].textContent,'');
});
test('Indicadores aplicam filtros explícitos e preservam seus totais gerais',async()=>{
 const p=page('modulos/modulo 2/index.html');
 await p.nodes['filtrar-vigentes'].fire('click');assert.equal(financeRows(p).length,1);assert.equal(p.nodes['filtro-contrato'].value,'Vigente');
 await p.nodes['filtrar-abertos'].fire('click');assert.equal(financeRows(p).length,2);
 assert.equal(p.nodes['filtro-contrato'].value,'todos');assert.equal(p.nodes['filtrar-abertos'].getAttribute('aria-pressed'),'true');
 assert.equal(p.nodes['contratos-ativos'].textContent,'1');assert.equal(p.nodes['pagamentos-pendentes'].textContent,'2');
});
test('Consulta inclui alunos sem contrato e respeita atualização e ordem alfabética',async()=>{
 const storage=new Map(),{D}=model(storage);
 D.transaction(s=>{
  s.students.push({...s.students[0],id:'4444',name:'Zélia Sem contrato'},{...s.students[0],id:'5555',name:'Ana Sem contrato'});
  s.payments[2].updatedAt='2026-10-09T12:00:00Z';
 });
 const p=page('modulos/modulo 2/index.html',storage);
 assert.deepEqual(financeRows(p).map(r=>r.getAttribute('data-student-id')),['3333','1111','2222','5555','4444']);
 p.nodes['filtro-contrato'].value='Sem contrato';await p.nodes['filtro-contrato'].fire('change');assert.equal(financeRows(p).length,2);
 await financeAction(p,'5555','new').fire('click');
 assert.equal(p.nodes.aluno.value,'5555');assert.equal(p.nodes['student-fieldset'].hidden,false);
 assert.deepEqual(p.nodes.aluno.children.map(n=>n.value),['','4444','5555']);
 assert.equal(p.D.getState().contracts.length,3);
});
test('Vigência futura, suspensão e cancelamento aparecem de forma distinta',()=>{
 const storage=new Map(),{D}=model(storage);
 D.transaction(s=>{s.contracts[0].start='2026-10-09';s.contracts[1].state='Suspenso';s.contracts[2].state='Cancelado';});
 const p=page('modulos/modulo 2/index.html',storage);
 assert.match(financeRows(p)[0].textContent,/A iniciar/);assert.match(financeRows(p)[1].textContent,/Suspenso/);assert.match(financeRows(p)[2].textContent,/Cancelado/);
 assert.equal(p.nodes['contratos-ativos'].textContent,'0');assert.equal(financeAction(p,'3333','manage'),undefined);
});
test('Detalhes expandem sem gravar e mantêm os dados secundários',async()=>{
 const p=page('modulos/modulo 2/index.html'),before=JSON.stringify(p.D.getState()),button=financeAction(p,'1111','details');
 await button.fire('click');assert.equal(button.getAttribute('aria-expanded'),'true');
 const detail=p.nodes.tabelaDados.children.find(r=>r.id==='detalhes-1111');
 assert.equal(detail.hidden,false);assert.match(detail.textContent,/Situação administrativaAtivo/);assert.match(detail.textContent,/Quitação/);
 await button.fire('click');assert.equal(detail.hidden,true);assert.equal(JSON.stringify(p.D.getState()),before);
});
test('Pagamento isolado preserva contratos, valor e demais cobranças',()=>{
 const{D}=model();D.changeStatus('1111','Suspenso');const before=clone(D.getState());
 D.savePayment({studentId:'1111',method:'Cartão',status:'Pago',paidDate:'2026-10-07'});
 const after=D.getState(),old=before.payments.find(p=>p.contractId==='c-1111'),payment=after.payments.find(p=>p.id===old.id);
 assert.deepEqual(after.contracts,before.contracts);assert.equal(payment.amount,old.amount);assert.equal(payment.contractId,old.contractId);
 assert.equal(payment.method,'Cartão');assert.equal(payment.paidDate,'2026-10-07');
 assert.deepEqual(after.payments.filter(p=>p.id!==old.id),before.payments.filter(p=>p.id!==old.id));
});
test('Pagamento isolado rejeita dados inválidos e ausência de cobrança sem gravação parcial',()=>{
 const{D}=model();D.transaction(s=>{s.students.push({...s.students[0],id:'4444'});});
 const valid={studentId:'1111',method:'PIX',status:'Pago',paidDate:D.today()},before=JSON.stringify(D.getState());
 for(const values of [{...valid,paidDate:'2099-01-01'},{...valid,method:'Inválido'},{...valid,status:'Inválido'},{...valid,status:'Atrasado'},{...valid,studentId:'4444'},{...valid,studentId:'9999'}]){
  assert.throws(()=>D.savePayment(values));assert.equal(JSON.stringify(D.getState()),before);
 }
});
test('Tela de pagamento altera apenas a cobrança e classifica atraso automaticamente',async()=>{
 const p=page('modulos/modulo 2/index.html'),before=clone(p.D.getState());
 await financeAction(p,'3333','payment').fire('click');
 assert.equal(p.nodes['contract-fields'].hidden,true);assert.equal(p.nodes['operation-title'].textContent,'Registrar pagamento');
 p.nodes.pagamento.value='Boleto';await p.nodes.pagamento.fire('change');await p.nodes.formFinanceiro.fire('submit');
 assert.deepEqual(p.D.getState().contracts,before.contracts);
 assert.equal(p.D.payment(p.D.getState(),'c-3333').status,'Atrasado');
 p.nodes.status.value='Pago';await p.nodes.status.fire('change');p.nodes.dataPagamento.value='2026-10-08';await p.nodes.formFinanceiro.fire('submit');
 assert.equal(p.D.payment(p.D.getState(),'c-3333').status,'Pago');assert.deepEqual(p.D.getState().contracts,before.contracts);
 assert.match(p.nodes.feedback.textContent,/Pagamento salvo/);
});
test('Edição destaca mudanças no resumo e abre ajustes que contêm erros',async()=>{
 const p=page('modulos/modulo 2/index.html');await financeAction(p,'1111','edit').fire('click');
 const before=JSON.stringify(p.D.getState());p.nodes.tolerancia.value='7';await p.nodes.tolerancia.fire('input');
 assert.match(p.nodes['resumo-operacao'].textContent,/7 dia\(s\)Antes: 5 dia\(s\)/);
 p.nodes.tolerancia.value='31';await p.nodes.formFinanceiro.fire('submit');
 assert.equal(p.nodes['ajustes-contrato'].open,true);assert.match(p.nodes['erro-tolerancia'].textContent,/0 a 30/);
 assert.equal(JSON.stringify(p.D.getState()),before);
 p.nodes.tolerancia.value='5';p.nodes.dataVencimento.value='2026-01-01';await p.nodes.formFinanceiro.fire('submit');
 assert.match(p.nodes['erro-dataVencimento'].textContent,/posterior/);
});
test('Trocar operação, fechar e descartar respeitam alterações pendentes',async()=>{
 const p=page('modulos/modulo 2/index.html');await financeAction(p,'1111','edit').fire('click');
 p.nodes.tolerancia.value='7';await p.nodes.tolerancia.fire('input');p.sandbox.confirm=()=>false;
 await financeAction(p,'2222','payment').fire('click');assert.equal(p.nodes.aluno.value,'1111');
 await p.nodes['fechar-operacao'].fire('click');assert.equal(p.nodes['painel-operacao'].hidden,false);
 await p.nodes['descartar-alteracoes'].fire('click');assert.equal(p.nodes.tolerancia.value,'7');
 p.sandbox.confirm=()=>true;await p.nodes['descartar-alteracoes'].fire('click');
 assert.equal(p.nodes.tolerancia.value,'5');assert.equal(p.sandbox.demoDirty,false);
});
test('Cancelamento da confirmação de suspensão não altera o estado',async()=>{
 const p=page('modulos/modulo 2/index.html'),before=JSON.stringify(p.D.getState());p.sandbox.confirm=()=>false;
 await financeAction(p,'1111','manage').fire('click');assert.equal(JSON.stringify(p.D.getState()),before);
});
test('Falha de armazenamento no pagamento mantém o formulário e não confirma sucesso',async()=>{
 const p=page('modulos/modulo 2/index.html');await financeAction(p,'2222','payment').fire('click');
 const before=JSON.stringify(p.D.getState());p.nodes.pagamento.value='Dinheiro';await p.nodes.pagamento.fire('change');
 p.sandbox.localStorage.setItem=()=>{const e=new Error('Sem espaço');e.name='QuotaExceededError';throw e;};
 await p.nodes.formFinanceiro.fire('submit');
 assert.equal(JSON.stringify(p.D.getState()),before);assert.equal(p.nodes.pagamento.value,'Dinheiro');assert.equal(p.sandbox.demoDirty,true);
 assert.match(p.nodes.feedback.textContent,/espaço/);assert.equal(p.nodes['salvar-financeiro'].disabled,false);
});
test('Novo contrato oferece plano mensal e só revela os campos após selecionar aluno',async()=>{
 const storage=new Map(),{D}=model(storage);D.transaction(s=>s.students.push({...s.students[0],id:'4444'}));
 const p=page('modulos/modulo 2/index.html',storage);await p.nodes['novo-contrato'].fire('click');
 assert.equal(p.nodes['contract-fields'].hidden,true);assert.equal(p.nodes['payment-fields'].hidden,true);
 p.nodes.aluno.value='4444';await p.nodes.aluno.fire('change');
 assert.equal(p.nodes['contract-fields'].hidden,false);assert.equal(p.nodes.status.value,'Pendente');
 const radios=descendants(p.nodes['plan-options']).filter(n=>n.type==='radio');
 assert.equal(radios.find(n=>n.value==='mensal').checked,true);
 const quarterly=radios.find(n=>n.value==='trimestral');quarterly.checked=true;await quarterly.fire('change');
 assert.equal(p.nodes.valor.textContent,p.D.money(32400));assert.equal(p.nodes.dataVencimento.value,'2027-01-08');
 assert.equal(p.D.getState().contracts.length,3);
 await p.nodes.formFinanceiro.fire('submit');assert.equal(p.D.contract(p.D.getState(),'4444').planId,'trimestral');
});

async function run(){const results=[];for(const entry of cases){try{await entry.fn();results.push({cenario:entry.name,passou:true});}catch(e){results.push({cenario:entry.name,passou:false,erro:e.stack});}}const report={data:'2026-10-23',metodo:'Regras locais reais em VM, inicialização de controladores em DOM mínimo, consistência do tema e cálculo de contraste das cores CSS; inspeção de navegador registrada separadamente.',total:results.length,aprovados:results.filter(r=>r.passou).length,resultados:results};fs.writeFileSync(path.join(root,'auditoria','TESTES-FRONTEND.json'),JSON.stringify(report,null,2)+'\n');return report;}
module.exports={run};if(require.main===module)run().then(report=>{for(const r of report.resultados)console.log((r.passou?'PASS ':'FAIL ')+r.cenario+(r.passou?'':'\n'+r.erro));console.log(report.aprovados+'/'+report.total+' cenários passaram.');if(report.aprovados!==report.total)process.exitCode=1;}).catch(error=>{console.error(error);process.exitCode=1;});
