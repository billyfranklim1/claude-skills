# Criacao de Criativos Visuais com Nano Banana (Gemini CLI)

## Quando Usar

Use esta referencia sempre que o usuario precisar de:
- Criativos para anuncios (Meta Ads, Google Ads, TikTok, LinkedIn)
- Thumbnails para YouTube ou blog
- Imagens para posts de social media
- Banners, headers, capas
- Icones para apps ou sites
- Diagramas de funil, fluxos, estrategias
- Patterns/texturas para backgrounds
- Edicao ou restauracao de fotos de produto

## Setup (Verificar Antes de Usar)

```bash
# 1. Verificar se a extensao esta instalada
gemini extensions list | grep nanobanana

# 2. Se nao estiver, instalar
gemini extensions install https://github.com/gemini-cli-extensions/nanobanana

# 3. Verificar API key
[ -n "$GEMINI_API_KEY" ] && echo "OK" || echo "Missing GEMINI_API_KEY"
```

## Comandos por Tipo de Criativo

### Criativos para Anuncios

| Plataforma | Dimensao | Comando |
|------------|----------|---------|
| Instagram Feed | 1080x1080 | `gemini --yolo "/generate 'prompt' --aspect=1:1"` |
| Instagram Stories/Reels | 1080x1920 | `gemini --yolo "/generate 'prompt' --aspect=9:16"` |
| Facebook Feed | 1200x630 | `gemini --yolo "/generate 'prompt'"` |
| Google Display | 300x250 / 728x90 | `gemini --yolo "/generate 'prompt'"` |
| YouTube Thumbnail | 1280x720 | `gemini --yolo "/generate 'prompt' --aspect=16:9"` |
| LinkedIn Post | 1200x627 | `gemini --yolo "/generate 'prompt'"` |
| TikTok | 1080x1920 | `gemini --yolo "/generate 'prompt' --aspect=9:16"` |

### Tipos de Criativos de Marketing

```bash
# Criativo de produto (e-commerce)
gemini --yolo "/generate 'professional product photo of [produto] on clean white background, studio lighting, commercial photography style, no text' --preview"

# Criativo estilo lifestyle
gemini --yolo "/generate 'lifestyle photo of person using [produto] in [cenario], natural lighting, authentic feel, editorial style, no text' --count=3"

# Criativo com urgencia/escassez (para promos)
gemini --yolo "/generate 'bold graphic design with vibrant red and yellow accents, modern sale promotion layout, clean minimalist style, geometric shapes, no text' --preview"

# Criativo para lead magnet / ebook
gemini --yolo "/generate 'professional ebook cover mockup, modern gradient background in [cores da marca], 3D book perspective, clean typography space, no text' --preview"

# Criativo para webinar / evento
gemini --yolo "/generate 'modern event promotional graphic, professional speaker silhouette, dark background with [cor] accent lights, corporate style, no text' --preview"

# Criativo para depoimento/prova social
gemini --yolo "/generate 'clean testimonial card design, soft background, quote marks graphic element, professional and trustworthy style, no text' --preview"
```

### Icones e Elementos Graficos

```bash
# Icone para app ou servico
gemini --yolo "/icon 'minimalist icon for [descricao]' --sizes='64,128,256,512' --type='app-icon' --corners='rounded'"

# Icones para destaques do Instagram
gemini --yolo "/icon 'minimalist line icon of [tema], pastel [cor] background, Instagram highlight cover style' --count=5"
```

### Diagramas de Marketing

```bash
# Funil de vendas visual
gemini --yolo "/diagram 'sales funnel with 4 stages: awareness, interest, decision, action' --type='funnel' --style='modern'"

# Fluxo de automacao
gemini --yolo "/diagram 'email automation workflow: lead capture to welcome series to segmentation to conversion' --type='flowchart' --style='modern'"

# Jornada do cliente
gemini --yolo "/diagram 'customer journey map from discovery to advocacy, 5 stages with touchpoints' --type='journey-map'"
```

## Estrategia de Criativos por Plataforma

### Meta Ads (Instagram/Facebook)

**Formatos que mais convertem:**
1. **Carrossel** - Conte uma historia em 3-5 slides (gere cada slide separado)
2. **Imagem unica com contraste** - Destaque visual no feed
3. **Antes/Depois** - Gere os dois estados
4. **UGC-style** - Estilo "foto real", menos polido

