# Frameworks de Growth - Guia de Referencia

## 1. Funil AARRR (Metricas Pirata)

O framework mais usado em growth. Mapeia toda a jornada do cliente.

```
AQUISICAO → Como as pessoas descobrem voce?
    ↓
ATIVACAO → Elas tem uma boa primeira experiencia?
    ↓
RETENCAO → Elas voltam? Continuam usando/comprando?
    ↓
RECEITA → Elas pagam? Quanto?
    ↓
REFERENCIA → Elas indicam para outras pessoas?
```

### Como usar na pratica

Para cada etapa, defina:
- Metrica principal (o numero que importa)
- Meta (onde quer chegar)
- Acoes para melhorar
- Experimentos para testar

**Exemplo para e-commerce:**
| Etapa | Metrica | Meta | Acao |
|-------|---------|------|------|
| Aquisicao | Visitantes/mes | 10.000 | Meta Ads + SEO |
| Ativacao | % que adiciona ao carrinho | 8% | Melhorar pagina do produto |
| Retencao | % que compra de novo em 90d | 20% | Email marketing + desconto |
| Receita | Ticket medio | R$ 150 | Cross-sell e upsell |
| Referencia | % que indica | 5% | Programa de indicacao |

## 2. North Star Metric (NSM)

A UNICA metrica que melhor representa o valor que seu produto entrega ao cliente.
Se essa metrica cresce, o negocio cresce.

### Como escolher sua North Star Metric

Ela deve:
- Refletir o valor entregue ao cliente (nao so receita)
- Ser mensuravel e acionavel
- Ser um indicador lider (antecipa resultados futuros)

**Exemplos por tipo de negocio:**
| Tipo de Negocio | North Star Metric |
|----------------|-------------------|
| E-commerce | Numero de compras concluidas por semana |
| SaaS | Usuarios ativos semanais |
| Marketplace | Transacoes concluidas por mes |
| Infoproduto | Alunos que completam 50% do curso |
| Servico local | Agendamentos confirmados por semana |
| App | Sessoes diarias por usuario |

### Quebrando a NSM em metricas de entrada

```
North Star Metric
├── Metrica de entrada 1 (trafego)
├── Metrica de entrada 2 (conversao)
├── Metrica de entrada 3 (retencao)
└── Metrica de entrada 4 (expansao)
```

**Exemplo:** NSM = Vendas/semana
- Entrada 1: Visitantes no site
- Entrada 2: Taxa de conversao
- Entrada 3: Taxa de recompra
- Entrada 4: Ticket medio

## 3. ICE Score - Priorizacao de Experimentos

Quando voce tem muitas ideias e precisa decidir por onde comecar.

**I = Impacto** (1-10): Se der certo, quanto vai impactar o resultado?
**C = Confianca** (1-10): Qual sua confianca de que vai funcionar?
**E = Facilidade** (1-10): Quao facil/rapido e implementar?

**Score = (I + C + E) / 3**

### Exemplo pratico

| Experimento | I | C | E | Score | Prioridade |
|-------------|---|---|---|-------|------------|
| Mudar cor do botao CTA | 3 | 4 | 9 | 5.3 | 3o |
| Criar video para anuncio | 8 | 7 | 5 | 6.7 | 2o |
| Oferecer frete gratis acima de R$99 | 9 | 8 | 8 | 8.3 | 1o |
| Redesenhar toda a home | 7 | 5 | 2 | 4.7 | 4o |

Regra: Sempre execute primeiro os de score mais alto.

## 4. Growth Loops

Diferente de funis (que tem comeco e fim), loops sao ciclos que se auto-alimentam.

### Loop de Conteudo
```
Criar conteudo → Pessoas encontram (SEO/Social)
      ↑                    ↓
Mais autoridade ← Pessoas seguem/engajam
```

### Loop Viral
```
Usuario usa produto → Tem boa experiencia
        ↑                     ↓
Novo usuario entra ← Indica para amigos
```

### Loop Pago
```
Investir em ads → Adquirir clientes
       ↑                  ↓
Reinvestir lucro ← Cliente gera receita
```

O mais poderoso para iniciantes e o **Loop Pago**, porque e o mais previsivel
e controlavel. A meta e fazer o ROAS ser positivo o suficiente para reinvestir.

## 5. Modelo de Experimentacao

Para cada experimento de growth, documente:

```
HIPOTESE: Se [acao], entao [resultado esperado], porque [razao]
METRICA: O que vamos medir?
DURACAO: Quanto tempo vai rodar?
TAMANHO: Quantas pessoas/quanto investimento?
RESULTADO: O que aconteceu?
APRENDIZADO: O que aprendemos?
PROXIMO PASSO: O que fazer com base nisso?
```

**Exemplo:**
```
HIPOTESE: Se adicionarmos depoimentos na landing page, a taxa de conversao
          vai subir de 3% para 5%, porque prova social gera confianca.
METRICA: Taxa de conversao da LP
DURACAO: 14 dias
TAMANHO: 1.000 visitantes por versao (teste A/B)
RESULTADO: Versao com depoimentos: 4.2% vs sem: 3.1%
APRENDIZADO: Prova social funciona, mas nao tanto quanto esperado.
             Testar video-depoimento pode ter mais impacto.
PROXIMO PASSO: Criar video com cliente real e testar.
```

## 6. Fases de Crescimento

### Fase 1: Validacao (0 a primeiras vendas)
- Foco: Product-Market Fit
- Acao: Testar oferta com orcamento minimo
- Meta: Conseguir primeiros clientes pagantes
- Orcamento sugerido: R$ 500 - R$ 1.500/mes

### Fase 2: Tracao (primeiras vendas a consistencia)
- Foco: Encontrar canal de aquisicao escalavel
- Acao: Testar 2-3 canais, dobrar no que funciona
- Meta: CPA previsivel e ROAS positivo consistente
- Orcamento sugerido: R$ 1.500 - R$ 5.000/mes

### Fase 3: Escala (consistencia a crescimento acelerado)
- Foco: Escalar o que funciona + diversificar
- Acao: Aumentar verba gradualmente, novos publicos, novos canais
- Meta: Crescimento de 20-30% mes a mes
- Orcamento sugerido: R$ 5.000+/mes
