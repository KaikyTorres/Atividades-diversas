# GK One Prime — LP do grupo de promoções Apple

Duas páginas: um formulário de captação e uma página de obrigado que leva ao
grupo do WhatsApp depois de 10 segundos.

```
gkoneprime/
├── index.html                       página 1 — formulário (arquivo completo)
├── obrigado.html                    página 2 — contagem de 10s (arquivo completo)
└── wordpress/
    ├── pagina-formulario.html       página 1 — bloco pronto pro WordPress
    └── pagina-obrigado.html         página 2 — bloco pronto pro WordPress
```

Os arquivos da raiz são páginas inteiras (servem para hospedar direto, testar no
navegador ou subir em qualquer servidor). Os de `wordpress/` são o mesmo conteúdo
sem `<html>`/`<head>`/`<body>`, com todo o CSS preso ao container `.gk-palco` —
nada vaza para o tema do site.

Nenhum dos arquivos depende de plugin, biblioteca ou imagem externa: HTML, CSS e
JavaScript embutidos, com a marca desenhada em SVG.

## Publicar no WordPress

1. **Crie a página de obrigado.** Nova página, título "Obrigado", slug `obrigado`.
   Adicione um bloco **HTML personalizado** e cole todo o conteúdo de
   `wordpress/pagina-obrigado.html`. Em Configurações da página, marque
   "Não permitir indexação" (é uma página interna de funil).
2. **Crie a página do formulário.** Nova página, adicione um bloco
   **HTML personalizado** e cole `wordpress/pagina-formulario.html`.
3. **Confira o destino.** No bloco do formulário, dentro de `CONFIG`, o campo
   `paginaObrigado` está como `'/obrigado'`. Se o slug da sua página for outro,
   ajuste ali.
4. **Coloque o logo oficial.** Suba o arquivo na Biblioteca de Mídia e cole a URL
   no campo `logo` do `CONFIG`, nos dois blocos (veja "Identidade visual").
5. Use um template de página **em branco / largura total**, se o tema tiver. Não
   é obrigatório: o bloco já se estica para a largura da tela sozinho.

No Elementor, use o widget **HTML** no lugar do bloco — o conteúdo é o mesmo.

> O bloco "HTML personalizado" preserva `<style>` e `<script>` para usuários
> administradores. Se o seu perfil for editor e o script sumir ao salvar, peça a
> um administrador para colar, ou use o widget HTML do Elementor.

## Webhook

O formulário envia um POST em JSON para:

```
https://n8n.usekaycrm.com/webhook-test/faabc4d1-d4c3-44d0-93b1-0110c8b643b4
```

Corpo enviado:

```json
{
  "nome": "Kaiky Torres",
  "telefone": "11987654321",
  "telefoneFormatado": "(11) 98765-4321",
  "whatsapp": "5511987654321",
  "email": "kaiky@email.com",
  "origem": "lp-grupo-apple",
  "pagina": "https://…",
  "referencia": "https://…",
  "enviadoEm": "2026-08-25T18:00:00.000Z",
  "utm": { "utm_source": "…", "utm_campaign": "…" }
}
```

Dois pontos de atenção no n8n:

- **A URL `/webhook-test/` é a de teste.** Ela só aceita chamadas enquanto o
  fluxo está com "Listen for test event" ligado, e aceita uma por vez. Quando o
  fluxo for ativado, troque `webhook-test` por `webhook` no `CONFIG` das duas
  páginas.
- **CORS.** No nó Webhook, deixe "Allowed Origins (CORS)" como `*` ou com o
  domínio do site. Se mesmo assim o navegador bloquear, a página reenvia o lead
  em modo `no-cors` (o n8n recebe, o navegador só não lê a resposta).

O visitante nunca fica preso esperando: passados 4 segundos sem resposta do
webhook, ele segue para a página de obrigado do mesmo jeito.

## Página de obrigado

- Contagem regressiva de 10 segundos, com anel de progresso.
- Botão verde para entrar no grupo a qualquer momento.
- No fim da contagem, o navegador é redirecionado para o grupo automaticamente.
- Quem clica no botão antes do fim não é redirecionado por cima da aba aberta.
- O primeiro nome de quem preencheu o formulário aparece no título (vem por
  `sessionStorage`; se não houver, o título padrão é usado).

Grupo configurado nas duas páginas (campo `grupo` do `CONFIG`):
`https://chat.whatsapp.com/BZwaulEmiiG0mT3qSnnvx3?s=sw&p=i&mlu=4`

## Identidade visual

Azul-marinho profundo com gradientes prata e azul metálico, no mesmo tom da
marca. A cor base fica nas variáveis do topo do CSS (`--azul-fundo`,
`--azul-marca`, `--texto`…).

A marca vem desenhada em SVG dentro das páginas, para nada depender de arquivo
externo. Para usar o logo oficial, preencha `logo` no `CONFIG` das **duas**
páginas com a URL da imagem:

```js
logo: 'https://seusite.com.br/wp-content/uploads/2026/08/gk-one-prime.png',
```

Preenchido, o logo entra no lugar do SVG. Vazio, a marca desenhada continua
valendo — nenhuma página quebra por falta do arquivo.

No WordPress: Mídia → Adicionar nova, suba o PNG, copie a URL do arquivo e cole
nos dois blocos. Use o PNG com fundo transparente, se tiver; o fundo do site já
é azul-marinho.

## Alterar os textos

Tudo que aparece na tela está no HTML, em português, sem template engine.
Título, chamada, itens (`iPhone`, `MacBook`…) e avisos podem ser editados
direto no bloco.
