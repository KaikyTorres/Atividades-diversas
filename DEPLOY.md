# Como publicar (Vercel) e rodar localmente

Este é um site **100% estático** (HTML + CSS). Não há build, banco de dados nem
back-end — basta servir os arquivos.

---

## 1. Publicar no Vercel

### Opção A — pelo site (mais fácil, sem instalar nada)

1. Acesse <https://vercel.com> e faça login (pode usar a conta do GitHub).
2. Clique em **Add New… → Project**.
3. Em **Import Git Repository**, selecione `KaikyTorres/Atividades-diversas`.
   - Se não aparecer, clique em **Adjust GitHub App Permissions** e autorize o repositório.
4. Framework Preset: **Other** · Build Command: *(deixe vazio)* · Output Directory: *(deixe vazio)*.
5. Clique em **Deploy**. Em ~1 minuto sai uma URL tipo
   `https://atividades-diversas.vercel.app` para mostrar ao cliente.

> **Dica:** a página está no branch `claude/kawan-mandu-landing-page-r6djdf`.
> Assim que você conecta o repositório, o Vercel gera **automaticamente uma URL
> de _Preview_ para esse branch** (aparece no PR e no painel do Vercel) — ótima
> para enviar ao cliente antes de dar merge. Para a URL de produção
> (`.vercel.app` "oficial"), faça o merge do PR na `main`.

### Opção B — pela linha de comando (Vercel CLI)

Na sua máquina, dentro da pasta do projeto:

```bash
npm i -g vercel     # instala a CLI (uma vez)
vercel login        # abre o navegador para autenticar
vercel              # publica um preview e mostra a URL
vercel --prod       # publica em produção
```

---

## 2. Rodar na sua máquina

Primeiro, baixe o projeto (se ainda não tiver):

```bash
git clone https://github.com/KaikyTorres/Atividades-diversas.git
cd Atividades-diversas
git checkout claude/kawan-mandu-landing-page-r6djdf
```

Depois, escolha **uma** das formas abaixo:

**a) Abrir direto no navegador** — dê dois cliques no arquivo `index.html`.

**b) Servir localmente (recomendado)** — em um terminal, dentro da pasta:

```bash
python3 -m http.server 8000
```

Acesse <http://localhost:8000>. (Se preferir Node: `npx serve` ou `npx http-server`.)

> As fontes (Cormorant/EB Garamond) vêm do Google Fonts, então é necessário
> estar conectado à internet para vê-las exatamente como no design.

---

## 3. Adicionar a foto do advogado

Coloque o retrato em `assets/kawan-mandu.jpg` (proporção ~4:5). Enquanto o
arquivo não existir, a página mostra um espaço reservado com o monograma KMM.
