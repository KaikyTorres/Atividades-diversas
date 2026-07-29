# LP de consulta do CAR — Rezende Engenharia & Consultoria

Landing page de cadastro: uma tela só, com a chamada e o formulário de **nome,
telefone e CPF**. A equipe faz a consulta do CAR e devolve o resultado pelo
WhatsApp.

Site estático — HTML, CSS e um arquivo JavaScript. Sem build, sem framework,
sem dependência externa em tempo de execução.

```
rezende/
├── index.html            formulário
├── obrigado.html         confirmação, depois do envio
└── assets/
    ├── css/style.css
    ├── js/app.js
    ├── fonts/            fontes hospedadas localmente (SIL OFL 1.1)
    └── img/logo-marca.svg
```

## Antes de publicar

Abra `assets/js/app.js` e ajuste o bloco `CONFIG` no topo do arquivo:

| Campo            | O que é                                                                 |
| ---------------- | ----------------------------------------------------------------------- |
| `endpoint`       | Webhook que recebe o lead (POST JSON). Já aponta para o n8n. Vazio = a página vai direto para a confirmação, sem enviar nada. |
| `paginaObrigado` | Para onde o visitante vai depois do envio. Padrão: `obrigado.html`.      |
| `whatsapp`       | Número oficial da Rezende, só dígitos, com DDI 55. **Hoje está com um valor de exemplo (`5500000000000`) e precisa ser trocado.** |
| `origem`         | Rótulo gravado junto com o lead, útil para separar campanhas.            |

### Formato enviado ao webhook

`POST` com `Content-Type: application/json`:

```json
{
  "nome": "Maria Aparecida Rezende",
  "telefone": "65999887766",
  "telefoneFormatado": "(65) 99988-7766",
  "cpf": "52998224725",
  "cpfFormatado": "529.982.247-25",
  "origem": "lp-car"
}
```

Qualquer resposta HTTP 2xx leva o visitante para `obrigado.html`. Erro de rede
ou status fora da faixa 2xx mantém o visitante no formulário, com os dados
preenchidos, e mostra um botão para mandar os mesmos dados pelo WhatsApp.

### CORS no n8n

O navegador chama o webhook a partir do domínio da LP, então o **nó Webhook do
n8n precisa liberar essa origem**: abra o nó, vá em *Options* → *Allowed Origins
(CORS)* e coloque o domínio da landing page (ou `*` para testar). Sem isso o
navegador barra a resposta, o envio aparece como falha e o visitante não chega
na página de obrigado — mesmo que o n8n tenha recebido o lead.

Vale disparar um cadastro de teste depois de publicar e conferir se ele chegou
no fluxo.

## Publicação

O repositório publica esta pasta no GitHub Pages a cada push na `main`, pelo
workflow `.github/workflows/pages.yml`. A LP fica em `/rezende`.

Para hospedar em outro lugar (Vercel, Netlify, S3, cPanel), suba a pasta como
está. Duas coisas são obrigatórias:

- **HTTPS.** A página trafega CPF; sem TLS o dado vai em claro.
- **Endpoint no seu domínio ou com CORS liberado** para o domínio da LP.

## Sobre os dados

O formulário coleta CPF, que é dado pessoal sob a LGPD. A página declara a
finalidade e a autorização no texto abaixo do botão e não guarda nada no
navegador (sem `localStorage`, sem cookie). O resto depende do backend: guarde
o mínimo, pelo tempo necessário, e não registre CPF em log de acesso.

Quando o envio ao webhook falha, a página oferece o WhatsApp com os dados já na
mensagem. É o próprio visitante mandando os dados para a Rezende, mas vale saber
que a mensagem passa pela infraestrutura do WhatsApp.

A página de obrigado não recebe nome, telefone nem CPF pela URL — nada de dado
pessoal em histórico de navegador, log de servidor ou `Referer`.

## Validações do formulário

- **Nome** — exige nome e sobrenome.
- **Telefone** — máscara automática, DDD válido e celular começando com 9.
- **CPF** — máscara automática e conferência dos dois dígitos verificadores.
- Campo-armadilha invisível (`empresa`) descarta envio de robô.

## Marca

O selo no topo da página é uma **reconstrução** do logo da Rezende, montado em
HTML e CSS: círculo com degradê verde, anel lima, o ícone de blocos, a palavra
"rezende" e a linha "engenharia & consultoria". Chega perto do original, mas não
é o arquivo oficial.

**Para usar o logo de verdade**, coloque o arquivo em `assets/img/` e troque o
bloco `<div class="selo">` do `index.html` por:

```html
<img class="selo" src="assets/img/logo-rezende.png"
     alt="Rezende Engenharia &amp; Consultoria">
```

O CSS da classe `.selo` já cuida do tamanho e da centralização; num `<img>`,
apague de `.selo` as propriedades `border`, `background`, `display`,
`flex-direction`, `align-items`, `justify-content` e `text-shadow` — o resto
serve para os dois casos. Vale trocar também o `assets/img/logo-marca.svg`, que
é o favicon e a imagem de compartilhamento.

Paleta usada, tirada da marca:

| Cor           | Hex       | Onde aparece                     |
| ------------- | --------- | -------------------------------- |
| Verde fundo   | `#063F1D` | fundo da página                  |
| Verde cerrado | `#0A6B2E` | botão principal, foco de campo   |
| Lima          | `#C7E534` | anel do selo, botão do WhatsApp  |
| Osso          | `#F1F4E6` | cartão do formulário, texto      |
| Alerta        | `#FF6A3D` | a palavra "rejeitado" no título  |

Tipografia: Bricolage Grotesque (títulos), Instrument Sans (texto), Azeret Mono
(rótulos dos campos). As três estão em `assets/fonts/` sob licença SIL Open
Font License 1.1.

## Versão para Elementor / WordPress

`elementor/1-formulario.html` e `elementor/2-obrigado.html` são a mesma página
em bloco único, para colar num widget **HTML** do Elementor. Diferenças em
relação aos arquivos da raiz:

- CSS e JavaScript embutidos; nada de `assets/`.
- Fontes vêm do Google Fonts por `@import`, em vez dos arquivos locais.
- Tudo isolado na classe `.rz-lp`, com um reset na frente para o CSS do tema não
  vazar para dentro da página (fonte, cor, caixa alta, letter-spacing).
- Sem `<!DOCTYPE>`, `<head>` ou `<body>`: o widget do Elementor descarta essas
  tags e o CSS junto com elas.
- `paginaObrigado` aponta para `https://smartyng.com/lp-rezende-form-obg`, a
  página de confirmação no WordPress.

Os dois blocos carregam o mesmo `CONFIG`, então o número do WhatsApp precisa ser
trocado nos dois arquivos.
