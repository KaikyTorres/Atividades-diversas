# Assets da Landing Page Smartyng

Coloque aqui os arquivos de imagem da marca. A página (`index.html`) já está
apontando para eles automaticamente — é só adicionar o arquivo com o **nome exato** abaixo.

| Arquivo                | Onde aparece                        | Recomendação                          |
|------------------------|-------------------------------------|---------------------------------------|
| `smartyng-logo.png`    | Logo no topo (nav) e no rodapé      | PNG **com fundo transparente**, quadrado, mín. 200×200px |
| `founder.jpg`          | Seção "Sobre / Fundador"            | Foto quadrada (1:1), mín. 600×600px    |

## Como funciona o fallback

- Se o arquivo **existir**, ele é usado automaticamente.
- Se **não existir**, a página mostra uma alternativa:
  - a logo cai numa versão **SVG vetorial** da marca (nunca fica quebrada);
  - a foto do fundador mostra um espaço reservado até você adicionar `founder.jpg`.

## Como adicionar

1. Renomeie sua imagem para o nome exato da tabela (ex.: `smartyng-logo.png`).
2. Coloque o arquivo dentro desta pasta `assets/`.
3. Faça commit e push. Pronto — a página já usa a imagem.
