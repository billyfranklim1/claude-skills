---
name: backup
description: Backup and restore databases, mysqldump, Cloudflare R2, data recovery
---
# Skill: Backup

## Quando Usar
Quando o usuario pedir backup, restore, ou verificar status de backups.

## Backup Automatico
- **Script**: `/root/.backup-config/backup-databases.sh`
- **Schedule**: 03:00 UTC diariamente (crontab)
- **Destino**: Cloudflare R2 (`hubnews` bucket) → `/backups/databases/`
- **Retencao**: 30 dias
- **Databases**: reino, hubnews, work8, neuralnets, ece
- **Config**: `/root/.backup-config/.env`

## Comandos
```bash
# Executar backup manual
/root/.backup-config/backup-databases.sh

# Ver logs
tail -f /var/log/db-backup.log

# Listar backups no R2
aws s3 ls s3://hubnews/backups/databases/ \
  --endpoint-url https://f7565bf141b66cd78867b4b4cd3b3d15.r2.cloudflarestorage.com

# Restaurar
aws s3 cp s3://hubnews/backups/databases/reino_2026-02-02.sql.gz . \
  --endpoint-url https://f7565bf141b66cd78867b4b4cd3b3d15.r2.cloudflarestorage.com
gunzip reino_2026-02-02.sql.gz
mysql -u forge -p reino < reino_2026-02-02.sql
```

## Regras
- SEMPRE confirme com o Billy antes de restaurar um backup
- Backup manual: execute e verifique o log de sucesso
- Restore: faca backup do estado atual ANTES de restaurar
