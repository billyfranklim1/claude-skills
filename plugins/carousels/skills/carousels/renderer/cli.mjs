#!/usr/bin/env node
/**
 * Carousels CLI
 *
 * Usage:
 *   node cli.mjs render <carousel.json> [--out <dir>] [--brand <name>] [-v]
 *   node cli.mjs preview <carousel.json> [--brand <name>]
 *   node cli.mjs brand new <name> [--global]
 *   node cli.mjs brand list
 *   node cli.mjs brand show <name>
 *   node cli.mjs brand use <name>
 *   node cli.mjs brand path <name>
 *   node cli.mjs styles list
 *   node cli.mjs variants list <style>
 */
import fs from 'node:fs';
import path from 'node:path';
import { renderCarousel } from './render.mjs';
import {
  loadBrand, listBrands, scaffoldBrand, setCurrentBrand,
  brandSearchPaths, currentBrandName,
} from './lib/brand-loader.mjs';
import { listStyles, listVariants } from './lib/style-loader.mjs';

const args = process.argv.slice(2);
const [cmd, subcmd, ...rest] = args;

function getFlag(name, def = null) {
  const i = args.indexOf(`--${name}`);
  if (i === -1) return def;
  return args[i + 1];
}
function hasFlag(name) {
  return args.includes(`--${name}`) || args.includes(`-${name[0]}`);
}

async function main() {
  try {
    if (cmd === 'render') {
      const jsonPath = subcmd;
      if (!jsonPath) throw new Error('Usage: render <carousel.json>');
      const data = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
      const outDir = getFlag('out', path.join(path.dirname(jsonPath), 'slides'));
      const brand = getFlag('brand') || data.meta?.brand || currentBrandName() || 'default';
      const verbose = hasFlag('verbose') || hasFlag('v');

      console.log(`🎨 Rendering ${data.slides.length} slides with brand "${brand}"...`);
      const outputs = await renderCarousel(data, {
        outDir,
        brandName: brand,
        verbose,
      });
      console.log(`✅ Done. ${outputs.length} slides → ${outDir}`);
      outputs.forEach(o => console.log('   ' + o));
    }

    else if (cmd === 'preview') {
      const jsonPath = subcmd;
      if (!jsonPath) throw new Error('Usage: preview <carousel.json>');
      const data = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
      const outDir = path.join(path.dirname(jsonPath), 'preview');
      const brand = getFlag('brand') || data.meta?.brand || currentBrandName() || 'default';
      console.log(`🎨 Rendering preview...`);
      const outputs = await renderCarousel(data, { outDir, brandName: brand });
      // Build HTML grid
      const htmlPath = path.join(outDir, 'preview.html');
      const html = `<!doctype html><html><head><meta charset="utf-8"><title>Preview</title>
<style>body{background:#111;margin:0;padding:24px;font-family:system-ui}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:16px}
.slide{background:#222;border-radius:8px;overflow:hidden}
.slide img{width:100%;display:block}
.label{color:#fff;padding:8px 12px;font-size:12px;opacity:.7}
</style></head><body><div class="grid">
${outputs.map((o, i) => `<div class="slide"><img src="${path.basename(o)}"><div class="label">Slide ${i + 1}</div></div>`).join('\n')}
</div></body></html>`;
      fs.writeFileSync(htmlPath, html);
      console.log(`✅ Preview: file://${htmlPath}`);
    }

    else if (cmd === 'brand') {
      if (subcmd === 'new') {
        const name = rest[0];
        if (!name) throw new Error('Usage: brand new <name> [--global]');
        const global = hasFlag('global');
        const p = scaffoldBrand(name, { global });
        console.log(`✅ Created ${p}`);
        console.log(`   Edit this file to customize your brand.`);
      }
      else if (subcmd === 'list') {
        const brands = listBrands();
        if (brands.length === 0) { console.log('No brands found.'); return; }
        console.log('Available brands:');
        for (const b of brands) {
          console.log(`  ${b.name.padEnd(20)} [${b.scope}]  ${b.path}`);
        }
      }
      else if (subcmd === 'show') {
        const name = rest[0];
        if (!name) throw new Error('Usage: brand show <name>');
        const brand = loadBrand(name);
        console.log(JSON.stringify(brand, null, 2));
      }
      else if (subcmd === 'use') {
        const name = rest[0];
        if (!name) throw new Error('Usage: brand use <name>');
        setCurrentBrand(name);
        console.log(`✅ Current brand set to "${name}"`);
      }
      else if (subcmd === 'path') {
        const name = rest[0];
        if (!name) throw new Error('Usage: brand path <name>');
        for (const p of brandSearchPaths(name)) {
          if (fs.existsSync(p)) { console.log(p); return; }
        }
        console.log(`(default) ${path.join(import.meta.dirname || '.', '..', 'brands', `${name}.yaml`)}`);
      }
      else {
        throw new Error('Usage: brand <new|list|show|use|path> [args]');
      }
    }

    else if (cmd === 'styles') {
      if (subcmd === 'list') {
        for (const s of listStyles()) console.log(s);
      }
    }

    else if (cmd === 'variants') {
      if (subcmd === 'list') {
        const style = rest[0];
        if (!style) throw new Error('Usage: variants list <style>');
        for (const v of listVariants(style)) console.log(v);
      }
    }

    else if (!cmd || cmd === 'help' || cmd === '--help') {
      console.log(`Carousels CLI

Commands:
  render <file.json> [--out <dir>] [--brand <name>] [-v]
  preview <file.json> [--brand <name>]

  brand new <name> [--global]
  brand list
  brand show <name>
  brand use <name>
  brand path <name>

  styles list
  variants list <style>
`);
    }

    else {
      throw new Error(`Unknown command: ${cmd}. Try: help`);
    }
  } catch (e) {
    console.error(`❌ ${e.message}`);
    process.exit(1);
  }
}

main();
