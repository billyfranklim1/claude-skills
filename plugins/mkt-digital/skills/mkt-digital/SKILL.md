---
name: mkt-digital
description: Digital marketing, paid traffic, growth, Meta Ads, Google Ads, funnels, copy, metrics, social media, email marketing, SEO
---

# Skill: Marketing Digital & Growth

## Contexto dos Projetos do Billy

### HubNews.ai — Newsletter tech AI
- **Produto**: Agregador de notícias tech com IA, newsletter semanal
- **Público**: Devs, tech founders, early adopters BR + global
- **Modelo**: Freemium. Newsletter gratuita + planos premium (ads, destaques)
- **Meta Ads**: act_861494046890126 | Pixel: 1732385114387631
- **Campanha ativa**: `META_LEADS_Newsletter_2026Q1` — OUTCOME_LEADS, R$15/dia
- **CAPI**: Implementado (`MetaConversionsService.php`) com fbc+fbp+external_id
- **Posicionamento**: "O TechCrunch do Brasil com IA"

### Sistema Reino — SaaS gestão de igrejas
- **Produto**: Plataforma completa para igrejas (membros, financeiro, agenda, relatórios)
- **Público**: Pastores, líderes administrativos, secretarias de igrejas BR
- **Modelo**: SaaS mensal. Trial 14 dias → paywall
- **Meta Ads**: act_929915686667399 | R$30/dia
- **Campanha ativa**: Funil completo — Meta Ads → /cadastrar → trial → 7 emails → paywall
- **Email sequence**: 7 emails (dia 0,3,7,10,13,14,21) via SMTP Hostinger + Redis queue
- **Posicionamento**: "O sistema que pastores precisam, sem complicação"

### Billing
- 100% Asaas (Pix, Boleto, Cartão). Taxas embutidas no preço.

---

## Frameworks Essenciais

### Meta Ads — Estrutura
```
Campanha → Objetivo (Leads / Conversions / Traffic)
  Adset → Audiência + Orçamento + Placement
    Ad → Criativo (imagem/vídeo) + Copy + CTA
```

### Métricas-chave
| Métrica | O que é | Meta ideal |
|---------|---------|-----------|
| CPL | Custo por Lead | < R$5 (newsletter) / < R$15 (SaaS) |
| CPM | Custo por 1k impressões | R$10-30 (BR) |
| CTR | Taxa de cliques | > 1% link click |
| ROAS | Retorno sobre ad spend | > 3x (mínimo) |
| CAC | Custo de aquisição | < 3x LTV/12 |
| LTV | Valor vitalício | MRR médio × meses retidos |

### Funil AIDA → Campanhas
- **Awareness**: Video views, Brand awareness (CPM baixo)
- **Interest/Desire**: Traffic, Engagement (CTR alto)
- **Action**: Leads, Conversions (CPL/CPA otimizado)

---

## Boas Práticas Copy

### Hook (primeiros 3 segundos)
- Dor: "Você ainda gerencia sua igreja em planilha?"
- Curiosidade: "O que os pastores mais bem organizados do BR usam"
- Benefício direto: "Controle total da sua igreja em 5 minutos"

### Estrutura de copy que converte
1. Hook (para o scroll)
2. Problema (amplifica a dor)
3. Solução (seu produto)
4. Prova (depoimento, número, caso)
5. CTA (claro e único)

### CTA eficazes
- "Teste grátis por 14 dias" (baixo risco)
- "Ver como funciona" (curiosidade)
- "Quero receber grátis" (newsletter)

---

## Comandos Úteis

```bash
# Ver métricas das campanhas (via MCP Pipeboard ou Meta API)
# Token: $META_ADS_TOKEN (em /root/.bashrc), expira 21/04/2026

# Contas:
# HubNews:      act_861494046890126
# Sistema Reino: act_929915686667399
# Billy:         act_115573148566140
# Onde Tá o Link: act_209610431149383
```

## Integrações Ativas
- **Meta CAPI**: HubNews — server-side events com deduplicação pixel+CAPI
- **Asaas**: Webhooks de pagamento → events de compra para Meta
- **Email**: Sequência automática via Laravel Queue + Redis
