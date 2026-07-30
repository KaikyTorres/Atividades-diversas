# Prospecção pelo Google Maps — configuração no Google Cloud

O módulo de prospecção do CRM busca empresas no Google Maps (nicho + cidade) e
devolve nome, endereço, telefone, site e nota. Ele não faz isso sozinho: por trás
está a **Places API** do Google, e o Google só responde a quem apresenta uma
**chave de API** de um projeto **com faturamento ativo**.

É essa a configuração que falta. São sete passos, uns 15 minutos, tudo no
console do Google — nada de código.

> Endereço do console: <https://console.cloud.google.com>
> Use a conta Google que vai ser dona da cobrança.

---

## 1. Criar o projeto

1. No topo da tela, clique no seletor de projeto (ao lado do logo "Google Cloud").
2. **Novo projeto**.
3. Nome: algo que você reconheça depois, tipo `prospeccao-crm`.
4. **Criar** e espere a notificação. Volte no seletor e **entre no projeto novo** —
   esse é o erro mais comum daqui pra frente: ativar a API em um projeto e criar
   a chave em outro.

## 2. Ativar o faturamento

Sem isso a API responde `REQUEST_DENIED` e o módulo do CRM vai parecer quebrado.

1. Menu ☰ → **Faturamento**.
2. **Vincular uma conta de faturamento** → criar uma se não tiver.
3. Cartão de crédito. O cartão é exigido mesmo dentro da cota gratuita — é
   verificação, não cobrança.

A cota gratuita é mensal e por tipo de chamada (detalhes no passo 6). Enquanto
você ficar dentro dela, a fatura fecha em zero.

## 3. Ativar as APIs

Menu ☰ → **APIs e serviços** → **Biblioteca**. Busque e clique em **Ativar** em
cada uma:

| API | Para que serve | Obrigatória |
| --- | --- | --- |
| **Places API (New)** | a busca de empresas em si | sim |
| **Places API** (a antiga, sem "New") | CRMs mais velhos ainda chamam a versão legada | ative junto, por segurança |
| **Geocoding API** | transformar o nome da cidade em coordenadas | sim, na prática |
| **Maps JavaScript API** | só se o CRM desenha o mapa na tela | se for o caso |

Ativar uma API não gera custo. Custo vem de chamada feita.

## 4. Criar a chave

1. **APIs e serviços** → **Credenciais**.
2. **+ Criar credenciais** → **Chave de API**.
3. Copie a chave (`AIza...`) e guarde num lugar seguro. Ela é uma senha: quem
   tiver a chave gasta no seu cartão.
4. Não feche ainda — clique em **Editar chave de API** para o passo 5.

## 5. Restringir a chave (não pule)

Chave sem restrição, se vazar, vira fatura. Na tela de edição da chave:

**Restrições de API** — marque **Restringir chave** e selecione só as APIs do
passo 3. Assim, mesmo vazada, ela não serve para nada além disso.

**Restrições de aplicativo** — depende de quem chama o Google:

- **O servidor do CRM chama** (o caso normal): escolha **Endereços IP** e
  coloque o IP de saída do CRM. Não sabe qual é? Pergunte ao suporte do CRM
  qual IP usar na allowlist. Se eles não informarem, deixe **Nenhuma** e confie
  nas restrições de API — funciona, só protege menos.
- **O navegador chama** (o CRM é 100% front-end): **Sites** e coloque o domínio
  do CRM, no formato `https://seucrm.com.br/*`.

**Salvar**. A restrição leva alguns minutos para valer — se der erro logo depois
de salvar, espere 5 minutos antes de sair caçando outro culpado.

## 6. Travar o gasto

Duas coisas diferentes, e a ordem importa:

**Cota — é o que realmente impede a cobrança.**
**APIs e serviços** → escolha *Places API (New)* → aba **Cotas e limites do
sistema**. Procure os limites por dia (`Requests per day` ou equivalente) e
edite para um teto que você aceite, por exemplo `200`. Batendo o teto, a API
para de responder até a virada do dia. É um limite duro.

**Orçamento — só avisa.**
**Faturamento** → **Orçamentos e alertas** → **Criar orçamento**. Defina um valor
(R$ 50, por exemplo) e os alertas em 50%, 90% e 100%. Isso manda e-mail, **não
corta nada**. Serve como rede de segurança, não como trava.

### Quanto isso custa, na prática

