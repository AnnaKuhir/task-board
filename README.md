## Development

1. **Start the development server:**

   ```bash
      npm install
      npm run dev
   ```

   Open http://localhost:3000

   Optional

   ```bash
      npm run lint
      npm run format
   ```

2. **Decisions:**

   ### Next.js App Router + SSR
   - `src/app/page.tsx` loads tasks on the server using `getTasks()`.
   - Tasks are passed to the client component as `initialTasks`.
   - This provides a fast first render and server-side rendered HTML.

   ### In-memory storage
   - Tasks are stored in a server-side `Map`, shared via `globalThis`.
   - All CRUD operations (create, update, delete) are executed on the server.
   - Data is reset when the server restarts.

   ### TanStack Query
   - Used on the client to fetch and cache `/api/tasks`.
   - Handles mutations and keeps UI state synchronized after updates.
   - Simplifies loading and error handling.

   ### UI / Forms
   - UI is built with reusable components and styled using Tailwind CSS.
   - Forms use React Hook Form for typed inputs and minimal re-renders.

3. **Known limitations:**
   - No persistence
   - No authentication
   - Backend validation is omitted by requirements
