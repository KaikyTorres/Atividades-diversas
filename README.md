# Kawan Mandú · Mandú Marques Advocacia — Landing Page

Landing page institucional e clássica do advogado **Kawan Mandú**
(Kawan Mandú Sociedade Individual de Advocacia — OAB/SP nº 67.323),
construída sobre a identidade visual da marca **Mandú Marques Advocacia**.

## Identidade visual

- **Tipografia:** Cormorant Garamond (marca e títulos) · EB Garamond (corpo)
- **Paleta:** Marinho `#1b2b3e` · Creme `#fcfaf3` · Tinta `#2a2d33` · Cinza `#6a7079`
- **Monograma:** KMM

## Estrutura

| Arquivo | Descrição |
| --- | --- |
| `index.html` | Página única (topo, hero, credenciais, sobre, áreas de atuação, contato, rodapé) |
| `styles.css` | Estilos e responsividade |
| `assets/` | Monograma, favicon e retrato |

## Foto do advogado

O retrato do hero espera o arquivo **`assets/kawan-mandu.jpg`** (proporção
recomendada 4:5). Enquanto o arquivo não existir, um espaço reservado com o
monograma KMM é exibido automaticamente. Basta adicionar a imagem com esse
nome para que ela apareça.

## Como visualizar

Abra `index.html` no navegador ou sirva a pasta localmente:

```bash
python3 -m http.server 8000
# acesse http://localhost:8000
```

As fontes são carregadas via Google Fonts (requer conexão com a internet).