A cota gratuita é mensal e separada por tipo de chamada (SKU). O que pesa é
**quais campos** você pede: telefone, site, nota e horário de funcionamento
caem todos no grupo **Enterprise**, o mais caro — e é justamente o que
prospecção precisa.

| Situação | Cota gratuita por mês |
| --- | --- |
| Busca pedindo só nome e endereço (Essentials/Pro) | 5.000 a 10.000 buscas |
| Busca pedindo telefone, site e nota (Enterprise) | **1.000 buscas** |

Passando disso, a ordem de grandeza é de **US$ 32 a US$ 35 por 1.000 buscas**.

Só que cada busca devolve **até 20 empresas**. Então 1.000 buscas gratuitas por
mês dão, na prática, algo perto de **20 mil empresas com telefone e site, de
graça** — folgado para prospecção. Confira os números do dia na
[tabela oficial de preços](https://developers.google.com/maps/billing-and-pricing/pricing),
que a Google mexe de vez em quando.

## 7. Colar no CRM e testar

Cole a chave no campo do módulo de prospecção (costuma se chamar *Google API
Key*, *Google Maps API Key* ou *Places API Key*), salve e rode uma busca de
teste com um nicho e uma cidade que você conheça — dá para conferir o resultado
a olho.

Antes disso, se quiser separar "a chave está errada" de "o CRM está errado",
teste a chave direto:

```sh
./testar-chave.sh SUA_CHAVE_AQUI
```

O script está nesta pasta. Ele busca padarias em Cuiabá e mostra o que o Google
respondeu. Se a chave funciona ali e não funciona no CRM, o problema é
configuração do CRM (ou a restrição de IP do passo 5) — não a chave.

---

## Quando der erro

| O que aparece | O que é |
| --- | --- |
| `REQUEST_DENIED` + "billing" | passo 2 não foi feito, ou a conta de faturamento não vinculou nesse projeto |
| `REQUEST_DENIED` + "API not enabled" | API não ativada, ou ativada em outro projeto (passo 1) |
| `API keys with referer restrictions cannot be used` | a chave está restrita a Sites, mas quem chama é o servidor. Volte no passo 5 e troque para IP ou Nenhuma |
| `The provided API key is expired` / `invalid` | chave errada ou apagada — gere outra |
| `OVER_QUERY_LIMIT` | bateu a cota do passo 6. Suba o teto ou espere a virada do dia |
| `ZERO_RESULTS` | a chave está OK. Não tem resultado para esse termo naquele raio |
| Resultado vem sem telefone/site | o CRM não está pedindo esses campos, ou a conta não tem acesso ao grupo Enterprise. É configuração do CRM |

## Se o CRM pedir Client ID e Client Secret

Aí não é chave de API — é OAuth, e o caminho é outro: **Credenciais** → **Criar
credenciais** → **ID do cliente OAuth**, configurando antes a tela de
consentimento em **Tela de permissão OAuth**. Isso aparece quando o CRM quer
acessar dados *da sua conta* Google (Sheets, Meu Negócio, Contatos), não a busca
pública do Maps. Se o campo do CRM é só um, com nome de "key", é o caminho deste
documento.

## O que a Places API não entrega

- **E-mail não vem.** A Places API não retorna e-mail de empresa, em nenhum
  plano. Quem promete e-mail está raspando o site da empresa depois — outro tipo
  de ferramenta.
- **Máximo de 60 resultados por busca**, em 3 páginas de 20. Para varrer uma
  cidade grande, o jeito é quebrar em buscas por bairro ou por nicho.
- Os dados são os do perfil público no Google Maps: vêm desatualizados quando o
  dono não mantém o perfil.

## Sobre a lista que você vai montar

Telefone de empresa em perfil público é dado de contato profissional, e
prospecção B2B se sustenta no legítimo interesse da LGPD. Duas coisas que valem
o cuidado:

- **MEI e autônomo muitas vezes cadastram o celular pessoal** no perfil. Na
  prática, esse número é dado pessoal.
- Registre de onde veio cada contato (Google Maps, data da busca) e atenda pedido
  de descadastro na hora. Se a pessoa pedir para sair, sai — e não volta na
  próxima varredura.

---

Fontes de preço consultadas em julho de 2026:
[tabela oficial da Google](https://developers.google.com/maps/billing-and-pricing/pricing),
[detalhamento por SKU](https://developers.google.com/maps/billing-and-pricing/sku-details),
[campos por grupo de cobrança](https://developers.google.com/maps/documentation/places/web-service/data-fields).
