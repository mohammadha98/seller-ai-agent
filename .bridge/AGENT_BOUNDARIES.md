# Agent Boundaries

* Design System Agent: Owns `packages/ui-kit`, tokens. BANNED from `apps/web/pages`, `services`.
* Services Agent: Owns `apps/web/src/services`, types. BANNED from `ui-kit`, `backend`.
* UI Agent: Owns `apps/web/src/pages`, features. BANNED from `ui-kit`, `services`.
* Backend Agent: Owns `apps/api`. BANNED from `apps/web`.
* Core Agent: Owns `.bridge`, `docs`, root settings. BANNED from product code.
