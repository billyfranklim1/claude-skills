# Claude Code Skills

A collection of 34 skills for [Claude Code](https://claude.ai/code) covering SRE, DevOps, databases, security, marketing, and full-stack development.

Packaged as an official [Claude Code plugin marketplace](https://docs.claude.com/en/create-marketplace) for easy installation and auto-updates.

## Installation

### Via Plugin Marketplace (recommended)

```shell
/plugin marketplace add billyfranklim1/claude-skills
/plugin install sre@billy-claude-skills
```

### Manual (symlink)

```bash
git clone https://github.com/billyfranklim1/claude-skills.git ~/.claude-skills

# For Claude Code
ln -sf ~/.claude-skills/plugins/sre/skills/sre ~/.claude/skills/sre

# Or link all at once
for d in ~/.claude-skills/plugins/*/skills/*/; do
  name=$(basename "$d")
  ln -sf "$d" ~/.claude/skills/"$name"
done
```

## Available Skills

### DevOps
| Plugin | Description |
|--------|-------------|
| `sre` | Server Reliability Engineering — monitoring, logs, performance, incidents |
| `deploy` | Deploy Laravel and Next.js apps — zero-downtime, migrations, rollbacks |
| `backup` | Database backup and restore — mysqldump, Cloudflare R2, recovery |
| `cloudflare-api` | Cloudflare API for DNS management, tunnels, and zone administration |
| `cron-scheduling` | Schedule and manage recurring tasks with cron and systemd timers |
| `linux-service-triage` | Diagnose Linux service issues — logs, systemd, permissions, DNS |
| `load-balancing` | Nginx load balancing — upstream, health checks, zero-downtime |
| `log-tail` | Stream recent logs from systemd journal and application log files |
| `sysadmin-toolbox` | Sysadmin tool discovery and shell one-liners |

### Development
| Plugin | Description |
|--------|-------------|
| `php-full-stack-developer` | Senior PHP/Laravel full-stack developer |
| `laravel-debugging` | Debug Laravel in production — N+1, memory leaks, queues, Horizon |
| `git-essentials` | Essential Git commands and workflows |
| `git-workflows` | Advanced Git — rebase, bisect, worktrees, reflog, cherry-pick |
| `github` | GitHub CLI — issues, PRs, actions, workflows, releases |
| `unfuck-my-git-state` | Diagnose and recover broken Git state |
| `playwright` | Playwright tests and scrapers — selectors, flaky fixes, CI/CD |
| `image-gen` | Generate images, icons, diagrams, thumbnails, banners |
| `nano-banana` | Generate images using Gemini CLI |
| `performance-profiling` | Xdebug, Blackfire, flame graphs, k6 load testing |
| `api-troubleshooting` | Debug API failures — timeouts, rate limits, auth, webhooks |
| `web-research` | Search documentation, browse sites, analyze competitors |

### Database
| Plugin | Description |
|--------|-------------|
| `mysql-performance` | Slow queries, EXPLAIN plans, indexing, MySQL 8 tuning |
| `redis-patterns` | Redis cache, Horizon queues, sessions, memory management |
| `sql-toolkit` | Query, design, migrate, and optimize SQL databases |

### Monitoring
| Plugin | Description |
|--------|-------------|
| `grafana` | Grafana dashboards, Loki LogQL, alerting, API queries |
| `monitoring-alerting` | Grafana alerts, SLO dashboards, Telegram notifications |

### Security
| Plugin | Description |
|--------|-------------|
| `ssh-essentials` | SSH key management, port forwarding, tunneling |
| `ssl-certificates` | Let's Encrypt, certbot, auto-renewal, wildcard SSL |

### Marketing
| Plugin | Description |
|--------|-------------|
| `marketing-digital-growth` | Paid ads, funnels, growth hacking, email marketing, SEO |
| `meta-ads-advanced` | Meta Ads — Andromeda AI, Advantage+, CAPI/EMQ, creative testing |
| `mkt-digital` | Digital marketing — paid traffic, funnels, copywriting, metrics |
| `roteiros-virais-tiktok` | Viral short-video scripts for TikTok/Reels |

### Productivity
| Plugin | Description |
|--------|-------------|
| `google-workspace` | Google Drive, Gmail, Calendar, Sheets, Docs via gws CLI |
| `agent-memory` | Persistent semantic memory across sessions |

## Skill Structure

Each skill follows the [Claude Code plugin format](https://docs.claude.com/en/plugins):

```
plugins/skill-name/
├── .claude-plugin/
│   └── plugin.json          # Plugin manifest
└── skills/
    └── skill-name/
        └── SKILL.md         # Skill instructions
```

## Auto-sync (server)

Keep skills updated automatically:

```bash
*/30 * * * * cd /path/to/claude-skills && git pull --ff-only -q
```

## License

MIT
