# AI Support Agent

An AI-guided support desk with two sides. Customers chat with an assistant that collects everything a support ticket needs. Support techs work the resulting tickets on a drag-and-drop Kanban board.

**Stack:** Next.js 14 (App Router) · TypeScript · Vercel AI SDK · OpenAI GPT-4o · Zustand · dnd-kit · shadcn/ui · Tailwind CSS

---

## The problem

Support tickets often arrive incomplete. There's no email, no category and a vague title, so a tech has to go back and forth with the customer before any work can start. This app moves that intake step into a conversation. The assistant asks one question at a time, suggests a category and priority for the user to confirm, and only creates the ticket once every field is filled in.

## How it works

```
Customer ──chat──▶ /api/chat ──▶ GPT-4o (guided system prompt)
                                     │
                     replies until all fields are collected, then emits
                     TICKET_CREATED:{ name, email, category, priority, title, description }
                                     │
      chat page parses the payload ◀─┘
                 │
                 ▼
     Zustand store (persisted) ──▶ Dashboard: stats + Kanban (Open → In Progress → Resolved)
```

- **Guided intake.** The system prompt in `app/api/chat/route.ts` sets a fixed order: issue, name, email, suggested category, suggested priority, title. The user confirms the AI's suggestions, so the model never decides on its own.
- **Structured output.** When intake is done, the model replies with a `TICKET_CREATED:{...}` JSON payload. The chat page pulls it out and turns it into a typed `Ticket` (`lib/types/ticket.ts`). Free-form chat and machine-readable data share one channel without needing a second API call.
- **Shared state.** Tickets live in a Zustand store with `persist` middleware (`lib/stores/ticket-store.ts`), so the chat and the dashboard read the same data and it survives a reload.
- **Tech dashboard.** It shows summary stats, search and category filters, a ticket details modal and a Kanban board built on dnd-kit, where moving a card changes the ticket's status.

## Getting started

```bash
pnpm install
echo "OPENAI_API_KEY=sk-..." > .env.local
pnpm dev
```

Open http://localhost:3000, choose **Start Chat** to file a ticket, then **View Dashboard** to work it.

## Project structure

```
app/
  api/chat/route.ts        Guided-intake chat endpoint
  api/tickets/route.ts     Ticket API
  chat/page.tsx            Customer chat; parses TICKET_CREATED payloads
  dashboard/page.tsx       Tech dashboard with Kanban board
components/dashboard/      Ticket card, Kanban column, stats, details modal
lib/stores/ticket-store.ts Persisted Zustand store
lib/types/ticket.ts        Ticket model
```

## Trade-offs and next steps

This is a demo, so storage is client-side. To take it to production I would:

- Move tickets to Postgres behind `api/tickets`, and push board updates to all techs over WebSockets or SSE.
- Replace the text sentinel with the AI SDK's tool calling and a Zod schema, so ticket fields are validated before they're saved and not parsed out of the reply text.
- Stream responses (`streamText`) for faster first-token latency in the chat.
- Check for duplicate tickets against a customer's existing open tickets before creating a new one.
