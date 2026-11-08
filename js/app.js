(function(){
'use strict';
var $=function(s,r){return (r||document).querySelector(s)};
var $$=function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))};
var ROOT=document.documentElement;

/* ---------- tema ---------- */
var TK='mestre-logica-theme';
try{var t0=localStorage.getItem(TK);if(t0==='light'||t0==='dark')ROOT.setAttribute('data-theme',t0)}catch(e){}
function effTheme(){var a=ROOT.getAttribute('data-theme');if(a)return a;return matchMedia('(prefers-color-scheme: light)').matches?'light':'dark'}
var ICON_SUN='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>';
var ICON_MOON='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>';
function themeBtn(){$('#themeBtn').innerHTML=effTheme()==='dark'?ICON_SUN:ICON_MOON}
function toggleTheme(){var n=effTheme()==='dark'?'light':'dark';ROOT.setAttribute('data-theme',n);try{localStorage.setItem(TK,n)}catch(e){}themeBtn()}

/* ---------- estado salvo ---------- */
var KEY='mestre-logica-v1';
function fresh(){return{xp:0,phases:{},got:{},errors:{},answered:0,correct:0,seen:{}}}
function load(){try{var r=JSON.parse(localStorage.getItem(KEY));if(r&&typeof r==='object'){var f=fresh();for(var k in f)if(!(k in r))r[k]=f[k];return r}}catch(e){}return fresh()}
var S=load();
function save(){try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}}
function level(){return Math.floor(S.xp/100)+1}

/* ---------- conteúdo ---------- */
var CONN={
  neg:{sym:'¬p',name:'Negação (NÃO)',n:1,f:function(p){return !p},rule:'Inverte o valor: se p é V, ¬p é F.'},
  and:{sym:'p ∧ q',name:'Conjunção (E)',n:2,f:function(p,q){return p&&q},rule:'Só é verdadeira quando as duas são verdadeiras.'},
  or:{sym:'p ∨ q',name:'Disjunção (OU)',n:2,f:function(p,q){return p||q},rule:'Só é falsa quando as duas são falsas.'},
  imp:{sym:'p → q',name:'Condicional (SE… ENTÃO)',n:2,f:function(p,q){return !p||q},rule:'Só é falsa quando p é V e q é F.'},
  bi:{sym:'p ↔ q',name:'Bicondicional (SE E SOMENTE SE)',n:2,f:function(p,q){return p===q},rule:'É verdadeira quando p e q têm o mesmo valor.'}
};
var VF=function(b){return b?'V':'F'};
var ROWS=[[true,true],[true,false],[false,true],[false,false]];

var CLS=[
  {s:'Brasília é a capital do Brasil.',p:true,w:'Afirma algo que podemos julgar. É uma proposição verdadeira.'},
  {s:'Que horas são?',p:false,w:'É uma pergunta. Não dá para dizer que é V ou F.'},
  {s:'7 + 5 = 13.',p:true,w:'É uma proposição. Ela é falsa, mas continua sendo proposição.'},
  {s:'Feche a janela.',p:false,w:'É uma ordem, não afirma nada.'},
  {s:'x − 4 = 10',p:false,w:'Sentença aberta: depende do valor de x.'}
];
var QF={
  preds:[
    {k:'par',t:'x é par',f:function(x){return x%2===0}},
    {k:'pos',t:'x é maior que 0',f:function(x){return x>0}},
    {k:'gt5',t:'x é maior que 5',f:function(x){return x>5}}
  ],
  nums:[1,2,3,4,5,6,7,8]
};

var LESSONS={
  frase:{title:'Frase ou proposição?',w:'cls',html:function(){return ''+
    '<p>Toda proposição é uma frase, mas nem toda frase é uma proposição. Uma <b>proposição</b> é uma frase declarativa que podemos julgar como <b>verdadeira (V)</b> ou <b>falsa (F)</b>, e nunca as duas ao mesmo tempo.</p>'+
    '<ul class="ex-list"><li><span>O céu é azul.</span><em>proposição (V)</em></li><li><span>2 + 2 = 5.</span><em>proposição (F)</em></li><li class="no"><span>Feche a porta!</span><em>ordem</em></li><li class="no"><span>Que horas são?</span><em>pergunta</em></li></ul>'+
    '<div class="callout"><b>Importante</b><span>Perguntas, ordens, exclamações e sentenças com valor desconhecido, como x + 1 = 3, não são proposições.</span></div>'}},
  simples:{title:'Proposições simples e compostas',html:function(){return ''+
    '<p>Uma proposição <b>simples</b> expressa uma única ideia. Uma proposição <b>composta</b> junta duas ou mais proposições simples por meio de <b>conectivos lógicos</b>.</p>'+
    '<div class="cgrid"><div class="cc"><b>Simples</b><span>Maria é professora.</span><small>Uma ideia, nenhum conectivo.</small></div>'+
    '<div class="cc"><b>Composta</b><span>Maria é professora <b>e</b> Pedro é médico.</span><small>Duas proposições ligadas por “e”.</small></div>'+
    '<div class="cc"><b>Composta</b><span><b>Se</b> chover, <b>então</b> a rua ficará molhada.</span><small>Duas proposições ligadas por “se… então”.</small></div></div>'+
    '<p>Nas expressões, usamos letras minúsculas como <span class="sym">p</span>, <span class="sym">q</span> e <span class="sym">r</span> para representar proposições simples.</p>'}},
  conectivos1:{title:'Negação, E e OU',html:function(){return ''+
    '<p>Os conectivos combinam proposições e produzem um novo valor lógico. Começamos pelos três mais usados.</p>'+
    '<div class="cgrid">'+
    '<div class="cc"><span class="s sym">¬</span><b>NÃO (negação)</b><span>Inverte o valor lógico.</span><small>p: “Chove.” → ¬p: “Não chove.”</small></div>'+
    '<div class="cc"><span class="s sym">∧</span><b>E (conjunção)</b><span>Só é verdadeira se as duas forem verdadeiras.</span><small>“Estudo e treino.”</small></div>'+
    '<div class="cc"><span class="s sym">∨</span><b>OU (disjunção)</b><span>Só é falsa se as duas forem falsas.</span><small>É o “ou” inclusivo: vale também se as duas forem V.</small></div></div>'}},
  conectivos2:{title:'SE… ENTÃO e SE E SOMENTE SE',html:function(){return ''+
    '<div class="cgrid">'+
    '<div class="cc"><span class="s sym">→</span><b>SE… ENTÃO (condicional)</b><span>Só é falsa quando p é V e q é F.</span><small>“Se tirar 10, ganho um jogo.” Só menti se tirei 10 e não ganhei.</small></div>'+
    '<div class="cc"><span class="s sym">↔</span><b>SE E SOMENTE SE (bicondicional)</b><span>É verdadeira quando p e q têm o mesmo valor.</span><small>“Um número é par se e somente se é divisível por 2.”</small></div></div>'+
    '<div class="callout"><b>Cuidado com a condicional</b><span>Se o antecedente (p) é falso, a condicional é verdadeira, não importa o consequente. Ninguém quebrou a promessa.</span></div>'}},
  tabela:{title:'Tabela-verdade',w:'tt',html:function(){return ''+
    '<p>A tabela-verdade lista todas as combinações possíveis de V e F para as proposições e mostra o resultado da expressão em cada uma. Com <b>n</b> proposições, a tabela tem <b>2ⁿ linhas</b>: 2 proposições dão 4 linhas, 3 dão 8, 4 dão 16.</p>'+
    '<p>Experimente abaixo. Escolha o conectivo e mude os valores de p e q para ver a linha correspondente acender.</p>'}},
  quantificadores:{title:'Quantificadores',w:'qf',html:function(){return ''+
    '<p>Quantificadores transformam uma sentença aberta, como “x é par”, em uma proposição, dizendo para quantos elementos ela vale.</p>'+
    '<div class="cgrid">'+
    '<div class="cc"><span class="s sym">∀</span><b>Universal</b><span>“Para todo x…”, “todo”, “qualquer”.</span><small>Basta um contraexemplo para tornar falsa.</small></div>'+
    '<div class="cc"><span class="s sym">∃</span><b>Existencial</b><span>“Existe x…”, “algum”, “pelo menos um”.</span><small>Basta um exemplo para tornar verdadeira.</small></div></div>'+
    '<div class="callout"><b>Como negar</b><span><span class="sym">¬∀x P(x)</span> equivale a <span class="sym">∃x ¬P(x)</span>. E <span class="sym">¬∃x P(x)</span> equivale a <span class="sym">∀x ¬P(x)</span>. Negar “todos passaram” é “existe alguém que não passou”.</span></div>'}},
  desafio:{title:'Hora do desafio',html:function(){return ''+
    '<p>Esta fase mistura tudo o que você viu. Antes de começar, uma revisão rápida:</p>'+
    '<ul class="ex-list"><li><span>Proposição: frase declarativa que é V ou F.</span></li><li><span>E só é V se as duas forem V. OU só é F se as duas forem F.</span></li><li><span>SE… ENTÃO só é F em V → F.</span></li><li><span>Tabela com n proposições tem 2ⁿ linhas.</span></li><li><span>Negar ∀ dá ∃; negar ∃ dá ∀. Sempre com a negação do predicado.</span></li></ul>'+
    '<div class="callout"><b>Dica do Severino</b><span>Use o botão Dica quando travar. Com dica, a questão vale metade do XP.</span></div>'}}
};
var LORDER=['frase','simples','conectivos1','conectivos2','tabela','quantificadores'];

