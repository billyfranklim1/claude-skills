/**
 * Brand loader — resolves brand config from hierarchy
 * 1. ./.carousels/brands/<name>.yaml    (project)
 * 2. ~/.config/carousels/brands/<name>.yaml (global)
 * 3. <skill>/brands/default.yaml         (fallback)
 */
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import yaml from 'yaml';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SKILL_ROOT = path.resolve(__dirname, '..', '..');

export function brandSearchPaths(name, projectRoot = process.cwd()) {
  return [
    path.join(projectRoot, '.carousels', 'brands', `${name}.yaml`),
    path.join(os.homedir(), '.config', 'carousels', 'brands', `${name}.yaml`),
    path.join(SKILL_ROOT, 'brands', `${name}.yaml`),
  ];
}

export function defaultBrandPath() {
  return path.join(SKILL_ROOT, 'brands', 'default.yaml');
}

export function readYaml(p) {
  const raw = fs.readFileSync(p, 'utf-8');
  return yaml.parse(raw);
}

export function currentBrandName(projectRoot = process.cwd()) {
  const markerPath = path.join(projectRoot, '.carousels', '.current-brand');
  if (fs.existsSync(markerPath)) {
    return fs.readFileSync(markerPath, 'utf-8').trim();
  }
  return null;
}

export function loadBrand(name, { projectRoot = process.cwd() } = {}) {
  // Always load default first as base
  const defaults = readYaml(defaultBrandPath());

  if (!name || name === 'default') {
    return defaults;
  }

  // Search hierarchy
  for (const p of brandSearchPaths(name, projectRoot)) {
    if (fs.existsSync(p)) {
      const custom = readYaml(p);
      return deepMerge(defaults, custom);
    }
  }

  console.warn(`[brand] "${name}" not found in any location — using default.`);
  return defaults;
}

export function listBrands(projectRoot = process.cwd()) {
  const locations = [
    { label: 'project', dir: path.join(projectRoot, '.carousels', 'brands') },
    { label: 'global', dir: path.join(os.homedir(), '.config', 'carousels', 'brands') },
    { label: 'default', dir: path.join(SKILL_ROOT, 'brands') },
  ];
  const found = {};
  for (const { label, dir } of locations) {
    if (!fs.existsSync(dir)) continue;
    for (const file of fs.readdirSync(dir)) {
      if (file.endsWith('.yaml') || file.endsWith('.yml')) {
        const name = file.replace(/\.ya?ml$/, '');
        if (!found[name]) {
          found[name] = { name, scope: label, path: path.join(dir, file) };
        }
      }
    }
  }
  return Object.values(found);
}

function deepMerge(base, override) {
  const out = { ...base };
  for (const [k, v] of Object.entries(override || {})) {
    if (v && typeof v === 'object' && !Array.isArray(v) && typeof out[k] === 'object') {
      out[k] = deepMerge(out[k], v);
    } else if (v !== undefined && v !== null) {
      out[k] = v;
    }
  }
  return out;
}

export function scaffoldBrand(name, { projectRoot = process.cwd(), global = false } = {}) {
  const targetDir = global
    ? path.join(os.homedir(), '.config', 'carousels', 'brands')
    : path.join(projectRoot, '.carousels', 'brands');

  fs.mkdirSync(targetDir, { recursive: true });
  const targetPath = path.join(targetDir, `${name}.yaml`);

  if (fs.existsSync(targetPath)) {
    throw new Error(`Brand "${name}" already exists at ${targetPath}`);
  }

  const defaults = readYaml(defaultBrandPath());
  defaults.name = name.charAt(0).toUpperCase() + name.slice(1);
  defaults.handle = `@${name}`;
  fs.writeFileSync(targetPath, yaml.stringify(defaults), 'utf-8');
  return targetPath;
}

export function setCurrentBrand(name, projectRoot = process.cwd()) {
  const dir = path.join(projectRoot, '.carousels');
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, '.current-brand'), name, 'utf-8');
}
