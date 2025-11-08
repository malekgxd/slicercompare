# Suggested Commands for SlicerCompare

## Development

### Start Development Servers

**Frontend (Vite dev server):**
```bash
npm run dev
```
- Runs on `http://localhost:5173`
- Hot module replacement enabled

**Backend (Express server with watch mode):**
```bash
npm run server
```
- Runs on `http://localhost:3001`
- Auto-restarts on file changes (tsx watch)

### Build

**Production build:**
```bash
npm run build
```
- Compiles TypeScript (`tsc -b`)
- Builds frontend with Vite

**Preview production build:**
```bash
npm run preview
```

## Testing

**Run tests:**
```bash
npm test
# or
npm run test
```
- Uses Vitest test runner

**Run performance tests:**
```bash
npm run test:perf        # Performance baseline
npm run test:cli         # CLI performance
npm run test:batch       # Batch processing performance
npm run test:perf:all    # All performance tests
```

## Code Quality

**Lint code:**
```bash
npm run lint
```
- ESLint with TypeScript support
- React hooks and React refresh plugins

## System Commands (Linux/WSL)

**File operations:**
```bash
ls              # List files
mkdir <dir>     # Create directory
rm <file>       # Remove file
cat <file>      # Display file contents
```

**Git operations:**
```bash
git status      # Check repository status
git add .       # Stage all changes
git commit -m "message"  # Commit changes
git push        # Push to remote
git pull        # Pull from remote
```

**Process management:**
```bash
ps aux | grep node    # Find Node processes
kill -9 <PID>         # Kill process by ID
```

**File search:**
```bash
find . -name "*.tsx"  # Find files by pattern
grep -r "pattern" .   # Search in files
```

## Environment Setup

**Create .env file:**
```bash
cp .env.example .env
```

Required environment variables:
- `SUPABASE_URL`: Your Supabase project URL
- `SUPABASE_ANON_KEY`: Your Supabase anon key
- `NODE_ENV`: development/production
- `PORT`: Backend server port (default: 3001)
- `BAMBU_CLI_PATH`: Path to Bambu Slicer CLI (optional if in PATH)