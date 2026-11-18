# Fizzz Creator Experience — Interactive Feature Proposal

**Status:** Independent prototype (November 18, 2026). Not an official Fizzz release, not connected to Fizzz, and not a payment processor.

## [OPEN THE INTERACTIVE LIVE PREVIEW](https://xvelvetruinx.github.io/fizzz-feature-proposal/)

**Share just this link with Fizzz:** https://xvelvetruinx.github.io/fizzz-feature-proposal/

The page is a responsive clickable concept based on the creator's Android screenshots. It intentionally keeps the Fizzz burgundy/rose-black theme and the profile → **Creators / Join Us** → Creator Center → Creator Level hierarchy. The demo toggles Creator/Reader, supports proposed interactions, and uses mock data; it never touches real Gems, chats, payment accounts, or Fizzz users.

**If the preview returns 404:** The repository file has been committed, but GitHub Pages publishing may still need to be enabled. In repository **Settings → Pages**, select **Deploy from a branch → main → /(root)**, save, and open the URL again after deployment. This path is inside the existing `xVelvetRuinx.github.io` repository; it does **not** replace the owner's homepage.

## What to try

1. Choose **Creator** or **Reader** preview.
2. Open **Profile & Follow** to see owner-only Insights and public Follow/Share.
3. Open **Search by UID** to see creator-name/UID discovery.
4. Open **Character Chat** to try a small creator overlay, message refresh/edit/delete, comments, and free creator Edit Mode testing.
5. Open **Creator Center** to see preserved existing 1 Coin = 1 Gem exchange, creator level, and the **proposed separate Gem cash-out**.
6. Switch to **PayPal Cash-Out** and **Following Feed**.

## Files

- **[index.html](./index.html)** — complete self-contained live page, with embedded image assets, styling, and interactive JavaScript
- **[source/styles.css](./source/styles.css)** — readable CSS source
- **[source/app.js](./source/app.js)** — readable JS source (contains embedded mock image assets)
- **[IMPLEMENTATION_SPEC.md](./IMPLEMENTATION_SPEC.md)** — feature placement, permissions, proposed API contracts, payment safeguards, and acceptance criteria

For easy web preview, the self-contained `index.html` is the production *prototype* entrypoint. Source files are provided to make engineering review easier, not to imply this is integrated into Fizzz.

## Requests covered

| Feature | Suggested placement |
| --- | --- |
| Follow creators | Public profile and in-chat creator overlay; Following feed |
| Search creators by display name or UID | Existing search/discovery |
| Owner-only bot statistics | Clearly clickable Insights chip, compact in-chat overlay, detailed Creator Center |
| Comments on web/iOS, with edit/delete | Character comments across platforms |
| Refresh/edit/delete chat messages | Three-dot message actions and AI regenerate |
| Block user on web/iOS | User/profile overflow, Android parity |
| Sort bots by performance/alphabetical/newest | Creator profile's Characters tab |
| **400 eligible earned Gems = $1 USD**, PayPal | Additional **cash-out** tab in Creator Center, **not** existing Coin → Gem exchange |
| Gift Gems | Creator profile and in-chat creator overlay |
| Share creator profiles | Share action with stable creator UID permalink |
| Free creator test chats | Dedicated bot Edit Mode QA sessions, excluded from monetization and engagement stats |

## Accuracy and disclosure

The uploaded screenshots show Level S at 20%, and 1 Coin = 1 Gem exchange; **neither implies that spendable Gems are automatically withdrawable.** A proposed 400:1 payout must apply to a separately verified *creator-earned* balance after eligibility, deductions, and any required payment review. All shown payouts, follow changes, Gem gifts, chats, comments, and counters are simulations.

### Sharing and editing

- **Preview link:** https://xvelvetruinx.github.io/fizzz-feature-proposal/
- **Code and documents:** https://github.com/xVelvetRuinx/xVelvetRuinx.github.io/tree/main/fizzz-feature-proposal
- **Engineering spec:** https://github.com/xVelvetRuinx/xVelvetRuinx.github.io/blob/main/fizzz-feature-proposal/IMPLEMENTATION_SPEC.md

Keep this proposal separate from proprietary Fizzz code. Images and profile information here came from the creator's supplied visual examples and should be replaced with approved assets before official adoption.