var PHASES=[
 {id:1,title:'Proposições',sub:'O que são e como identificá-las.',lessons:['frase','simples'],qs:[
  {id:'a1',t:'Frase × proposição',l:'frase',q:'Qual das alternativas é uma proposição?',o:['Que horas são?','Feche a porta.','7 é um número primo.','Que dia lindo!'],a:2,h:'Procure a frase que afirma algo que pode ser V ou F.',w:'“7 é um número primo” afirma algo e podemos julgá-lo: é verdadeira. As outras são pergunta, ordem e exclamação.'},
  {id:'a2',t:'Frase × proposição',l:'frase',q:'A sentença abaixo é uma proposição?',x:'x + 3 = 10',o:['Sim, é sempre verdadeira.','Sim, é sempre falsa.','Não, porque o valor de x não está definido.','Não, porque é uma pergunta.'],a:2,h:'Pense: dá para dizer V ou F sem saber quanto vale x?',w:'É uma sentença aberta. Só vira V ou F quando x recebe um valor, ou quando é quantificada.'},
  {id:'a3',t:'Frase × proposição',l:'frase',q:'“O Sol é um planeta.” Sobre essa frase, é correto afirmar:',o:['Não é proposição, pois é falsa.','É proposição e seu valor lógico é F.','É proposição e seu valor lógico é V.','Não é proposição, pois é uma opinião.'],a:1,h:'Proposição pode ser falsa. O que importa é poder ser julgada.',w:'Ela afirma algo que pode ser julgado, e o julgamento é F. Continua sendo proposição.'},
  {id:'a4',t:'Simples × composta',l:'simples',q:'Qual das frases é uma proposição composta?',o:['Maria é professora.','5 é maior que 2.','Pedro estuda e trabalha.','O gato dorme.'],a:2,h:'Procure um conectivo ligando duas ideias.',w:'“Pedro estuda” e “Pedro trabalha” estão ligadas pelo conectivo “e”.'},
  {id:'a5',t:'Simples × composta',l:'simples',q:'Quantas proposições simples formam “Se chover, então a rua ficará molhada”?',o:['1','2','3','4'],a:1,h:'Retire o “se… então” e conte o que sobra.',w:'“Chove” e “a rua fica molhada”, ligadas por “se… então”.'},
  {id:'a6',t:'Frase × proposição',l:'frase',q:'Qual frase NÃO é uma proposição?',o:['A Terra gira em torno do Sol.','2 + 2 = 5.','Quem descobriu o Brasil?','Todo quadrado é retângulo.'],a:2,h:'Qual delas é uma pergunta?',w:'Perguntas não são V nem F. As demais afirmam algo, mesmo que uma seja falsa.'}
 ]},
 {id:2,title:'Conectivos',sub:'E, OU, NÃO, SE… ENTÃO, SE E SOMENTE SE.',lessons:['conectivos1','conectivos2'],qs:[
  {id:'b1',t:'Negação',l:'conectivos1',q:'Qual é a negação de “O céu está azul”?',o:['O céu está vermelho.','O céu não está azul.','O céu está claro.','O céu estava azul ontem.'],a:1,h:'Negar é dizer o oposto lógico, não outra cor.',w:'Se p é V, ¬p é F. “Vermelho” é só uma das outras possibilidades.'},
  {id:'b2',t:'Conjunção (E)',l:'conectivos1',q:'Qual é o valor de p ∧ q?',x:'p = V,  q = F',o:['Verdadeiro','Falso','Depende de p','Indeterminado'],a:1,h:'O E exige as duas verdadeiras.',w:'V ∧ F = F. Basta uma parte falsa para a conjunção ser falsa.'},
  {id:'b3',t:'Disjunção (OU)',l:'conectivos1',q:'Qual é o valor de p ∨ q?',x:'p = F,  q = V',o:['Verdadeiro','Falso','Depende de q','Indeterminado'],a:0,h:'O OU só falha quando as duas são falsas.',w:'F ∨ V = V. Uma parte verdadeira já basta.'},
  {id:'b4',t:'Condicional (→)',l:'conectivos2',q:'Qual é o valor de p → q?',x:'p = V,  q = F',o:['Verdadeiro','Falso','Depende de p','Indeterminado'],a:1,h:'Lembre da promessa quebrada.',w:'A condicional só é falsa quando p é V e q é F.'},
  {id:'b5',t:'Condicional (→)',l:'conectivos2',q:'Qual é o valor lógico de “Se 2 > 5, então 3 é par”?',o:['Verdadeiro, porque o antecedente é falso.','Falso, porque 3 não é par.','Falso, porque 2 > 5 é falso.','Não é proposição.'],a:0,h:'Veja o valor do antecedente (2 > 5).',w:'Com antecedente F, a condicional é V, não importa o consequente.'},
  {id:'b6',t:'Bicondicional (↔)',l:'conectivos2',q:'Qual é o valor de p ↔ q?',x:'p = F,  q = F',o:['Verdadeiro','Falso','Depende de p','Indeterminado'],a:0,h:'Valores iguais dão V.',w:'F ↔ F = V, porque p e q têm o mesmo valor.'},
  {id:'b7',t:'Condicional (→)',l:'conectivos2',q:'Como se escreve “Se estudo, então passo” em símbolos? (p: estudo; q: passo)',o:['p ∧ q','p ∨ q','p → q','p ↔ q'],a:2,h:'“Se… então” é qual conectivo?',w:'“Se p, então q” é a condicional: p → q.'},
  {id:'b8',t:'Bicondicional (↔)',l:'conectivos2',q:'“Um triângulo é equilátero se e somente se tem três lados iguais” usa qual conectivo?',o:['Conjunção (∧)','Disjunção (∨)','Condicional (→)','Bicondicional (↔)'],a:3,h:'Procure “se e somente se”.',w:'“Se e somente se” é o bicondicional (↔).'}
 ]},
 {id:3,title:'Tabelas-verdade',sub:'Todas as combinações possíveis.',lessons:['tabela'],qs:[
  {id:'c1',t:'Tabela-verdade',l:'tabela',q:'Quantas linhas tem a tabela-verdade de uma expressão com 2 proposições (p e q)?',o:['2','3','4','8'],a:2,h:'São 2 valores possíveis, elevado ao número de proposições.',w:'2² = 4 linhas: VV, VF, FV, FF.'},
  {id:'c2',t:'Tabela-verdade',l:'tabela',q:'E com 3 proposições (p, q e r)?',o:['6','8','9','12'],a:1,h:'2³.',w:'2³ = 8 linhas.'},
  {id:'c3',t:'Tabela-verdade',l:'tabela',type:'table',q:'Complete a coluna de p → q.',ex:'p → q',f:CONN.imp.f,h:'A condicional só é falsa em uma linha.',w:'p → q só é F na linha em que p é V e q é F.'},
  {id:'c4',t:'Tabela-verdade',l:'tabela',q:'Qual é o resultado da proposição?',x:'(A ∨ B) ∧ ¬B\nA = V,  B = F',o:['Verdadeiro','Falso','Indeterminado','Contradição'],a:0,h:'Resolva primeiro os parênteses e a negação.',w:'A ∨ B = V. ¬B = V. Então V ∧ V = V.'},
  {id:'c5',t:'Tabela-verdade',l:'tabela',q:'Qual é o valor de ¬(p ∧ q)?',x:'p = V,  q = V',o:['Verdadeiro','Falso','Depende de q','Indeterminado'],a:1,h:'Resolva o que está dentro do parêntese e depois negue.',w:'p ∧ q = V, então ¬(V) = F.'},
  {id:'c6',t:'Tautologia e contradição',l:'tabela',q:'A expressão p ∨ ¬p resulta em V em todas as linhas. Ela é uma:',o:['Contradição','Tautologia','Contingência','Sentença aberta'],a:1,h:'Sempre verdadeira tem nome próprio.',w:'Tautologia é a expressão sempre verdadeira.'},
  {id:'c7',t:'Tautologia e contradição',l:'tabela',q:'A expressão p ∧ ¬p resulta em F em todas as linhas. Ela é uma:',o:['Contradição','Tautologia','Contingência','Sentença aberta'],a:0,h:'Sempre falsa tem nome próprio.',w:'Contradição é a expressão sempre falsa.'}
 ]},
 {id:4,title:'Quantificadores',sub:'Para todo (∀) e existe (∃).',lessons:['quantificadores'],qs:[
  {id:'d1',t:'Quantificador universal',l:'quantificadores',q:'“Todo número par é divisível por 2” usa qual quantificador?',o:['Universal (∀)','Existencial (∃)','Nenhum','Bicondicional'],a:0,h:'“Todo” indica para todos os elementos.',w:'“Todo” é o quantificador universal, ∀.'},
  {id:'d2',t:'Quantificador existencial',l:'quantificadores',q:'“Existe um aluno que gosta de matemática” usa qual quantificador?',o:['Universal (∀)','Existencial (∃)','Nenhum','Condicional'],a:1,h:'“Existe” pede pelo menos um.',w:'“Existe” é o quantificador existencial, ∃.'},
  {id:'d3',t:'Negação de quantificadores',l:'quantificadores',q:'Qual é a negação de “Todos os alunos passaram”?',o:['Nenhum aluno passou.','Existe aluno que não passou.','Todos os alunos reprovaram.','Alguns alunos passaram.'],a:1,h:'Para desmentir “todos”, quantos casos bastam?',w:'¬∀ vira ∃ com a negação: basta um aluno que não passou.'},
  {id:'d4',t:'Negação de quantificadores',l:'quantificadores',q:'Qual é a negação de “Algum gato é preto”?',o:['Algum gato não é preto.','Todo gato é preto.','Nenhum gato é preto.','Existe gato branco.'],a:2,h:'Para desmentir “algum”, nenhum pode valer.',w:'¬∃ vira ∀ com a negação: todo gato não é preto, ou seja, nenhum gato é preto.'},
  {id:'d5',t:'Quantificador universal',l:'quantificadores',q:'Para mostrar que “Todo número primo é ímpar” é falsa, basta:',o:['Mostrar vários primos ímpares.','Dar um contraexemplo, como o 2.','Provar que há infinitos primos.','Dizer que é uma opinião.'],a:1,h:'Um caso contrário já derruba um “para todo”.',w:'O 2 é primo e par. Um contraexemplo basta para falsear uma universal.'},
  {id:'d6',t:'Quantificador existencial',l:'quantificadores',q:'Qual é o valor lógico de:',x:'∃x ∈ ℕ, x + 5 = 3',o:['Verdadeiro','Falso','Depende de x','Não é proposição'],a:1,h:'Algum natural somado com 5 pode dar 3?',w:'Todo natural somado a 5 dá pelo menos 5. Nenhum dá 3, então é F.'},
  {id:'d7',t:'Quantificador universal',l:'quantificadores',q:'Qual é o valor lógico de:',x:'∀x ∈ ℝ, x² ≥ 0',o:['Verdadeiro','Falso','Depende de x','Não é proposição'],a:0,h:'Teste com números negativos também.',w:'O quadrado de qualquer real é maior ou igual a zero. É V.'}
 ]},
 {id:5,title:'Desafio final',sub:'Problemas que misturam tudo.',lessons:['desafio'],qs:[
  {id:'e1',t:'Frase × proposição',l:'frase',q:'Qual das opções é uma proposição?',o:['Que lindo dia!','x < 4','A água ferve a 100 °C ao nível do mar.','Estude para a prova.'],a:2,h:'Elimine exclamação, sentença aberta e ordem.',w:'Só a terceira afirma algo que pode ser julgado V ou F.'},
  {id:'e2',t:'Tabela-verdade',l:'tabela',q:'Qual é o valor de (p → q) ∨ ¬q?',x:'p = V,  q = F',o:['Verdadeiro','Falso','Indeterminado','Contradição'],a:0,h:'p → q é F aqui. E ¬q?',w:'p → q = F e ¬q = V. F ∨ V = V.'},
  {id:'e3',t:'Negação de quantificadores',l:'quantificadores',q:'Qual é a negação de “Todo número primo é ímpar”?',o:['Nenhum número primo é ímpar.','Existe número primo par.','Todo número primo é par.','Existe número ímpar que não é primo.'],a:1,h:'Negue o ∀ e também o predicado.',w:'¬∀ vira ∃ com a negação: existe primo que não é ímpar, o 2.'},
  {id:'e4',t:'Tabela-verdade',l:'tabela',type:'table',q:'Complete a coluna de ¬p ∨ q.',ex:'¬p ∨ q',f:function(p,q){return !p||q},h:'Negue p primeiro, depois aplique o OU.',w:'A coluna é igual à de p → q. As duas expressões são equivalentes.'},
  {id:'e5',t:'Disjunção (OU)',l:'conectivos1',q:'“Hoje é segunda ou terça.” Hoje é terça. A proposição composta é:',o:['Falsa, pois hoje não é segunda.','Verdadeira, pois basta uma parte verdadeira.','Falsa, pois exige as duas partes.','Indeterminada.'],a:1,h:'O OU só falha quando as duas partes são falsas.',w:'F ∨ V = V.'},
  {id:'e6',t:'Tabela-verdade',l:'tabela',q:'Quantas linhas tem a tabela-verdade de uma expressão com 4 proposições?',o:['8','12','16','32'],a:2,h:'2⁴.',w:'2⁴ = 16 linhas.'},
  {id:'e7',t:'Condicional (→)',l:'conectivos2',q:'“Se p, então q” só é falsa quando:',o:['p é F e q é V','p é V e q é F','p e q são F','p e q são V'],a:1,h:'Promessa quebrada.',w:'Antecedente V e consequente F.'}
 ]}
];

