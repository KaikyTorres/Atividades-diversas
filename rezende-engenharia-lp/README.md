# LP de consulta do CAR — Rezende Engenharia & Consultoria

Landing page de cadastro para captar produtores rurais que querem saber a
situação do CAR (Cadastro Ambiental Rural) da fazenda. O visitante informa
**nome, telefone e CPF**; a equipe faz a consulta e devolve o resultado pelo
WhatsApp.

Site estático: só HTML, CSS e um arquivo JavaScript. Não precisa de build,
nem de framework, nem de dependência externa em tempo de execução.

```
rezende-engenharia-lp/
├── index.html
└── assets/
    ├── css/style.css
    ├── js/app.js
    ├── fonts/            fontes hospedadas localmente (SIL OFL 1.1)
    └── img/logo-marca.svg
```

## Antes de publicar

Abra `assets/js/app.js` e ajuste o bloco `CONFIG` no topo do arquivo:

| Campo      | O que é                                                                 |
| ---------- | ----------------------------------------------------------------------- |
| `endpoint` | URL que recebe o lead (POST JSON). Vazio = a página cai no envio manual pelo WhatsApp. |
| `whatsapp` | Número oficial da Rezende, só dígitos, com DDI 55. **Hoje está com um valor de exemplo (`5500000000000`) e precisa ser trocado.** |
| `origem`   | Rótulo gravado junto com o lead, útil para separar campanhas.            |

### Formato enviado ao `endpoint`

```json
{
  "nome": "Maria Aparecida Rezende",
  "telefone": "65999887766",
  "telefoneFormatado": "(65) 99988-7766",
  "cpf": "52998224725",
  "cpfFormatado": "529.982.247-25",
  "consentimento": true,
  "origem": "lp-car"
}
```

Qualquer resposta HTTP 2xx conta como sucesso e mostra a tela de confirmação.
Erro de rede ou status fora da faixa 2xx mostra o aviso de falha e oferece o
WhatsApp como saída.

Serve qualquer coisa que aceite um POST JSON: uma rota própria, um webhook do
n8n/Make/Zapier, ou uma função serverless que grava o lead e dispara a consulta
no SICAR.

## Publicação

Suba a pasta em qualquer hospedagem estática (Vercel, Netlify, GitHub Pages,
S3, cPanel). Duas coisas são obrigatórias:

- **HTTPS.** A página trafega CPF; sem TLS o dado vai em claro.
- **Endpoint no seu domínio ou com CORS liberado** para o domínio da LP.

## Sobre os dados

O formulário coleta CPF, que é dado pessoal sob a LGPD. O que já está feito na
página: caixa de consentimento obrigatória, finalidade declarada em texto e
nenhum armazenamento no navegador (sem `localStorage`, sem cookie). O resto
depende do backend — guarde o mínimo, pelo tempo necessário, e não registre CPF
em log de acesso.

Quando não há `endpoint` configurado, o envio abre o WhatsApp com os dados na
mensagem. É o próprio visitante mandando os dados para a Rezende, mas vale
saber que a mensagem passa pela infraestrutura do WhatsApp.

## Marca

O `assets/img/logo-marca.svg` é uma reconstrução do selo circular da Rezende
(esfera verde com anel lima). Para usar o arquivo oficial, troque o SVG por
`logo-marca.png` na pasta `assets/img/` e atualize os três `<img>` do
`index.html` — as dimensões já estão definidas no CSS.

Paleta usada, tirada da marca:

| Cor          | Hex       | Onde aparece                          |
| ------------ | --------- | ------------------------------------- |
| Verde mata   | `#04381A` | fundo, cartões escuros                |
| Verde fundo  | `#063F1D` | fundo da página                       |
| Verde cerrado| `#0A6B2E` | botão principal, foco de campo        |
| Lima         | `#C7E534` | anel do selo, etiquetas, CTA claro    |
| Osso         | `#F1F4E6` | cartão do formulário, texto           |
| Alerta       | `#FF6A3D` | sobreposição no mapa, status rejeitado|

Tipografia: Bricolage Grotesque (títulos), Instrument Sans (texto), Azeret Mono
(rótulos e dados de cadastro). As três estão em `assets/fonts/` sob licença
SIL Open Font License 1.1.

## Validações do formulário

- **Nome** — exige nome e sobrenome.
- **Telefone** — máscara automática, DDD válido e celular começando com 9.
- **CPF** — máscara automática e conferência dos dois dígitos verificadores.
- **Consentimento** — obrigatório.
- Campo-armadilha invisível (`empresa`) descarta envio de robô.

A ilustração do perímetro no topo é um **imóvel de exemplo**, não o resultado de
nenhuma consulta — está rotulada assim na própria página.
