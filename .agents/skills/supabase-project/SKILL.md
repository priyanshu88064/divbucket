# supabase-project

Use this skill whenever working with Supabase in this repository.

## Goal

Set up, migrate, inspect, and deploy Supabase resources for the Divbucket project while keeping everything reproducible in-repo.

## Hard Rule

- Always use the **Supabase binary**: `supabase ...`
- Never use: `npx supabase ...`

## Project Context

- Project ref: `cgbdfnxifdlefwfbhipv`
- Supabase URL: `https://cgbdfnxifdlefwfbhipv.supabase.co`
- Config file: `supabase/config.toml`
- Migrations folder: `supabase/migrations/`
- Functions folder: `supabase/functions/`

## Standard Workflow

1. Verify CLI and auth:
```bash
supabase --version
supabase projects list
```

2. Link local repo to remote project (if not linked):
```bash
supabase link --project-ref cgbdfnxifdlefwfbhipv
```

3. Create a migration for every DB change:
```bash
supabase migration new <migration_name>
```

4. Apply migrations to linked remote:
```bash
supabase db push
```

5. Create an edge function:
```bash
supabase functions new <function_name>
```

6. Deploy an edge function:
```bash
supabase functions deploy <function_name>
```

## Recovery / Safety Rules

- Never make schema changes manually in dashboard without committing SQL migration files.
- Keep all SQL migrations in `supabase/migrations/`.
- Keep all edge function code in `supabase/functions/`.
- If drift is detected, capture missing remote changes into migrations before new work.

## Quick Checks

- List linked project info:
```bash
supabase status
```

- Confirm project access:
```bash
supabase projects list
```