/* ---------- conhecimento do Severino ---------- */
var KB=[
 [/^(oi|ola|e ai|bom dia|boa tarde|boa noite|eai)/,'Oi! Sou o Severino. Pode me perguntar sobre proposições, conectivos, tabelas-verdade ou quantificadores.'],
 [/(se e somente se|bicondicional|<->|↔|se e so se)/,'O bicondicional (p ↔ q) lê-se “p se e somente se q”. Ele é verdadeiro quando p e q têm o mesmo valor: os dois V ou os dois F. Exemplo: “um número é par se e somente se é divisível por 2”.'],
 [/(se.*entao|condicional|implicacao|→|->)/,'A condicional (p → q) lê-se “se p, então q”. Ela só é falsa em um caso: p verdadeiro e q falso. Pense numa promessa: só foi quebrada se a condição aconteceu e o resultado não veio.'],
 [/((negacao|negar|negue|contrario).*(todo|todos|algum|alguns|existe|quantificador)|(todo|todos|algum|existe).*(negacao|negar))/,'Para negar um quantificador, troque ∀ por ∃ (ou o contrário) e negue o predicado. “Todos passaram” vira “existe alguém que não passou”. “Algum gato é preto” vira “nenhum gato é preto”.'],
 [/(quantificador|universal|existencial|para todo|existe|∀|∃)/,'O quantificador universal (∀) diz “para todo”: basta um contraexemplo para ser falso. O existencial (∃) diz “existe pelo menos um”: basta um exemplo para ser verdadeiro.'],
 [/(tautologia|contradicao|contingencia)/,'Tautologia é uma expressão sempre verdadeira, como p ∨ ¬p. Contradição é sempre falsa, como p ∧ ¬p. Contingência é a que tem V e F na tabela.'],
 [/(tabela|linhas|combinac)/,'A tabela-verdade lista todas as combinações de V e F. Com n proposições há 2ⁿ linhas: 2 dão 4, 3 dão 8, 4 dão 16. Teste a tabela interativa na área Aprender.'],
 [/(negacao|nao logico|¬|negar)/,'A negação (¬p) inverte o valor: se p é V, ¬p é F, e vice-versa. “Hoje chove” tem como negação “Hoje não chove”.'],
 [/(conjuncao|∧|operador e|e logico|conectivo e)/,'A conjunção (p ∧ q) lê-se “p e q”. Só é verdadeira quando as duas são verdadeiras.'],
 [/(disjuncao|∨|operador ou|ou logico|conectivo ou|inclusivo)/,'A disjunção (p ∨ q) lê-se “p ou q”. Só é falsa quando as duas são falsas. Quando as duas são V, continua V (é o “ou” inclusivo).'],
 [/(composta|simples|conectivo)/,'Proposição simples tem uma só ideia. Composta liga duas ou mais por conectivos: E (∧), OU (∨), NÃO (¬), SE… ENTÃO (→) e SE E SOMENTE SE (↔).'],
 [/(proposicao|frase|sentenca|declarativ)/,'Frase é qualquer conjunto de palavras com sentido. Proposição é a frase declarativa que pode ser julgada V ou F, nunca as duas. Perguntas, ordens, exclamações e sentenças abertas (x + 1 = 3) não são proposições.'],
 [/(xp|nivel|ponto|progresso|fase|desbloque)/,'Cada acerto vale 10 XP (15 nas tabelas). Com dica, vale metade. A cada 100 XP você sobe de nível. Para liberar a próxima fase, acerte pelo menos 60% da atual.']
];
var CHIPS=['Frase ou proposição?','Como funciona o SE… ENTÃO?','Como negar “todos”?','Quantas linhas tem a tabela?'];

