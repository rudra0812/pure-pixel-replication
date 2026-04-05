## Phase 1: Database Schema & Auth
1. **Create tables**: `profiles`, `journal_entries` (with mood, title, content, date, media_url columns), `user_roles`
2. **RLS policies**: Users can only access their own entries and profile
3. **Auth integration**: Replace mock auth with real email/password signup & login
4. **Auto-create profile** on signup via database trigger

## Phase 2: Persist Journal Entries
5. **Connect entries to DB**: Save/load entries from `journal_entries` table instead of local state
6. **CRUD operations**: Create, read, update, delete entries with real-time sync
7. **File storage**: Create a storage bucket for images/voice recordings attached to entries

## Phase 3: AI Features (Edge Functions)
8. **AI Mood Analysis**: Edge function that analyzes entry text and returns detected mood/sentiment → updates garden weather
9. **AI Journal Prompts**: Edge function that generates personalized writing prompts based on recent entries
10. **AI Summary & Insights**: Edge function that creates weekly/monthly summaries with emotional patterns

## Phase 4: Connect Everything
11. **Wire up AI** to the UI: auto-detect mood on save, show prompts on home screen, summaries in profile
12. **Cloud sync**: Entries load from DB on login, available on any device
13. **Polish & test** end-to-end flow