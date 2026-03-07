# Billy Claude Skills

A curated collection of 34 Claude Code plugins for SRE, DevOps, marketing, and full-stack development.

## Installation

```bash
/plugin marketplace add billyfranklim1/claude-skills
```

## Plugins

### DevOps

| Plugin | Description |
|--------|-------------|
| **sre** | Server Reliability Engineering — monitoring, logs, performance, incidents |
| **deploy** | Zero-downtime deployment for Laravel and Next.js applications |
| **api-troubleshooting** | Debug external and internal API failures — timeouts, rate limits, authentication, webhooks |
| **load-balancing** | Nginx load balancing — upstream config, health checks, zero-downtime deploy, horizontal scaling |
| **performance-profiling** | Profile and diagnose performance bottlenecks in PHP/Laravel, Next.js, and MySQL |
| **cron-scheduling** | Schedule and manage recurring tasks with cron and systemd timers |
| **linux-service-triage** | Diagnose Linux service issues — logs, systemd, permissions, Nginx proxy, DNS checks |
| **cloudflare-api** | Cloudflare API for DNS management, tunnels, cache purge, and zone administration |
| **sysadmin-toolbox** | Tool discovery and shell one-liner reference for sysadmin, DevOps, and security tasks |

### Development

| Plugin | Description |
|--------|-------------|
| **laravel-debugging** | Debug Laravel apps in production — N+1 queries, memory leaks, stuck queues, slow jobs, Horizon |
| **php-full-stack-developer** | Senior PHP/Laravel full-stack developer — backend, frontend, DB, DevOps, CI, debugging |
| **git-workflows** | Advanced Git operations — rebase, bisect, worktrees, reflog recovery, cherry-pick |
| **git-essentials** | Essential Git commands and workflows for version control, branching, and collaboration |
| **unfuck-my-git-state** | Diagnose and recover broken Git state — detached HEAD, phantom worktrees, orphaned refs |
| **playwright** | Write, debug, and maintain Playwright tests and scrapers — resilient selectors, CI/CD |
| **github** | GitHub CLI operations — issues, pull requests, CI/CD runs, releases, API queries using gh |

### Database

| Plugin | Description |
|--------|-------------|
| **backup** | Database backup and restore with MySQL, Cloudflare R2, and automated scheduling |
| **redis-patterns** | Redis diagnostics and optimization — cache, queues, sessions, memory management for Laravel |
| **mysql-performance** | Diagnose slow queries, index tables, analyze EXPLAIN plans, tune MySQL 8 in production |
| **sql-toolkit** | Query, design, migrate, and optimize SQL databases — schema design, queries, indexing |

### Monitoring

| Plugin | Description |
|--------|-------------|
| **monitoring-alerting** | Grafana alerts, Loki LogQL, SLO dashboards, Telegram contact points, alerting rules |
| **grafana** | Grafana and Loki operations — API queries, LogQL, variable templating, alerting, provisioning |
| **log-tail** | Stream recent logs from systemd journal — view logs by service unit, follow in real time |

### Marketing

| Plugin | Description |
|--------|-------------|
| **meta-ads-advanced** | Advanced Meta Ads 2026 strategies — Andromeda AI, Advantage+, CAPI/EMQ, creative testing |
| **mkt-digital** | Digital marketing, paid traffic, growth, Meta Ads, Google Ads, funnels, copy, metrics, SEO |
| **marketing-digital-growth** | Senior digital marketing strategist — paid traffic, growth hacking, multi-platform Ads |
| **roteiros-virais-tiktok** | Create viral short-form video scripts (TikTok/Reels) optimized for engagement |

### Productivity

| Plugin | Description |
|--------|-------------|
| **agent-memory** | Persistent semantic memory for the agent — save facts, patterns, and decisions across sessions |
| **google-workspace** | Google Workspace integration — Drive, Gmail, Calendar, Sheets, Docs, Tasks via gws CLI |
| **image-gen** | Generate images, icons, diagrams, thumbnails, and visual content using Gemini CLI |
| **nano-banana** | Generate and edit images using Nano Banana (Gemini CLI) — blog images, thumbnails, icons |
| **web-research** | Web research, documentation lookup, site navigation, competitor analysis |

### Security

| Plugin | Description |
|--------|-------------|
| **ssh-essentials** | Essential SSH commands — key management, port forwarding, tunneling, file transfers |
| **ssl-certificates** | SSL/TLS certificate management — Let's Encrypt, certbot, auto-renewal, wildcard DNS challenge |

## Structure

```
claude-skills/
├── .claude-plugin/
│   └── marketplace.json      # Marketplace catalog
├── plugins/
│   ├── sre/
│   │   ├── .claude-plugin/
│   │   │   └── plugin.json
│   │   └── skills/
│   │       └── sre/
│   │           └── SKILL.md
│   ├── deploy/
│   │   ├── .claude-plugin/
│   │   │   └── plugin.json
│   │   └── skills/
│   │       └── deploy/
│   │           └── SKILL.md
│   └── ... (34 plugins total)
└── README.md
```

## Categories

- **devops** (9 plugins) — Server management, deployment, infrastructure
- **development** (7 plugins) — Code, Git, testing, debugging
- **database** (4 plugins) — MySQL, Redis, SQL, backup/restore
- **monitoring** (3 plugins) — Grafana, Loki, logs, alerting
- **marketing** (4 plugins) — Meta Ads, growth, copywriting, social media
- **productivity** (5 plugins) — AI tools, research, workspace, image generation
- **security** (2 plugins) — SSH, SSL/TLS certificates

## License

MIT