/* ---------- mascote Severino ---------- */
function mascot() {
  return '<svg class="mascot" viewBox="0 0 80 92" role="img" aria-label="Severino, o assistente">' +
    '<rect x="8" y="12" width="64" height="42" rx="17" fill="var(--accent)"/>' +
    '<rect x="14" y="18" width="52" height="30" rx="13" fill="var(--face)"/>' +

    /* Boina */
   '<path d="M17 19 Q19 5 39 5 Q58 5 64 18 Q45 23 17 19Z" fill="#176B73"/>' +
   '<path d="M14 19 Q39 23 66 18 L64 24 Q39 28 16 24Z" fill="#104C52"/>' +
   '<circle cx="40" cy="5" r="2.5" fill="#E8B44F"/>' +

    /* Olhos */
    '<ellipse class="blink" cx="30" cy="33" rx="5" ry="5.5" fill="var(--eye)"/>' +
    '<ellipse class="blink" cx="50" cy="33" rx="5" ry="5.5" fill="var(--eye)"/>' +

    /* Bigode */
    '<path d="M40 42 C36 37 31 37 27 41 C25 44 29 48 34 47 C37 47 39 45 40 43 C41 45 43 47 46 47 C51 48 55 44 53 41 C49 37 44 37 40 42Z" fill="#B7A6D9"/>' +

    /* Corpo */
    '<rect x="20" y="58" width="40" height="28" rx="11" fill="var(--accent)"/>' +
    '<circle cx="12" cy="70" r="6" fill="var(--accent)"/>' +
    '<circle cx="68" cy="70" r="6" fill="var(--accent)"/>' +
    '<text x="40" y="77" text-anchor="middle" font-size="15" font-weight="700" fill="#fff" font-family="JetBrains Mono,Cambria Math,monospace">∧</text>' +
    '</svg>';
}
/* ---------- estado de interface ---------- */
var ui={view:'inicio',play:null,lesson:'frase',cls:{},tt:{c:'and',p:true,q:true},qf:{k:'par'}};
var VIEWS=['inicio','fases','aprender','progresso'];
function phase(id){return PHASES.filter(function(p){return p.id===id})[0]}
function isOpen(id){return id===1||!!(S.phases[id-1]&&S.phases[id-1].done)}
function nextPhase(){for(var i=0;i<PHASES.length;i++){var p=PHASES[i];if(!(S.phases[p.id]&&S.phases[p.id].done))return p}return null}
function stars(n){var s='';for(var i=1;i<=3;i++)s+=i<=n?'★':'<span class="off">★</span>';return '<span class="stars" aria-label="'+n+' de 3 estrelas">'+s+'</span>'}
function shuffle(a){a=a.slice();for(var i=a.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1));var t=a[i];a[i]=a[j];a[j]=t}return a}
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
function norm(s){return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'')}

var ICONS={
 book:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M3 5.5C5.5 4 9 4 12 6c3-2 6.5-2 9-.5V19c-2.5-1.5-6-1.5-9 .5-3-2-6.5-2-9-.5z"/><path d="M12 6v13.5"/></svg>',
 game:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><rect x="2.5" y="7" width="19" height="11" rx="5"/><path d="M8 10v5M5.5 12.5h5"/><circle cx="16" cy="11.5" r=".8"/><circle cx="18.2" cy="13.8" r=".8"/></svg>',
 bars:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M5 20v-6M12 20V6M19 20v-10"/></svg>',
 star:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M12 3l2.7 5.8 6.3.7-4.7 4.3 1.3 6.2L12 16.8 6.4 20l1.3-6.2L3 9.5l6.3-.7z"/></svg>',
 play:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M10 8.5l5 3.5-5 3.5z" fill="currentColor"/></svg>',
 arrow:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>'
};

