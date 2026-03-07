---
name: ssl-certificates
description: Let's Encrypt, certbot, auto-renewal, wildcard DNS challenge, SSL troubleshooting with Cloudflare proxy
---

# Skill: SSL Certificates — Let's Encrypt + Cloudflare

## Quando Usar
- Certificado expirado ou prestes a expirar em qualquer domínio do servidor
- Novo domínio/subdomínio precisa de HTTPS (ex: novo preview, novo projeto)
- Renovação automática parou de funcionar (`certbot renew` falhando)
- Nginx retornando erro SSL (handshake fail, mixed content, HSTS problem)

## Contexto

**Domínios ativos neste servidor:**
| Domínio | Proxy CF | Tipo Cert |
|---------|----------|-----------|
| api.hubnews.ai, thehubnews.ai | ✅ | Standard |
| sistemareino.com.br, www. | ✅ | Standard |
| work8.billy.dev.br | ✅ | Standard |
| billy.dev.br | ✅ | Standard |
| neuralnets.com.br | ✅ | Standard |
| papeou.billy.dev.br | ✅ | Standard |
| *.preview.hubnews.ai | ✅ | **Wildcard DNS-01** |

**Paths críticos:**