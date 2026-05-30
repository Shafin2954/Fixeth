Docs module added: /docs public viewer, /docs/admin editor, DB migrations, APIs, and simple components.

How to run locally:
1. Run Supabase migrations: paste supabase/migrations/20260601_create_docs_tables.sql into Supabase SQL Editor and run.
2. Start Next dev server: npm run dev
3. Visit /docs (public) and /docs/admin (admin only)

Notes:
- Admin detection uses users.is_admin or users.role='admin' in Supabase users table.
- Default window set to June 10 00:00 → June 14 23:59 (2026 +06 timezone).
- Editor is minimal JSON editor for quick iteration; replace with Tiptap for full WYSIWYG.