/* ---------- widgets ---------- */
function widget(w){
  if(w==='cls'){
    var done=Object.keys(ui.cls).length,h='<div class="widget"><div class="wt">Mini-jogo: proposição ou não?<span class="muted" style="font-weight:500">'+done+'/'+CLS.length+'</span></div>';
    CLS.forEach(function(c,i){
      var a=ui.cls[i];
      h+='<div class="ex-list"><li style="flex-wrap:wrap;list-style:none;'+(a!==undefined?'':'')+'"><span>“'+c.s+'”</span>';
      if(a===undefined){h+='<span class="chips"><button class="chip" data-act="cls" data-i="'+i+'" data-v="1">Proposição</button><button class="chip" data-act="cls" data-i="'+i+'" data-v="0">Não é</button></span>'}
      else{h+='<em style="color:'+((a===c.p)?'var(--ok-text)':'var(--bad-text)')+'">'+((a===c.p)?'Certo. ':'Quase. ')+c.w+'</em>'}
      h+='</li></div>';
    });
    return h+'</div>';
  }
  if(w==='tt'){
    var s=ui.tt,c=CONN[s.c],rows=c.n===1?[[true],[false]]:ROWS;
    var h2='<div class="widget"><div class="wt">Tabela interativa</div><div class="chips" role="group" aria-label="Conectivo">';
    Object.keys(CONN).forEach(function(k){h2+='<button class="chip sym" data-act="tt-c" data-c="'+k+'" aria-pressed="'+(k===s.c)+'">'+CONN[k].sym+'</button>'});
    h2+='</div><div style="display:flex;gap:18px;flex-wrap:wrap"><span class="tgl">p <button data-act="tt-p" class="'+(s.p?'v':'f')+'" aria-label="Valor de p: '+VF(s.p)+'. Alternar">'+VF(s.p)+'</button></span>';
    if(c.n===2)h2+='<span class="tgl">q <button data-act="tt-q" class="'+(s.q?'v':'f')+'" aria-label="Valor de q: '+VF(s.q)+'. Alternar">'+VF(s.q)+'</button></span>';
    h2+='</div><div class="tt-wrap"><table class="tt"><thead><tr><th>p</th>'+(c.n===2?'<th>q</th>':'')+'<th>'+c.sym+'</th></tr></thead><tbody>';
    rows.forEach(function(r){
      var on=r[0]===s.p&&(c.n===1||r[1]===s.q),res=c.f(r[0],r[1]);
      h2+='<tr'+(on?' class="on"':'')+'><td class="'+VF(r[0])+'">'+VF(r[0])+'</td>'+(c.n===2?'<td class="'+VF(r[1])+'">'+VF(r[1])+'</td>':'')+'<td class="'+VF(res)+'">'+VF(res)+'</td></tr>';
    });
    var cur=c.f(s.p,s.q);
    return h2+'</tbody></table></div><p class="big">'+c.sym+' = <span class="'+VF(cur)+'" style="color:var(--'+(cur?'ok':'bad')+'-text)">'+VF(cur)+'</span></p><p class="muted">'+c.name+'. '+c.rule+'</p></div>';
  }
  if(w==='qf'){
    var pr=QF.preds.filter(function(p){return p.k===ui.qf.k})[0];
    var all=QF.nums.every(pr.f),any=QF.nums.some(pr.f),ce=QF.nums.filter(function(x){return !pr.f(x)})[0],ex=QF.nums.filter(pr.f)[0];
    var h3='<div class="widget"><div class="wt">Teste os quantificadores no conjunto {1, …, 8}</div><div class="chips" role="group" aria-label="Predicado">';
    QF.preds.forEach(function(p){h3+='<button class="chip" data-act="qf" data-k="'+p.k+'" aria-pressed="'+(p.k===ui.qf.k)+'">'+p.t+'</button>'});
    h3+='</div><div class="nums">';
    QF.nums.forEach(function(x){h3+='<span class="num '+(pr.f(x)?'y':'n')+'" title="'+(pr.f(x)?'satisfaz':'não satisfaz')+'">'+x+(pr.f(x)?' ✓':' ✗')+'</span>'});
    h3+='</div><div class="res"><div><span class="sym">∀x P(x)</span>: <b style="color:var(--'+(all?'ok':'bad')+'-text)">'+VF(all)+'</b>'+(all?'':' <span class="muted">(contraexemplo: '+ce+')</span>')+'</div>'+
       '<div><span class="sym">∃x P(x)</span>: <b style="color:var(--'+(any?'ok':'bad')+'-text)">'+VF(any)+'</b>'+(any?' <span class="muted">(exemplo: '+ex+')</span>':'')+'</div></div></div>';
    return h3;
  }
  return '';
}
function lessonCard(id){var L=LESSONS[id];return '<div class="lesson"><h2>'+L.title+'</h2>'+L.html()+(L.w?widget(L.w):'')+'</div>'}

