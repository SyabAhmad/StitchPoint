# Active Context

## Current Project State
- Project is functional with core e-commerce features implemented
- Frontend: React 19 with Vite 7, Tailwind CSS 4
- Backend: Flask with PostgreSQL, JWT authentication working
- 11 API blueprints registered and functional

## Current Goals
- Platform is operational for customers, managers, and super admins
- TODO.md shows Shop and Collections features as completed
- Memory bank populated for future session context

## Known Technical Details
- **No TypeScript**: JavaScript only (no tsconfig.json)
- **No Test Framework**: No Jest, Vitest, or testing setup configured
- **Python venv**: Located at `server/stitchserver/` (Python 3.10)
- **Default Commission Rates**: Auto-initialized on app start
- **Build Commands**: `npm run dev` (port 5173), `npm run build` (to dist/), `npm run lint`
- **Backend Start**: `cd server && python app.py` (runs on http://127.0.0.1:5000)

## Current Blockers
- None identified
