# mb-assignment
TASK 2 :
1)where do you start?
Before writing a single test, I’d spend day one understanding risk, not coverage. That means:
•	Getting the architecture: what’s native vs. webview, what talks to exchanges/liquidity providers, where the money actually moves (deposits, withdrawals, order execution, wallet balances)
•	Talking to devs about what’s fragile — every codebase has 2-3 areas everyone quietly avoids touching
•	Finding out what compliance/regulatory requirements apply (KYC, AML checks, transaction limits) since those aren’t optional
•	Asking “what happens if this breaks in production” for each major feature, to build a mental risk map
I’d rather ship a thin test suite covering the 5 things that lose money or user trust than a thick suite covering 50 things that don’t.



2. How would you approach testing this app?
Layer it, because UI tests alone won’t cut it for a trading app:
•	Unit/API tests for order matching, balance calculations, fee logic — this is where money math bugs live, and they’re cheapest to catch here
•	Contract tests against the exchange/market data feed, since that integration is likely the most volatile dependency
•	E2E on critical flows — signup/KYC, deposit, place order, cancel order, withdraw — on both platforms, real devices not just simulators for at least the top 3-4 device/OS combos
•	Non-functional: load testing around market volatility spikes, security testing (this touches funds — pen test before launch, not after), and offline/flaky-network behavior since mobile users lose connection mid-trade constantly



3. What does QA look like inside a sprint, from ticket creation through to regression?
•	Ticket creation: acceptance criteria written with QA input, not handed over after the fact — especially edge cases and what happens on failure
•	Refinement: I’d flag ambiguous money-handling behavior (rounding, partial fills, race conditions on rapid taps) before dev starts, not after
•	During dev: exploratory testing on the branch/feature flag as it’s built, not waiting for “done”
•	PR/merge: automated tests required for anything touching balances or orders — no exceptions given real funds
•	Pre-release: full regression on affected areas + smoke test of critical paths
•	Post-release: monitoring/alerting is part of QA’s job here — the last line of defense when funds are involved is catching problems in minutes, not the next sprint



4. What does your ideal regression suite look like?
Structured in priority tiers so it can run at different cadences:
•	Smoke (every build, minutes): login, view balance, place/cancel a basic order, deposit/withdraw happy path
•	Core regression (daily/per merge): full order lifecycle (market/limit orders, partial fills, cancellations), balance accuracy after multiple operations, KYC gating, session handling/logout, push notifications for price alerts
•	Extended (pre-release): cross-device matrix, poor network conditions, app backgrounding mid-transaction, biometric auth edge cases, localization/currency formatting, accessibility basics
•	Security-specific: session hijacking attempts, API rate limiting, does the app leak sensitive data in logs/screenshots
Money-related tests get run more often and gate releases harder than cosmetic ones.



5. What would keep you up at night about this app specifically and releasing to the
public?
•	Race conditions on double-taps or rapid actions — someone taps “buy” twice on a slow connection and it executes twice
•	Balance/order state inconsistency after app crashes or gets killed mid-transaction — does it reconcile correctly on restart?
•	Floating point or rounding errors in balance/fee calculations that compound over many trades
•	Session/auth edge cases — biometric bypass, token expiry mid-trade, one account logged in on two devices
•	No existing test suite two weeks out — the biggest risk isn’t a single bug, it’s that untested code paths are unknown unknowns, and with real funds the cost of finding out in production is unacceptable
Honestly, with two weeks and zero existing coverage, I’d push hard on scoping the public release itself — even a limited beta with capped trade amounts — rather than pretending two weeks is enough to responsibly test money-moving software from scratch.