/* ---------- telas ---------- */
function vInicio(){
  var np=nextPhase(),started=S.answered>0||Object.keys(S.seen).length>0;
  var h='<section class="hero"><div><p class="eyebrow">Lógica matemática</p><h1>Treine seu raciocínio. <span>Desbloqueie novas fases.</span></h1>'+
   '<p class="lead">Aprenda de forma interativa os fundamentos da lógica: proposições, conectivos, tabelas-verdade e quantificadores. Uma proposição por vez.</p>'+
   '<div class="cta"><a class="btn" href="#fases">'+ICONS.play+(started?'Continuar estudando':'Começar agora')+'</a><a class="btn ghost" href="#aprender">Ver as aulas</a></div></div>'+
   '<div class="stage"><div class="glow"></div><div class="tile t1 sym">∧</div><div class="tile t2 sym">∨</div><div class="tile t3 sym">¬</div><div class="tile t4 sym">→</div><div class="mascot">'+mascot()+'</div></div></section>'+
   '<div class="feats"><div class="feat">'+ICONS.book+'<div><b>Conteúdo direto</b><span>e objetivo</span></div></div><div class="feat">'+ICONS.game+'<div><b>Desafios interativos</b><span>em formato de jogo</span></div></div><div class="feat">'+ICONS.bars+'<div><b>Seu progresso</b><span>sempre salvo</span></div></div><div class="feat">'+ICONS.star+'<div><b>Do básico</b><span>ao avançado</span></div></div></div>';
  if(started&&np){var r=S.phases[np.id]||{best:0};h+='<div class="resume"><div><b>Próxima parada: Fase '+np.id+', '+np.title+'</b><div class="muted" style="font-size:.88rem">'+np.sub+'</div></div><div class="bar" aria-hidden="true"><i style="width:'+Math.round((r.best||0)/np.qs.length*100)+'%"></i></div><button class="btn" data-act="open-phase" data-id="'+np.id+'">Continuar'+ICONS.arrow+'</button></div>'}
  return h;
}
function vFases(){
  if(ui.play)return vPlay();
  var h='<div class="sec-head"><p class="eyebrow">Trilha de aprendizado</p><h2>Fases</h2><p>Cada fase tem uma mini-aula e exercícios. Acerte pelo menos 60% para liberar a próxima.</p></div><div class="phases">';
  var np=nextPhase();
  PHASES.forEach(function(p){
    var r=S.phases[p.id]||{},open=isOpen(p.id),cur=np&&np.id===p.id;
    h+='<button class="pcard'+(cur?' cur':'')+'" data-act="open-phase" data-id="'+p.id+'"'+(open?'':' disabled aria-disabled="true"')+'>'+
     '<span class="pnum">'+p.id+'</span><h3>'+p.title+'</h3><p>'+p.sub+'</p>'+
     (open?'<span class="bar" aria-hidden="true" style="width:100%"><i style="width:'+Math.round((r.best||0)/p.qs.length*100)+'%"></i></span>':'<span class="tag">Bloqueada · conclua a fase '+(p.id-1)+'</span>')+
     '<span class="pmeta"><span>'+(r.best||0)+' / '+p.qs.length+' acertos</span>'+(r.done?stars(r.stars||1):(open?'<span class="tag">'+(cur?'Em andamento':'Aberta')+'</span>':''))+'</span></button>';
  });
  return h+'</div>';
}
function vPlay(){
  var P=ui.play,ph=phase(P.id);
  if(P.mode==='lessons'){
    var id=ph.lessons[P.li],last=P.li===ph.lessons.length-1;
    return '<div class="play"><div class="qtop"><button class="btn ghost" data-act="leave">← Fases</button><span>Fase '+ph.id+' · '+ph.title+' · mini-aula '+(P.li+1)+' de '+ph.lessons.length+'</span></div>'+lessonCard(id)+
     '<div class="lnav"><button class="btn ghost" data-act="l-prev"'+(P.li===0?' disabled':'')+'>← Voltar</button><span style="display:flex;gap:10px;flex-wrap:wrap"><button class="btn ghost" data-act="start-quiz">Pular para os exercícios</button><button class="btn" data-act="'+(last?'start-quiz':'l-next')+'">'+(last?'Ir para os exercícios':'Próximo')+ICONS.arrow+'</button></span></div></div>';
  }
  if(P.mode==='result'){
    var pct=Math.round(P.right/P.items.length*100),st=pct>=100?3:pct>=80?2:pct>=60?1:0,ok=pct>=60,np2=phase(P.id+1);
    return '<div class="play"><div class="qcard result"><div class="mascot">'+mascot()+'</div><h2>'+(ok?'Fase concluída!':'Quase lá!')+'</h2>'+stars(st)+
     '<p><b>'+P.right+' de '+P.items.length+'</b> acertos ('+pct+'%)'+(P.xpGain?' · +'+P.xpGain+' XP':'')+'</p>'+
     '<p class="muted">'+(ok?(np2?'A fase '+np2.id+', '+np2.title+', está liberada.':'Você completou toda a trilha. Parabéns, Mestre da Lógica!'):'Você precisa de pelo menos 60% para liberar a próxima fase. Revise a mini-aula e tente de novo.')+'</p>'+
     '<div class="qbtns" style="justify-content:center"><button class="btn ghost" data-act="retry">Tentar de novo</button><button class="btn ghost" data-act="leave">Voltar às fases</button>'+(ok&&np2?'<button class="btn" data-act="open-phase" data-id="'+np2.id+'">Próxima fase'+ICONS.arrow+'</button>':'')+'</div></div></div>';
  }
  var q=P.items[P.qi],letters='ABCD',h='<div class="play"><div class="qtop"><button class="btn ghost" data-act="leave">← Sair</button><div class="bar" aria-hidden="true"><i style="width:'+Math.round(P.qi/P.items.length*100)+'%"></i></div><span>'+(P.qi+1)+' / '+P.items.length+'</span></div>'+
   '<div class="qcard"><p class="eyebrow">Desafio '+String(P.qi+1).padStart(2,'0')+' · '+q.t+'</p><h2>'+q.q+'</h2>';
  if(q.x)h+='<div class="expr">'+q.x.split('\n').map(esc).join('<br>')+'</div>';
  if(q.type==='table'){
    h+='<p class="muted">Toque em cada célula para alternar entre V e F.</p><div class="tt-wrap"><table class="tt"><thead><tr><th>p</th><th>q</th><th>'+q.ex+'</th></tr></thead><tbody>';
    ROWS.forEach(function(r,i){
      var v=P.cells[i],cls='cell',txt=v===null?'?':VF(v);
      if(P.checked){var c=q.f(r[0],r[1]);cls+=v===c?' right':' wrong';if(v!==c)txt=VF(v)+' → '+VF(c)}
      h+='<tr><td class="'+VF(r[0])+'">'+VF(r[0])+'</td><td class="'+VF(r[1])+'">'+VF(r[1])+'</td><td><button class="'+cls+'" data-act="cell" data-r="'+i+'"'+(P.checked?' disabled':'')+' aria-label="Linha '+(i+1)+', resultado '+txt+'">'+txt+'</button></td></tr>';
    });
    h+='</tbody></table></div>';
  }else{
    h+='<div class="opts">';
    q.o.forEach(function(o,i){
      var c='opt';if(P.checked){if(i===q.a)c+=' right';else if(i===P.sel)c+=' wrong'}
      h+='<button class="'+c+'" data-act="pick" data-i="'+i+'" aria-pressed="'+(P.sel===i)+'"'+(P.checked?' disabled':'')+'><span class="l">'+letters[i]+'</span><span>'+o+'</span></button>';
    });
    h+='</div>';
  }
  if(P.hint&&!P.checked)h+='<div class="hint"><b>Dica</b><span>'+q.h+'</span></div>';
  if(P.checked){
    h+=P.ok?'<div class="fb ok" role="status"><b>Correto!'+(P.gain?' +'+P.gain+' XP':'')+'</b><span>'+q.w+'</span></div>':'<div class="fb no" role="status"><b>Ainda não.</b><span>'+(q.type==='table'?'':'Resposta certa: '+q.o[q.a].replace(/\.$/,'')+'. ')+q.w+'</span></div>';
  }
  var lastQ=P.qi===P.items.length-1;
  h+='<div class="qbtns"><button class="btn ghost" data-act="hint"'+(P.checked||P.hint?' disabled':'')+'>Dica</button>'+
   (P.checked?'<button class="btn" data-act="next-q">'+(lastQ?'Ver resultado':'Próxima')+ICONS.arrow+'</button>':'<button class="btn" data-act="check">Verificar'+ICONS.arrow+'</button>')+'</div></div></div>';
  return h;
}
function vAprender(){
  var h='<div class="sec-head"><p class="eyebrow">Biblioteca</p><h2>Aprender</h2><p>Explicações curtas, exemplos e tabelas interativas. Volte aqui sempre que precisar.</p></div><div class="learn"><div class="side" role="tablist" aria-label="Aulas">';
  LORDER.forEach(function(id){h+='<button data-act="lesson" data-id="'+id+'" aria-current="'+(ui.lesson===id)+'"><span>'+LESSONS[id].title+'</span>'+(S.seen[id]?'<span class="seen" aria-label="visto">✓</span>':'')+'</button>'});
  var i=LORDER.indexOf(ui.lesson);
  h+='</div><div style="display:flex;flex-direction:column;gap:16px;min-width:0">'+lessonCard(ui.lesson)+
   '<div class="lnav"><button class="btn ghost" data-act="a-prev"'+(i===0?' disabled':'')+'>← Voltar</button>'+(i<LORDER.length-1?'<button class="btn" data-act="a-next">Próximo'+ICONS.arrow+'</button>':'<a class="btn" href="#fases">Praticar nas fases'+ICONS.arrow+'</a>')+'</div></div></div>';
  return h;
}
function vProgresso(){
  var acc=S.answered?Math.round(S.correct/S.answered*100):0,done=PHASES.filter(function(p){return S.phases[p.id]&&S.phases[p.id].done}).length;
  var h='<div class="sec-head"><p class="eyebrow">Seu desempenho</p><h2>Meu progresso</h2><p>Tudo fica salvo neste navegador.</p></div>'+
   '<div class="tiles"><div class="stat"><b>'+S.xp+'</b><span>XP total</span></div><div class="stat"><b>'+level()+'</b><span>Nível</span></div><div class="stat"><b>'+acc+'%</b><span>Taxa de acerto ('+S.correct+' de '+S.answered+')</span></div><div class="stat"><b>'+done+'/'+PHASES.length+'</b><span>Fases concluídas</span></div></div>'+
   '<div class="panel"><h3>Fases</h3>';
  PHASES.forEach(function(p){var r=S.phases[p.id]||{};h+='<div class="prow"><span><b>'+p.id+'.</b> '+p.title+'</span><span class="bar" aria-hidden="true"><i style="width:'+Math.round((r.best||0)/p.qs.length*100)+'%"></i></span><span>'+(r.done?stars(r.stars||1):'<span class="muted">'+(isOpen(p.id)?(r.best||0)+'/'+p.qs.length:'bloqueada')+'</span>')+'</span></div>'});
  h+='</div><div class="panel"><h3>Conteúdos para revisar</h3>';
  var errs=Object.keys(S.errors).sort(function(a,b){return S.errors[b].n-S.errors[a].n});
  if(!errs.length)h+='<p class="muted">Nenhum erro registrado ainda. Os temas em que você errar mais aparecem aqui.</p>';
  errs.slice(0,5).forEach(function(k){var e=S.errors[k];h+='<div class="rev"><span><b>'+k+'</b> <span class="muted">· '+e.n+(e.n>1?' erros':' erro')+'</span></span><button class="btn ghost" data-act="review" data-id="'+e.l+'">Revisar aula</button></div>'});
  h+='</div><div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap">';
  h+=ui.confirmReset?'<span class="muted">Apagar todo o progresso?</span><button class="btn" data-act="reset-yes">Sim, apagar</button><button class="btn ghost" data-act="reset-no">Cancelar</button>':'<button class="btn ghost" data-act="reset">Reiniciar progresso</button>';
  return h+'</div>';
}
/* ---------- FUNÇÕES QUE ESTAVAM FALTANDO ---------- */

