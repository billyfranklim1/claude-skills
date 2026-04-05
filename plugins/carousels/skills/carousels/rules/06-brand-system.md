# Brand System

Multi-brand configuration. Every render uses a brand to pull colors, fonts, and logo.

## Resolution hierarchy (first match wins)

1. **`./.carousels/brands/<name>.yaml`** — project-level (highest priority)
2. **`~/.config/carousels/brands/<name>.yaml`** — user-global
3. **`brands/default.yaml`** — skill default (fallback)

Also: `./.carousels/.current-brand` file stores the current-project default brand name.

## Brand YAML schema

```yaml
name: "Acme Brand"            # display name
handle: "@acme"               # social handle (used in footer)
logo: "./logo.png"            # relative to this yaml

colors:
  primary: "#7B2CBF"          # main brand color (header bars, accents)
  accent: "#FFD700"           # secondary accent
  bg_light: "#FFFFFF"         # variant A/C background
  bg_dark: "#0A0A0A"          # variant B/D background
  bg_impact: "#2D1B69"        # variant E (slide 8 impact)
  text_on_light: "#000000"    # text color on light bg
  text_on_dark: "#FFFFFF"     # text color on dark bg
  highlight: "#FFD700"        # destaque word color

fonts:
  heading:
    family: "Inter"
    weight: 900               # Black
  body:
    family: "Inter"
    weight: 500               # Medium
  accent:
    family: "Inter"
    weight: 700               # Bold

logo_placement:
  first_slide: "bottom-center"    # options: bottom-center, bottom-left, top-right, none
  last_slide: "bottom-center"
  other_slides: "none"

dimensions:
  width: 1080
  height: 1080                # 1080x1080 (feed) or 1080x1350 (portrait)
```

## CLI for brand management

```bash
node cli.mjs brand new <name>          # scaffold new brand yaml
node cli.mjs brand list                # list all brands (project + global + default)
node cli.mjs brand show <name>         # show brand config
node cli.mjs brand use <name>          # set as current for project
node cli.mjs brand path <name>         # print path to yaml file
```

## Programmatic loading (inside renderer)

```js
import { loadBrand } from './lib/brand-loader.mjs';

const brand = await loadBrand('acme', { projectRoot: process.cwd() });
// Returns resolved brand object, merged with defaults for any missing fields
```

## Safety defaults

If a brand yaml is missing any field, it falls back to `brands/default.yaml`. This ensures a render never fails because of a half-configured brand.

## Creating a new brand

1. Run `node cli.mjs brand new mybrand`
2. Edit `./.carousels/brands/mybrand.yaml`
3. Replace colors, fonts, logo path
4. Test: `node cli.mjs brand show mybrand`
5. Use: `carousels generate "topic" --brand mybrand`
