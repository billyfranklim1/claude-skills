---
name: laravel-debugging
description: Debug Laravel apps in production — N+1 queries, memory leaks, stuck queues, slow jobs, silent errors, Horizon
---

# Skill: Laravel Debugging — Produção

## Quando Usar
- Rota Laravel está lenta ou retornando 500 sem mensagem clara no Nginx
- Job na fila travou, não processa ou está em loop de retry
- Horizon aparece como PAUSED ou workers somem do supervisor
- Memory limit exceeded em PHP-FPM ou OOM kill em worker de fila

## Contexto

**Apps ativas neste servidor:**
| App | PHP | Horizon | Workers Supervisor |
|-----|-----|---------|-------------------|
| `api.hubnews.ai` | 8.3 | daemon-547099 | nightwatch(457364), news-processing(295850), pulse(890775) |
| `sistemareino.com.br` | 8.4 | — | — |
| `work8.billy.dev.br` | 8.3 | daemon-655935/655941 | — |
| `ece.billy.dev.br` | 8.x | — | — |

**Paths críticos:**