function sig(el) {
  return [
    el.dataset.act || '',
    el.dataset.id || '',
    el.dataset.i || '',
    el.dataset.v || '',
    el.dataset.c || '',
    el.dataset.k || '',
    el.dataset.r || ''
  ].join('|');
}

function renderHud() {
  var xp = S.xp;
  var atual = xp % 100;

  $('#xp').innerHTML =
    '<div class="row">' +
      '<span>Nível ' + level() + '</span>' +
      '<b>' + xp + ' XP</b>' +
    '</div>' +
    '<div class="bar">' +
      '<i style="width:' + atual + '%"></i>' +
    '</div>';
}

function route() {
  var pagina = location.hash.replace('#', '');

  if (VIEWS.indexOf(pagina) === -1) {
    pagina = 'inicio';
  }

  ui.view = pagina;
  render();
}

window.addEventListener('hashchange', route);
/* ---------- render ---------- */
function render(keep){
$$('#nav a').forEach(function(a){
  if(a.getAttribute('href')==='#'+ui.view){
    a.setAttribute('aria-current','page');
  } else {
    a.removeAttribute('aria-current');
  }
});
  var fn={inicio:vInicio,fases:vFases,aprender:vAprender,progresso:vProgresso}[ui.view];
  $('#main').innerHTML=fn();
  renderHud();
  if(keep){
    var el=$$('[data-act]').filter(function(e){return sig(e)===keep})[0];
    if(el&&!el.disabled)el.focus({preventScroll:true});
  }
}
/* ---------- Severino ---------- */
var bot={open:false,log:[],unread:0,timer:null};

function renderBot(){
  var l=$('#pbLog');
  l.innerHTML=bot.log.map(function(m){
    return '<div class="msg '+m.w+'">'+esc(m.t)+'</div>';
  }).join('');
  l.scrollTop=l.scrollHeight;

  var d=$('#severinoDot');
  d.hidden=!bot.unread;
  d.textContent=bot.unread;

  var chips=CHIPS.slice();
  if(ui.play&&ui.play.mode==='quiz')chips.unshift('Preciso de uma dica');

  $('#pbChips').innerHTML=chips.map(function(c){
    return '<button class="chip" data-act="chip" data-v="'+esc(c)+'">'+esc(c)+'</button>';
  }).join('');
}

function say(t){
  bot.log.push({w:'bot',t:t});

  if(!bot.open){
    bot.unread++;
    var b=$('#bubble');
    b.textContent=t.length>120?t.slice(0,117)+'…':t;
    b.hidden=false;
    clearTimeout(bot.timer);
    bot.timer=setTimeout(function(){b.hidden=true},7000);
  }

  renderBot();
}

function answer(raw){
  var t=norm(raw);

  if(/(dica|ajuda|nao entendi|questao)/.test(t)&&ui.play&&ui.play.mode==='quiz'){
    var q=ui.play.items[ui.play.qi];
    return 'Dica: '+q.h;
  }

  for(var i=0;i<KB.length;i++){
    if(KB[i][0].test(t))return KB[i][1];
  }

  return 'Ainda não sei responder isso. Tente perguntar sobre proposição, conectivos (E, OU, NÃO, SE… ENTÃO, SE E SOMENTE SE), tabela-verdade ou quantificadores.';
}

function ask(txt){
  txt=txt.trim();
  if(!txt)return;

  bot.log.push({w:'me',t:txt});
  renderBot();

  setTimeout(function(){
    bot.log.push({w:'bot',t:answer(txt)});
    renderBot();
  },350);
}

function toggleBot(){
  bot.open=!bot.open;
  $('#pbot').hidden=!bot.open;

  if(bot.open){
    bot.unread=0;
    $('#bubble').hidden=true;
    renderBot();
    setTimeout(function(){$('#pbInput').focus()},50);
  }else{
    renderBot();
  }
}

function toast(m){
  var t=$('#toast');
  t.textContent=m;
  t.hidden=false;
  clearTimeout(toast.t);
  toast.t=setTimeout(function(){t.hidden=true},1800);
}

/* ---------- fluxo ---------- */
function markSeen(id,silent){
  if(S.seen[id])return;
  S.seen[id]=1;
  save();

  if(!silent){
    say('Aula “'+LESSONS[id].title+'” concluída! Quer testar o que aprendeu nos exercícios da fase?');
  }
}

function startPlay(id,mode){
  var ph=phase(id);

  ui.play={
    id:id,
    mode:mode,
    li:0,
    qi:0,
    sel:null,
    checked:false,
    hint:false,
    right:0,
    xpGain:0,
    cells:[null,null,null,null],
    items:ph.qs.map(function(q){
      if(q.type==='table')return q;

      var idx=shuffle(q.o.map(function(_,i){return i}));
      var c={};

      for(var k in q)c[k]=q[k];

      c.o=idx.map(function(i){return q.o[i]});
      c.a=idx.indexOf(q.a);

      return c;
    })
  };

  location.hash='#fases';
  ui.view='fases';
}

