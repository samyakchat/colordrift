# Colordrift

A React + Vite color explorer, palette tool, and daily color-name game.

Easy to use API tool that scans for color palettes and general color information. Made for my personal use, but it can be useful to anyone. Go to https://colordrift.vercel.app

## Why

When creating frontend components and actively trying to avoid looking generic, it's hard to know what looks good. Using the built in web preivew, testing all 5 color roles, and using the palette generator that changes daily, you can easily create frontend UI thats different than a purple-blue gradient.

## Development

```sh
npm install
npm run dev
```

Open `/colordle` to play Colordle locally. A new puzzle starts at midnight Eastern time (EST/EDT); puzzle #1 is November 6, 2026. Everyone gets the same daily color, selected deterministically from The Color API’s named colors so the exact answer is always guessable.

Players can guess any name in the bundled [Color API dataset](https://github.com/joshbeckman/thecolorapi/blob/master/static/colorNames.json), including Curious Blue. Type a name to see suggestions. Spaces, capitalization, accents, and punctuation are ignored. Unknown names and repeated guesses do not count as attempts.

The daily target stays hidden. Only submitted guesses reveal a color: each fills its entire card, with black or white text chosen for contrast, a similarity score to two decimal places, and whether it is closer than the previous guess. Newest guesses appear first, while attempt numbers and comparisons retain their original order. Scores compare actual color values in [Oklab](https://bottosson.github.io/posts/oklab/), using `100 × (1 − distance)`, clamped to 0–100. This is the game’s similarity scale, not a percentage returned by the API. Only identical RGB colors score 100%; near matches are capped at 99.99%.

The name/hex list is bundled from the API’s source because its `/id` endpoint identifies colors by value, rather than looking up colors by name. Gameplay does not require a live API request. The source includes duplicate names for different colors; the game consistently uses the first entry for each name and chooses daily targets from that unambiguous list. The dataset originally comes from [Name that Color](https://chir.ag/projects/name-that-color/). Refresh the bundled dataset when adopting new API color names.

Guesses are unlimited and saved locally for each day. The new color-based rules use a separate `colordle:v2` save key, so old letter-based histories are not reused. Share results include the puzzle number, attempt count, and page URL without the answer.

## Colordle on a Vercel subdomain

Use the **same Vercel project** for both the main site and the game. The app detects hostnames starting with `colordle.` and serves only Colordle there, with its own header and footer. The main site's navbar is the entry point; its other pages keep their normal layout.

1. In your Vercel project, open **Settings → Domains**, then add `colordle.yourdomain.com`. Keep it assigned to this project and its production environment, without a redirect to the main domain.
2. If your DNS is hosted outside Vercel, add the **CNAME record that Vercel displays** at your DNS provider. Its name will normally be `colordle`; use the exact target from Vercel. If Vercel manages your DNS, follow its domain setup prompts instead. Wait for the domain to show as valid and HTTPS to be ready.
3. In **Settings → Environment Variables**, add these production build variables, replacing the example domain:

   ```text
   VITE_SITE_URL=https://yourdomain.com
   VITE_COLORDLE_URL=https://colordle.yourdomain.com
   ```

4. Deploy these changes (or redeploy after setting the variables). Vite embeds these values at build time. The navbar will link to the subdomain and the game logo will link back to the main website.
5. Check that `https://yourdomain.com/` shows the main website, `https://colordle.yourdomain.com/` shows the game, and the navbar opens the game subdomain.

You need a domain you own for `colordle.yourdomain.com`; the free `colordrift.vercel.app` address does not give you control of `colordle.colordrift.vercel.app`. You can keep using `/colordle` on the current deployment until you connect a custom domain. Without the environment variables, the navbar uses `/colordle`, which also works in local development and preview deployments. Keep preview variables unset to test changes on a preview rather than linking to production.

The existing SPA rewrite in `vercel.json` supports both domains; no separate project or server is required. The subdomain and `/colordle` have separate browser storage because storage is scoped to the origin.

Vercel documentation: [Adding a domain](https://vercel.com/docs/domains/working-with-domains/add-a-domain), [Custom domain setup](https://vercel.com/docs/domains/set-up-custom-domain). Color API documentation: [Endpoints and color names](https://www.thecolorapi.com/docs).

## Verification

```sh
node --test src/lib/colordle.test.js
npm run build
```