**Dicas de prompt para Meta:**
- Adicione "shot on iPhone, natural lighting" para estilo UGC
- Use "bold colors, high contrast" para destacar no feed
- Evite texto na imagem (regra dos 20% do Facebook)
- Sempre inclua "no text" no prompt

### Google Ads (Display)

**Formatos essenciais:**
- Banner retangulo: 300x250
- Leaderboard: 728x90
- Skyscraper: 160x600

**Dicas de prompt para Display:**
- "clean minimal design with clear focal point"
- Deixe espaco para texto/CTA que sera adicionado depois
- Use cores contrastantes com o fundo

### TikTok Ads

**Estilo que funciona:**
- NAO pareca anuncio — pareca conteudo organico
- "candid smartphone photo style, casual, authentic"
- Vertical (9:16) obrigatorio

### LinkedIn Ads

**Estilo profissional:**
- "corporate professional style, clean design, business context"
- Tons de azul, branco e cinza funcionam bem
- Dados e graficos como elemento visual

## Workflow de Criacao de Criativos

```
1. BRIEFING → Entender objetivo, plataforma, publico, tom de voz
2. REFERENCIAS → Analisar o que concorrentes fazem (references/analise-competitiva.md)
3. GERAR → Criar 3+ variacoes com Nano Banana
4. SELECIONAR → Apresentar opcoes ao usuario
5. REFINAR → Ajustar com /edit baseado no feedback
6. ENTREGAR → Organizar por plataforma e dimensao
```

## Variacoes para Teste A/B de Criativos

Sempre gere multiplas variacoes para teste:

```bash
# Variacao 1: Foco no produto
gemini --yolo "/generate 'close-up product shot of [produto], clean background, studio quality, no text' --preview"

# Variacao 2: Foco no beneficio/lifestyle
gemini --yolo "/generate 'happy person experiencing benefit of [produto], natural setting, warm lighting, no text' --preview"

# Variacao 3: Foco na dor/problema
gemini --yolo "/generate 'visual metaphor for [problema que resolve], dramatic lighting, emotional impact, no text' --preview"
```

**O que testar primeiro (prioridade):**
1. Imagem do produto vs. imagem lifestyle (maior impacto)
2. Cores quentes vs. cores frias
3. Close-up vs. plano aberto
4. Estilo polido vs. estilo UGC

## Refinamento de Imagens

```bash
# Ajustar estilo
gemini --yolo "/edit nanobanana-output/imagem.png 'make colors more vibrant and add warm tone'"

# Remover fundo
gemini --yolo "/edit nanobanana-output/imagem.png 'remove background, make transparent'"

# Ajustar composicao
gemini --yolo "/edit nanobanana-output/imagem.png 'move main subject to left third, add space on right for text'"

# Restaurar/melhorar foto do usuario
gemini --yolo "/restore foto-produto.jpg 'enhance lighting, sharpen details, improve colors'"
```

## Modelo de Qualidade

```bash
# Padrao (rapido e barato ~$0.04/imagem) — use para rascunhos
# Modelo: gemini-2.5-flash-image

# Alta qualidade (4K, melhor resultado) — use para versao final
export NANOBANANA_MODEL=gemini-3-pro-image-preview
```

**Recomendacao:** Comece com o modelo padrao para explorar ideias, depois gere a versao final com o modelo pro.

## Checklist de Criativo Profissional

- [ ] Dimensao correta para a plataforma?
- [ ] Sem texto excessivo na imagem (regra Meta)?
- [ ] Contraste suficiente para visualizacao mobile?
- [ ] Espaco para CTA/texto overlay se necessario?
- [ ] Consistente com identidade visual da marca?
- [ ] Gerou pelo menos 3 variacoes para teste A/B?
- [ ] Versao vertical E horizontal quando necessario?

## Saida dos Arquivos

Todos os arquivos gerados ficam em `./nanobanana-output/`. Apos gerar:
1. Liste os arquivos gerados
2. Apresente ao usuario
3. Ofereca variacoes ou ajustes
4. Copie os finais para a pasta de saida do usuario