function check(){
  var P=ui.play,q=P.items[P.qi],ok;

  if(q.type==='table'){
    if(P.cells.some(function(c){return c===null})){
      toast('Preencha todas as linhas.');
      return;
    }

    ok=ROWS.every(function(r,i){
      return P.cells[i]===q.f(r[0],r[1]);
    });
  }else{
    if(P.sel===null){
      toast('Escolha uma alternativa.');
      return;
    }

    ok=P.sel===q.a;
  }

  P.checked=true;
  P.ok=ok;
  P.gain=0;
  S.answered++;

  if(ok){
    S.correct++;
    P.right++;

    if(!S.got[q.id]){
      var g=Math.round((q.type==='table'?15:10)/(P.hint?2:1));
      var before=level();

      S.got[q.id]=1;
      S.xp+=g;
      P.gain=g;
      P.xpGain+=g;

      if(level()>before){
        setTimeout(function(){
          say('Subiu para o nível '+level()+'! Continue assim.');
        },400);
      }
    }
  }else{
    var e=S.errors[q.t]||{n:0,l:q.l};
    e.n++;
    S.errors[q.t]=e;
  }

  save();
  render();

  if(ok){
    say(['Isso aí!','Boa! Acertou.','Mandou bem!'][P.qi%3]+(P.gain?' +'+P.gain+' XP.':''));
  }else{
    say('Quase! '+q.h+' Veja a explicação abaixo.');
  }
}

function finish(){
  var P=ui.play,
      ph=phase(P.id),
      r=S.phases[P.id]||{best:0,stars:0,done:false},
      pct=P.right/P.items.length*100,
      st=pct>=100?3:pct>=80?2:pct>=60?1:0,
      was=r.done;

  r.best=Math.max(r.best||0,P.right);
  r.stars=Math.max(r.stars||0,st);
  r.done=r.done||pct>=60;
  S.phases[P.id]=r;

  save();
  P.mode='result';
  render();

  if(pct>=60&&!was){
    var nx=phase(P.id+1);
    say(nx?'Fase '+P.id+' concluída! A fase '+nx.id+', '+nx.title+', foi liberada.':'Você terminou toda a trilha! Parabéns, Mestre da Lógica!');
  }else if(pct<60){
    say('Você acertou '+P.right+' de '+P.items.length+'. Precisa de 60% para liberar a próxima fase. Releia a mini-aula e tente de novo, eu espero.');
  }else{
    say('Você refez a fase com '+P.right+' acertos. Boa revisão!');
  }
}

/* ---------- eventos ---------- */
document.addEventListener('click',function(ev){
  var el=ev.target.closest('[data-act]');
  if(!el)return;

  var a=el.dataset.act,P=ui.play,k=sig(el),keep=null;

  switch(a){
    case 'theme':
      toggleTheme();
      return;

    case 'bot':
      toggleBot();
      return;

    case 'chip':
      ask(el.dataset.v);
      return;

    case 'open-phase':
      var id=+el.dataset.id;
      if(!isOpen(id))return;
      startPlay(id,'lessons');
      say('Fase '+id+': '+phase(id).title+'. Leia a mini-aula com calma e depois vamos praticar.');
      render();
      window.scrollTo(0,0);
      return;

    case 'leave':
      ui.play=null;
      render();
      window.scrollTo(0,0);
      return;

    case 'l-prev':
      P.li--;
      render();
      window.scrollTo(0,0);
      return;

    case 'l-next':
      markSeen(phase(P.id).lessons[P.li],true);
      P.li++;
      render();
      window.scrollTo(0,0);
      return;

    case 'start-quiz':
      phase(P.id).lessons.forEach(function(l){markSeen(l,true)});
      P.mode='quiz';
      P.qi=0;
      P.sel=null;
      P.checked=false;
      P.hint=false;
      P.cells=[null,null,null,null];
      say('Mini-aula concluída! Vamos aos exercícios. Se travar, use o botão Dica.');
      render();
      window.scrollTo(0,0);
      return;

    case 'pick':
      if(!P.checked){
        P.sel=+el.dataset.i;
        render(k);
      }
      return;

    case 'cell':
      if(!P.checked){
        var r=+el.dataset.r;
        P.cells[r]=P.cells[r]===null?true:!P.cells[r];
        render(k);
      }
      return;

    case 'hint':
      P.hint=true;
      render();
      return;

    case 'check':
      check();
      return;

    case 'next-q':
      if(P.qi===P.items.length-1){
        finish();
      }else{
        P.qi++;
        P.sel=null;
        P.checked=false;
        P.hint=false;
        P.cells=[null,null,null,null];
        render();
        window.scrollTo(0,0);
      }
      return;

    case 'retry':
      startPlay(P.id,'quiz');
      render();
      window.scrollTo(0,0);
      return;

    case 'lesson':
      ui.lesson=el.dataset.id;
      markSeen(ui.lesson,true);
      render(k);
      return;

    case 'a-prev':
    case 'a-next':
      var i=LORDER.indexOf(ui.lesson);

      if(a==='a-next'){
        markSeen(ui.lesson);
        i++;
      }else{
        i--;
      }

      ui.lesson=LORDER[i];
      markSeen(ui.lesson,true);
      render();
      window.scrollTo(0,0);
      return;

    case 'review':
      ui.lesson=el.dataset.id;
      location.hash='#aprender';
      return;

    case 'cls':
      ui.cls[+el.dataset.i]=el.dataset.v==='1';
      render(k);

      if(Object.keys(ui.cls).length===CLS.length){
        var sc=CLS.filter(function(c,i){return ui.cls[i]===c.p}).length;
        say('Mini-jogo completo: '+sc+' de '+CLS.length+'. '+(sc===CLS.length?'Perfeito!':'Releia o quadro Importante e tente de novo depois.'));
      }
      return;

    case 'tt-c':
      ui.tt.c=el.dataset.c;
      render(k);
      return;

    case 'tt-p':
      ui.tt.p=!ui.tt.p;
      render(k);
      return;

    case 'tt-q':
      ui.tt.q=!ui.tt.q;
      render(k);
      return;

    case 'qf':
      ui.qf.k=el.dataset.k;
      render(k);
      return;

    case 'reset':
      ui.confirmReset=true;
      render();
      return;

    case 'reset-no':
      ui.confirmReset=false;
      render();
      return;

    case 'reset-yes':
      S=fresh();
      save();
      ui.confirmReset=false;
      ui.play=null;
      render();
      toast('Progresso reiniciado.');
      return;
  }
});

$('#pbForm').addEventListener('submit',function(e){
  e.preventDefault();
  var i=$('#pbInput');
  ask(i.value);
  i.value='';
});

document.addEventListener('keydown',function(e){
  if(e.key==='Escape'&&bot.open)toggleBot();
});

/* ---------- início ---------- */
themeBtn();

$('#severinoMascot').innerHTML=mascot();
$('#pbMascot').innerHTML=mascot();

bot.log.push({
  w:'bot',
  t:'Oi! Eu sou o Severino. Vou te acompanhar na trilha e tirar suas dúvidas sobre lógica. É só clicar em mim quando quiser conversar.'
});

route();

if(S.answered===0){
  setTimeout(function(){
    say('Bem-vindo ao Mestre da Lógica! Comece pela Fase 1: Proposições.');
  },900);
}

renderBot();
})();

/* MENU HAMBURGUER */

const menuBtn = document.getElementById('menuBtn');
const nav = document.getElementById('nav');
const topMenu = document.querySelector('.top');

menuBtn.addEventListener('click', function () {
    const aberto = topMenu.classList.toggle('menu-open');

    menuBtn.setAttribute('aria-expanded', aberto);

    menuBtn.setAttribute(
        'aria-label',
        aberto ? 'Fechar menu' : 'Abrir menu'
    );
});

// Fechar o menu ao escolher uma opção
nav.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
        topMenu.classList.remove('menu-open');
        menuBtn.setAttribute('aria-expanded', 'false');
        menuBtn.setAttribute('aria-label', 'Abrir menu');
    });
});