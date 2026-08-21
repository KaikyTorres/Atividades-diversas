# LP do grupo "Achadinhos da Cris Fashion"

Landing page de captação para o grupo de WhatsApp da Cris Fashion, com a
promessa de **descontos de até 50%** em peças selecionadas. A visitante
preenche **nome e WhatsApp**, o cadastro vai para o webhook do n8n e ela cai
na página de obrigado, que mostra uma barra de carregamento de **10 segundos**
e então leva ao convite do grupo.

Site estático — HTML, CSS e um arquivo JavaScript. Sem build, sem framework,
sem dependência externa em tempo de execução.

```
cris-fashion/
├── index.html            LP com o formulário
├── obrigado.html         confirmação + contagem de 10s até o grupo
└── assets/
    ├── css/style.css
    ├── js/app.js
    ├── fonts/            fontes hospedadas localmente (SIL OFL 1.1)
    └── img/logo-marca.svg
```

## Identidade visual

Tirada da logo: magenta `#b81b66`, vinho `#6d0d3e`, rosa `#f7d7e6` e branco.
O lockup **Cris** + filete + assinatura *fashion* é montado em HTML/CSS
(`.marca`) com Playfair Display e Parisienne, para acompanhar a logo original.

Quando o arquivo oficial da logo estiver disponível, é só trocar o bloco
`<div class="marca">` por `<img class="marca" src="assets/img/logo-cris-fashion.png" alt="Cris Fashion">`.

## Antes de publicar

Abra `assets/js/app.js` e ajuste o bloco `CONFIG` no topo do arquivo:

| Campo                      | O que é                                                                                          |
| -------------------------- | ------------------------------------------------------------------------------------------------ |
| `endpoint`                 | Webhook que recebe o cadastro (POST JSON). Já aponta para o n8n. Vazio = a página vai direto para a confirmação, sem enviar nada. |
| `paginaObrigado`           | Para onde a visitante vai depois do envio. Padrão: `obrigado.html`.                              |
| `grupo`                    | Convite do grupo no WhatsApp. É o destino do redirecionamento e do botão "Entrar no grupo agora". |
| `segundosRedirecionamento` | Quanto tempo a página de obrigado espera antes de levar ao grupo. Padrão: `10`.                  |
| `origem`                   | Rótulo gravado junto com o lead, útil para separar campanhas.                                     |

O link do grupo também está escrito no `href` do botão em `obrigado.html`, para
funcionar mesmo com o JavaScript desligado. Se trocar o convite, troque nos dois
lugares.

### Formato enviado ao webhook

`POST` com `Content-Type: application/json`:

```json
{
  "nome": "Maria Aparecida",
  "telefone": "11987654321",
  "telefoneFormatado": "(11) 98765-4321",
  "whatsapp": "5511987654321",
  "origem": "lp-achadinhos",
  "grupo": "Achadinhos da Cris Fashion",
  "enviadoEm": "2026-08-21T00:00:00.000Z"
}
```

`whatsapp` já vem com o DDI 55 e só dígitos, pronto para a API do WhatsApp.
O campo `empresa` do formulário é uma armadilha de robô: se vier preenchido,
o envio é descartado no navegador e nada chega ao webhook.

Se o webhook responder erro, a página não trava: o botão volta ao normal e
aparece um aviso com o link direto do grupo, para a visitante não se perder.

## Validação

- **Nome** — obrigatório, mínimo de 2 caracteres.
- **WhatsApp** — máscara `(00) 00000-0000`, DDD a partir de 11 e nono dígito 9
  nos números de 11 dígitos.

## Página de obrigado

A barra de progresso é preenchida por JavaScript ao longo de 10 segundos, com
um contador regressivo ao lado. No fim, o redirecionamento usa
`location.replace()`, então o botão "voltar" do navegador não devolve a
visitante para a contagem.

## Como rodar localmente

```sh
python3 -m http.server 8000
# abra http://localhost:8000/cris-fashion/
```

## Publicação

O workflow `.github/workflows/pages.yml` publica esta pasta em
`/cris-fashion` do GitHub Pages a cada push na `main`.
