# Prototype QA checklist

The standalone demo was previously checked in headless Chromium on 2026-11-11 (local build). After publishing, Laffi should re-run all checks in the deployed environment.

- [x] Overview loads using fictional seed data.
- [x] All six tabs show their respective screens.
- [x] Creator creation, search, status edits and reward verification update local sample state.
- [x] Demo reward status and proposed amount settings can be changed.
- [x] Overview counts recalculate when demo state changes.
- [x] Sample data reset restores the initial records.
- [x] Mobile layout and menu tested at a narrow viewport.
- [ ] Verify GitHub Pages deployment on iOS and desktop.
- [ ] Add secure authentication and server-owned authorization.
- [ ] Connect to Laffi-approved sources and payment reconciliation.
- [ ] Conduct full security, privacy and accessibility reviews.

**No live Laffi API, authorization, real payouts, or real creator/reader data is implemented.**