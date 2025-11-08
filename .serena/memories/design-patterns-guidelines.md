# Design Patterns and Guidelines

## React Patterns

### Component Composition
- Prefer composition over inheritance
- Use children props for flexible layouts
- Extract reusable components

### State Management
- **Local state:** `useState` for component-specific state
- **Shared state:** React Context API for app-wide state
- **Server state:** Fetch in components, consider caching strategies

### Custom Hooks
- Extract reusable logic into custom hooks
- Prefix with `use` (e.g., `usePolling`, `useComparisonResults`)
- Keep hooks focused on single responsibility

Example hooks in codebase:
- `useComparisonResults`: Fetch and manage comparison data
- `usePolling`: Poll for updates

### Error Handling Pattern
- Use Error Boundaries for React component errors
- Toast notifications for user-facing errors
- Console logging for debugging

## Backend Patterns

### Service Layer Architecture
Services handle business logic:
- `bambu-cli.ts`: Bambu Slicer CLI integration
- `gcode-parser.ts`: G-code file parsing
- `settings-generator.ts`: Configuration settings generation
- `slicing-batch.ts`: Batch processing logic

### Route Organization
Routes handle HTTP requests/responses:
- `upload.ts`: File upload endpoints
- `slicing.ts`: Slicing operation endpoints
- `download.ts`: G-code download endpoints

### Middleware
- Error handler middleware for centralized error handling
- CORS middleware for cross-origin requests
- Multer for file uploads

### Error Translation
- Use `error-translator.ts` to convert technical errors to user-friendly messages
- Maintain consistent error response format

### Retry Logic
- Use `retry.ts` utility for operations that may fail temporarily
- Configure retry attempts and delays appropriately

## File Upload Pattern

Current implementation uses `react-dropzone`:
- Drag-and-drop support
- File type validation
- Size limits
- Preview before upload

## API Communication

### Frontend to Backend
- REST API using fetch
- Proper error handling
- Loading states during requests

### Response Format
```typescript
{
  success: boolean;
  data?: any;
  error?: string;
}
```

## Database Patterns

### Supabase Integration
- Client-side: Use `src/lib/supabase/client.ts`
- Server-side: Use `src/lib/supabase/server.ts` (if needed)
- Type-safe queries using generated types

### Table Naming
- snake_case for tables and columns
- UUID primary keys
- Timestamps: `created_at`, `updated_at`

## File Storage

### Local Storage Structure
```
storage/
├── uploads/     # Original STL/3MF files
└── gcode/       # Generated G-code files
```

### File Naming Convention
- Configuration name + original filename
- UUID for uniqueness when needed

## Styling Patterns

### Design System Usage
1. Use design tokens (CSS custom properties)
2. Tailwind utilities for layout
3. Component-specific CSS when needed
4. Consistent spacing scale
5. Accessible color contrast

### Component Styling
```css
/* Use design tokens */
.button {
  padding: var(--button-padding-base);
  background: var(--color-primary-600);
  border-radius: var(--button-radius);
}

/* Or Tailwind with custom properties */
<button className="bg-[var(--color-primary-600)] px-4 py-2 rounded-lg">
```

## Accessibility Guidelines

- Semantic HTML elements
- ARIA labels where needed
- Keyboard navigation support
- Focus states (use `focus-ring` utility)
- Color contrast WCAG 2.1 Level AA minimum
- Alt text for images

## Performance Considerations

- Lazy load routes/components when appropriate
- Optimize images
- Minimize bundle size
- Efficient polling intervals
- Batch operations when possible

## Methodology

### BMAD (Business-Minded Agile Development)
- Project follows BMAD methodology
- Documentation in `bmad/` directory
- Stories, epics, and contexts in `docs/`
- Technical decisions documented in `docs/technical-decisions.md`