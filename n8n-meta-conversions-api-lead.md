# Fluxo n8n → Meta Conversions API (evento Lead)

Fluxo que recebe o preenchimento da LP via webhook e envia os dados para a
**Meta Conversions API (CAPI)** como evento `Lead`, com todos os dados de
match possíveis e hash SHA-256 nos dados pessoais (exigência da Meta).

## Como importar

1. Abra o arquivo `n8n-meta-conversions-api-lead.json`, copie **todo** o conteúdo.
2. No n8n, abra um workflow em branco e simplesmente **cole** (Ctrl+V) na tela.
3. Os 3 nós aparecem já conectados: `Webhook LP → Montar Payload Meta → Enviar para Meta CAPI`.

## O que você precisa editar (só 2 coisas)

No nó **Enviar para Meta CAPI**:

1. Na **URL**, troque `SEU_PIXEL_ID` pelo ID do seu Pixel:
   ```
   https://graph.facebook.com/v21.0/SEU_PIXEL_ID/events
   ```
2. No parâmetro de query `access_token`, troque `SEU_ACCESS_TOKEN` pelo token
   de acesso da Conversions API (gerado no Gerenciador de Eventos → Configurações → Conversions API).

> O caminho do webhook já vem com o mesmo ID que você usa hoje
> (`5ceaaf18-8d5d-4839-bedf-f014756b4a30`), então a URL de recebimento não muda.

## Dados enviados para a Meta

| Campo Meta | Origem | Hash SHA-256? |
|---|---|---|
| `em` (email) | `body.email` | sim (trim + minúsculo) |
| `ph` (telefone) | `body.numero` | sim (só dígitos, com DDI) |
| `fn` (nome) | `body.nome` | sim (trim + minúsculo) |
| `ln` (sobrenome) | `body.sobrenome` | sim (trim + minúsculo) |
| `client_ip_address` | header `x-forwarded-for` | não |
| `client_user_agent` | header `user-agent` | não |
| `event_source_url` | header `referer`/`origin` | não |
| `event_id` | gerado (UUID) | não |

O evento é enviado como `Lead`, `action_source: "website"`, com `event_time`
no momento do recebimento.

## Testar antes de subir

1. Na aba **Test Events** do Gerenciador de Eventos, copie o código `TEST...`.
2. No nó **Montar Payload Meta**, descomente a linha `test_event_code` e cole o código.
3. Preencha a LP (ou dispare o webhook manualmente) e veja o evento aparecer em tempo real.
4. Confirme que está tudo certo e **remova/comente** de novo o `test_event_code` para produção.

## Observações

- `fbp` e `fbc` (cookies do Pixel) não são enviados porque não vêm no webhook.
  Se quiser máxima qualidade de match, dá para capturar esses cookies no
  navegador e incluí-los no `body`; aí é só mapear no nó de código
  (`userData.fbp` / `userData.fbc`, **sem** hash).
- A versão da API está em `v21.0`; pode atualizar conforme a Meta libera novas.
