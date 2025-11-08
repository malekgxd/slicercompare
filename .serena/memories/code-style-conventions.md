# Code Style and Conventions

## TypeScript

### General
- **TypeScript Version:** 5.9+
- **Strict Mode:** Enabled
- **File Extensions:** `.ts` for TypeScript, `.tsx` for React components

### Naming Conventions
- **Files:** kebab-case for files (e.g., `file-upload.ts`, `HomePage.tsx`)
- **Components:** PascalCase for React components (e.g., `FileUpload`, `ConfigurationForm`)
- **Functions:** camelCase for functions (e.g., `handleUpload`, `parseGcode`)
- **Variables:** camelCase for variables
- **Constants:** UPPER_SNAKE_CASE for true constants (e.g., `MAX_FILE_SIZE`)
- **Types/Interfaces:** PascalCase (e.g., `Configuration`, `SessionData`)
- **Database:** snake_case for table names and columns

### React Components
- **Style:** Functional components with hooks (no class components)
- **Props typing:** Always define explicit prop types using TypeScript interfaces
- **Export:** Named exports preferred for components

Example:
```tsx
interface FileUploadProps {
  onUpload: (file: File) => void;
  maxSize?: number;
}

export function FileUpload({ onUpload, maxSize }: FileUploadProps) {
  // Component implementation
}
```

### Type Annotations
- Always provide explicit return types for functions
- Use type inference where it's clear
- Avoid `any` - use `unknown` or proper types

### Imports
- Group imports: external libraries first, then internal modules
- Use absolute imports when configured

## CSS/Styling

### Tailwind CSS 4.0
- **Primary approach:** Use Tailwind utility classes
- **Design tokens:** Use CSS custom properties defined in design system
- **Component styles:** Extract to CSS when needed for reusability

### Design System
- Use design tokens from `src/styles/design-system.css`
- Color variables: `var(--color-primary-600)`, `var(--color-accent-500)`
- Spacing: `var(--space-4)`, `var(--space-6)`
- Typography: `var(--text-lg)`, `var(--font-semibold)`
- Radius: `var(--radius-lg)`, `var(--radius-md)`
- Shadows: `var(--shadow-md)`, `var(--shadow-focus-primary)`

### Component Tokens
- Buttons: `var(--button-padding-base)`, `var(--button-radius)`
- Inputs: `var(--input-padding)`, `var(--input-border-focus)`
- Cards: `var(--card-padding)`, `var(--card-shadow)`
- Dropzone: `var(--dropzone-border-default)`, `var(--dropzone-bg-hover)`

## File Organization

### Component Structure
```tsx
// 1. External imports
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// 2. Internal imports
import { validateFile } from '../utils/validation';
import type { FileUploadProps } from '../types';

// 3. Component definition
export function ComponentName({ prop1, prop2 }: Props) {
  // Hooks first
  const [state, setState] = useState();
  
  // Event handlers
  const handleEvent = () => {};
  
  // JSX return
  return <div>...</div>;
}
```

### Service Files
- One responsibility per service file
- Export functions, not default objects
- Clear, descriptive function names

## Error Handling
- Use try-catch blocks for async operations
- Provide user-friendly error messages
- Log errors for debugging (using logger utility)
- Return typed errors when appropriate

## Comments and Documentation
- **TSDoc comments** for public APIs and exported functions
- **Inline comments** for complex logic only
- **Self-documenting code** preferred - clear names over comments
- **README files** for major directories/modules

## Testing
- Test files co-located with source files or in `tests/` directory
- Test file naming: `*.test.ts` or `*.test.tsx`
- Use descriptive test names: `it('should upload file when valid')`
- Follow AAA pattern: Arrange, Act, Assert