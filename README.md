# Mestre da Lógica

> **Aprenda a pensar. Uma proposição por vez.**

Site educativo e interativo, em formato de jogo, que ensina **noções de lógica**: proposições, conectivos, tabelas-verdade e quantificadores. Projeto da avaliação **AV3** da disciplina *Modelagem e Simulação Matemática* (Prof. Marcelo Lopes, Turma C).

🔗 **Site:** [link do site]

## Sumário

- [Sobre o projeto](#sobre-o-projeto)
- [O que o aluno aprende](#o-que-o-aluno-aprende)
- [Como funciona o jogo](#como-funciona-o-jogo)
- [Severino, o assistente](#severino-o-assistente)
- [Tecnologias](#tecnologias)
- [Estrutura de pastas](#estrutura-de-pastas)
- [Como executar](#como-executar)
- [Limitações e próximos passos](#limitações-e-próximos-passos)
- [Equipe](#equipe)

## Sobre o projeto

A proposta da AV3 pede um aplicativo educativo que aborde, de forma lúdica e dinâmica, conceitos de lógica matemática e teoria dos conjuntos. A equipe escolheu o tópico **Noções de lógica** e transformou o estudo em uma trilha de fases: o aluno lê uma mini-aula curta, resolve desafios, ganha pontos (XP), sobe de nível, conquista estrelas e libera a próxima fase.

Destaques:

- 5 fases, 7 mini-aulas e 35 questões
- Tabela-verdade interativa e widget de quantificadores
- Pontos, níveis, estrelas e fases que desbloqueiam
- Assistente em forma de boneco, o **Severino**
- Modo claro e escuro
- Progresso salvo no navegador, sem login
- Funciona em celular (menu hambúrguer)
- HTML, CSS e JavaScript puros, sem instalar nada

## O que o aluno aprende

| Fase | Conteúdo | Questões |
|------|----------|:--------:|
| 1. Proposições | Diferença entre frase e proposição; proposições simples e compostas | 6 |
| 2. Conectivos | E (∧), OU (∨), NÃO (¬), SE… ENTÃO (→) e SE E SOMENTE SE (↔) | 8 |
| 3. Tabelas-verdade | Combinações possíveis, tautologia e contradição | 7 |
| 4. Quantificadores | Universal (∀), existencial (∃) e como negá-los | 7 |
| 5. Desafio final | Problemas que misturam todos os temas, incluindo equivalência entre `¬p ∨ q` e `p → q` | 7 |

A teoria dos conjuntos aparece como base dos quantificadores (por exemplo, testar "x é par" no conjunto {1, …, 8}). Uma fase própria sobre conjuntos está prevista como evolução.

## Como funciona o jogo

| Regra | Valor |
|-------|-------|
| XP por acerto | 10 XP (15 XP nas questões de completar tabela) |
| Uso da dica | A questão vale metade do XP |
| XP repetido | Só conta no primeiro acerto de cada questão |
| Nível | `floor(XP / 100) + 1` |
| Liberar a próxima fase | Acertar pelo menos 60% da fase atual |
| Estrelas | 1 estrela com 60%, 2 com 80% e 3 com 100% de acertos |
| Revisão | A página *Meu progresso* lista os temas em que o aluno mais errou |

Cada resposta vem com explicação, e o aluno pode refazer a fase para conquistar mais estrelas.

## Severino, o assistente

O Severino é um boneco de boina e bigode que fica no canto da tela. Ele:

- responde dúvidas sobre proposições, conectivos, tabelas-verdade, quantificadores, XP e fases;
- comenta o desempenho ao fim de mini-aulas e fases;
- oferece botões de perguntas prontas.

Ele funciona por **palavras-chave** (13 temas cadastrados em `KB`, dentro de `js/app.js`), sem IA externa. Perguntas fora desses temas recebem sugestões do que ele sabe responder.

## Tecnologias

- **HTML5** para a estrutura
- **CSS3** com variáveis de cor para os temas claro e escuro e layout responsivo
- **JavaScript** puro (sem framework) para conteúdo, regras do jogo, Severino e progresso
- **localStorage** para salvar o progresso no navegador
- Fonte **Poppins** (Google Fonts)

## Estrutura de pastas

```
mestre-da-logica/
├── index.html        # estrutura da página (cabeçalho, menu, painel do Severino)
├── css/
│   └── style.css     # visual, temas claro e escuro, menu hambúrguer
├── js/
│   └── app.js        # conteúdo, regras do jogo, Severino e progresso
└── README.md
```

Principais estruturas dentro de `js/app.js`:

| Nome | O que guarda |
|------|--------------|
| `LESSONS` | As mini-aulas |
| `PHASES` | As 5 fases, com mini-aulas e questões |
| `CONN` | Os conectivos (símbolo, nome, regra e função de cálculo) |
| `CLS` | As frases do mini-jogo "proposição ou não?" |
| `QF` | As sentenças e os números do widget de quantificadores |
| `KB` | A base de conhecimento do Severino |

## Como executar

Não precisa instalar nada.

1. Baixe ou clone o repositório:
   ```bash
   git clone https://github.com/<seu-usuario>/<nome-do-repositorio>.git
   ```
2. Abra o arquivo `index.html` no navegador (duplo clique).

Se preferir um servidor local, na pasta do projeto rode `python -m http.server 8000` e acesse `http://localhost:8000`. No VS Code, também funciona a extensão *Live Server*.

> A fonte Poppins é carregada da internet. Sem conexão, o site usa a fonte padrão do sistema e continua funcionando.


## Limitações e próximos passos

- O Severino responde por palavras-chave, não por inteligência artificial.
- O progresso fica salvo apenas no navegador do aluno (não sincroniza entre dispositivos).
- A teoria dos conjuntos ainda não tem fase própria.

Ideias futuras: fase de conjuntos (pertinência, inclusão, união e interseção), mais questões e níveis de dificuldade, mais exemplos de equivalências lógicas e contas de usuário para salvar o progresso na nuvem.

## Equipe

| Integrante |
|------------|
| [Ericsson dos Santos] |
| [Íris Conceição] |
| [Matheus Macedo] |
| [Renato Bloisi] |
| [Tailane Brito] |

Professor: Marcelo Lopes · Disciplina: Modelagem e Simulação Matemática · Unijorge · 2026
