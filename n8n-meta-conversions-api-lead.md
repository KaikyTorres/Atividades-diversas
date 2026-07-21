# Fluxo n8n → Meta Conversions API (múltiplos eventos)

Fluxo que recebe o preenchimento da LP via webhook e envia **4 eventos** para a
**Meta Conversions API (CAPI)**, cada um em seu próprio nó HTTP para ficar fácil de editar:

```
Webhook LP → Preparar Dados → Contact → Add to Cart → Initiate Checkout → Purchase
```

- **Preparar Dados** (nó Code): faz o hash SHA-256 dos dados pessoais (email, telefone,
  nome, sobrenome) e monta o corpo de cada evento. O SHA-256 é implementado em
  **JavaScript puro**, sem `require('crypto')` — porque a instância do n8n bloqueia esse módulo.
- **Contact / Add to Cart / Initiate Checkout / Purchase**: um nó HTTP por evento.
  Os três de fundo de funil vão com `value: 30.00` e `currency: "BRL"`.

## Como importar

1. Copie todo o conteúdo de `n8n-meta-conversions-api-lead.json`.
2. No n8n, abra um workflow em branco e cole (Ctrl+V) na tela.

## O que editar

Em **cada** nó HTTP (Contact, Add to Cart, Initiate Checkout, Purchase),
no parâmetro de query `access_token`, troque `SEU_ACCESS_TOKEN` pelo seu token
da Conversions API. O Pixel ID (`695612119892863`) já está preenchido na URL.

Para mudar o valor ou a moeda, edite `VALOR` e `MOEDA` no topo do nó **Preparar Dados**.

## Dados enviados (por evento)

| Campo Meta | Origem | Hash SHA-256? |
|---|---|---|
| `em` (email) | `body.email` | sim |
| `ph` (telefone) | `body.numero` (só dígitos) | sim |
| `fn` (nome) | `body.nome` | sim |
| `ln` (sobrenome) | `body.sobrenome` | sim |
| `client_ip_address` | header `x-forwarded-for` | não |
| `client_user_agent` | header `user-agent` | não |
| `event_source_url` | header `referer`/`origin` | não |
| `event_id` | gerado (UUID) | não |
| `custom_data.value` / `currency` | `30.00` / `BRL` (só AddToCart, InitiateCheckout, Purchase) | não |

## Testar antes

1. Na aba **Test Events** do Gerenciador de Eventos, copie o código `TEST...`.
2. No nó **Preparar Dados**, adicione `test_event_code` ao objeto retornado (dentro de cada payload).
3. Preencha a LP e veja os eventos aparecerem em tempo real.

## Observação importante

Disparar `Purchase` em todo lead (sem compra real) infla suas conversões e pode
gerar otimização ruim / problema com as políticas da Meta. Se a intenção é aquecer
o pixel, ok; se `Purchase` deveria ocorrer só na compra real, o ideal é remover esse
nó daqui e disparar `Purchase` a partir do webhook do checkout/gateway.
