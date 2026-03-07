---
name: google-workspace
description: Google Workspace — Drive, Gmail, Calendar, Sheets, Docs, Tasks via gws CLI
---
# Skill: Google Workspace CLI (gws)

## Quando Usar
Quando o usuario pedir para interagir com Google Drive, Gmail, Calendar, Sheets, Docs, Slides ou Tasks.
Exemplos: listar arquivos, enviar email, ver agenda, criar planilha, ler documento, criar tarefa.

## Setup
- **CLI**: `@googleworkspace/cli` v0.8.0 (instalado globalmente via npm)
- **Credenciais**: `/root/.config/gws/credentials.json`
- **Env var**: `GOOGLE_WORKSPACE_CLI_CREDENTIALS_FILE=/root/.config/gws/credentials.json`
- **Conta**: billyfranklim@gmail.com
- **Scopes**: Drive, Sheets, Gmail, Calendar, Docs, Presentations, Tasks, PubSub, Cloud Platform

## Comandos Essenciais

### Drive
```bash
# Listar arquivos
gws drive files list --params '{"pageSize": 10}'

# Buscar arquivos por nome
gws drive files list --params '{"q": "name contains '\''relatorio'\''", "pageSize": 10}'

# Detalhes de um arquivo
gws drive files get --params '{"fileId": "FILE_ID"}'

# Criar pasta
gws drive files create --json '{"name": "Nova Pasta", "mimeType": "application/vnd.google-apps.folder"}'

# Upload arquivo
gws drive files create --json '{"name": "arquivo.pdf"}' --upload /path/to/arquivo.pdf
```

### Gmail
```bash
# Listar mensagens recentes
gws gmail users messages list --params '{"userId": "me", "maxResults": 10}'

# Ler uma mensagem
gws gmail users messages get --params '{"userId": "me", "id": "MSG_ID"}'

# Buscar emails
gws gmail users messages list --params '{"userId": "me", "q": "from:exemplo@email.com", "maxResults": 5}'

# Enviar email (body em base64)
gws gmail users messages send --params '{"userId": "me"}' --json '{"raw": "BASE64_ENCODED_EMAIL"}'
```

### Calendar
```bash
# Listar calendarios
gws calendar calendarList list

# Listar eventos de hoje
gws calendar events list --params '{"calendarId": "primary", "timeMin": "2026-03-07T00:00:00Z", "timeMax": "2026-03-07T23:59:59Z", "singleEvents": true, "orderBy": "startTime"}'

# Criar evento
gws calendar events insert --params '{"calendarId": "primary"}' --json '{"summary": "Reuniao", "start": {"dateTime": "2026-03-07T14:00:00-03:00"}, "end": {"dateTime": "2026-03-07T15:00:00-03:00"}}'
```

### Sheets
```bash
# Criar planilha
gws sheets spreadsheets create --json '{"properties": {"title": "Minha Planilha"}}'

# Ler dados
gws sheets spreadsheets values get --params '{"spreadsheetId": "SHEET_ID", "range": "Sheet1!A1:D10"}'

# Escrever dados
gws sheets spreadsheets values update --params '{"spreadsheetId": "SHEET_ID", "range": "Sheet1!A1", "valueInputOption": "USER_ENTERED"}' --json '{"values": [["Nome", "Email"], ["Billy", "billy@email.com"]]}'
```

### Docs
```bash
# Criar documento
gws docs documents create --json '{"title": "Meu Documento"}'

# Ler documento
gws docs documents get --params '{"documentId": "DOC_ID"}'
```

### Tasks
```bash
# Listar task lists
gws tasks tasklists list

# Listar tarefas
gws tasks tasks list --params '{"tasklist": "TASKLIST_ID"}'

# Criar tarefa
gws tasks tasks insert --params '{"tasklist": "TASKLIST_ID"}' --json '{"title": "Minha tarefa", "notes": "Descricao"}'
```

## Formatos de Saida
```bash
--format json    # (default)
--format table   # tabela legivel
--format yaml
--format csv
```

## Introspecao de API
```bash
# Ver schema de um metodo
gws schema drive.files.list
gws schema gmail.users.messages.send
```

## Notas
- Todas as chamadas sao feitas como billyfranklim@gmail.com
- Para enviar emails, o body precisa ser RFC 2822 encoded em base64url
- O CLI descobre APIs dinamicamente via Google Discovery Service
- Cache de discovery docs: 24h
