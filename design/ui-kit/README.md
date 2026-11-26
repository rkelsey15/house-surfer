# UI kit

A small, reusable kit for **prototypes, mockups, the case study page and the demo video**. It is **not for the app**: the app has its own styles in `src/styles.css`, and nothing in `src/` imports this folder. Vite does not bundle `design/`.

## Files
| File | What it is |
| --- | --- |
| `tokens.css` | Colors, fonts, radii, spacing as CSS variables. Light and dark. Change a value here and every piece updates |
| `components.css` | Styles for the six pieces below. Wrap your page in an element with class `kit` |
| `components.js` | Behavior for tabs, slider, state toggle and flow. No setup: add the data attributes |
| `gallery.html` | One page showing every piece. Open it in a browser (double-click) to copy from it |

## The pieces
1. **Phone frame** (`.phone` > `.phone-screen`): wraps any screen so it reads as a real app.
2. **Basics:** `.card`, `.btn` and `.btn-ghost`, `.chip` (`.on`, `.good`), tabs (`data-tabs`, switches panels).
3. **Before / after slider** (`.cmp` with `data-compare` and a range input): drag to compare old and new.
4. **State toggle** (`data-states`, buttons with `data-state`, panes with `data-pane`): flip one component between empty, loading, error and success.
5. **Clickable flow** (`data-flow`, one `.flow-screen` per step, `data-next`, `data-back`, `data-restart`, `.dots`): tap through 3 to 5 screens in a phone.

## Themes
- Default: portfolio look (navy, blue, gold).
- **`theme-surfer`**: House Surfer colors (teal and coral). Add the class to any wrapper, for example `<main class="kit theme-surfer">`. Light and dark both work.

## Use it
1. Copy the `ui-kit/` folder into the new prototype.
2. Link `tokens.css`, `components.css`, `components.js` (see `gallery.html`).
3. Paste a piece from the gallery, change the words.

Buttons and chips here are 44 px tall for touch (the `.seg` state buttons are 36 px; make them 44 px if you show them as app buttons). Fonts come from Google Fonts, so the gallery needs internet to show them; it falls back to system fonts offline.
