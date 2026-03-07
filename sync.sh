#!/bin/bash
# Sync skills from the marketplace repo to Claude Code and Telegram bot
# Usage: ./sync.sh [--pull]

set -euo pipefail

REPO_DIR="$(cd "$(dirname "$0")" && pwd)"
CLAUDE_SKILLS_DIR="$HOME/.claude/skills"
BOT_SKILLS_DIR="/root/telegram-claude-bot/workspace/skills"

if [[ "${1:-}" == "--pull" ]]; then
    cd "$REPO_DIR"
    git pull --ff-only -q 2>/dev/null || echo "Warning: git pull failed, using local copy"
fi

sync_target() {
    local target_dir="$1"
    mkdir -p "$target_dir"

    for plugin_dir in "$REPO_DIR"/plugins/*/; do
        local name=$(basename "$plugin_dir")
        local skill_md="$plugin_dir/skills/$name/SKILL.md"

        if [[ -f "$skill_md" ]]; then
            local dest="$target_dir/$name"
            mkdir -p "$dest"
            cp -f "$skill_md" "$dest/SKILL.md"
        fi
    done
}

sync_target "$CLAUDE_SKILLS_DIR"
sync_target "$BOT_SKILLS_DIR"

echo "Synced $(ls "$REPO_DIR"/plugins/ | wc -l) skills to Claude Code and Telegram bot"
