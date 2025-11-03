# AI Frontend Implementation Prompts
## SlicerCompare UI Redesign

These prompts are optimized for AI-assisted development tools (v0, Cursor, GitHub Copilot, etc.)

---

## Prompt 1: Update Design System with High-Contrast Colors

```
Update the design system CSS file (src/styles/design-system.css) to add high-contrast color variables for dark theme accessibility:

Add these CSS custom properties to the :root selector:

/* Dark theme backgrounds - proper layering */
--color-bg-app: #0f172a;           /* App base - neutral-900 */
--color-bg-card: #1e293b;          /* Card surfaces - neutral-800 */
--color-bg-card-elevated: #334155; /* Elevated cards - neutral-700 */
--color-bg-input: #1e293b;         /* Input backgrounds */

/* High contrast text colors - WCAG AAA compliant */
--color-text-heading: #f1f5f9;     /* Headings - neutral-100 (16.5:1 contrast) */
--color-text-body: #e2e8f0;        /* Body text - neutral-200 (14.7:1 contrast) */
--color-text-secondary: #cbd5e1;   /* Secondary - neutral-300 (10.3:1 contrast) */
--color-text-muted: #94a3b8;       /* Muted - neutral-400 (6.1:1 contrast) */
--color-text-accent: #60a5fa;      /* Accent links - primary-400 */

/* Upload component specific */
--upload-border-default: #475569;   /* neutral-600 */
--upload-border-hover: #60a5fa;     /* primary-400 */
--upload-border-active: #3b82f6;    /* primary-500 */
--upload-bg: #0f172a;               /* Slightly darker than card */
--upload-bg-hover: rgba(59, 130, 246, 0.05);  /* Subtle blue tint */
--upload-bg-active: rgba(59, 130, 246, 0.1);  /* More prominent blue */
--upload-height-compact: 140px;
--upload-padding-compact: 1.5rem;

/* Semantic colors for dark theme */
--color-success-bg: rgba(34, 197, 94, 0.15);
--color-success-border: #22c55e;
--color-success-text: #86efac;

--color-error-bg: rgba(239, 68, 68, 0.15);
--color-error-border: #ef4444;
--color-error-text: #fca5a5;

Also create utility classes:
.text-heading { color: var(--color-text-heading); }
.text-body { color: var(--color-text-body); }
.text-secondary-contrast { color: var(--color-text-secondary); }
.text-muted { color: var(--color-text-muted); }

.bg-app { background-color: var(--color-bg-app); }
.bg-card { background-color: var(--color-bg-card); }
.bg-card-elevated { background-color: var(--color-bg-card-elevated); }

Requirements:
- All colors must meet WCAG AA contrast ratios (4.5:1 for normal text)
- Preserve existing design system structure
- Add comments explaining contrast ratios
```

---

## Prompt 2: Redesign HomePage with High-Contrast Colors

```
Update src/client/pages/HomePage.tsx to use high-contrast colors and remove inline styles:

CHANGES REQUIRED:

1. Header Section:
   - Remove inline style `style={{ backgroundColor: '#2a3142' }}`
   - Replace with: `className="bg-card"`
   - Update h1 to use: `className="text-4xl sm:text-5xl font-bold text-heading mb-3"`
   - Update subtitle p to use: `className="text-lg sm:text-xl text-body mb-4"`
   - For the time-saving badge:
     * Remove inline styles
     * Use: `className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border"
             style={{
               backgroundColor: 'rgba(59, 130, 246, 0.2)',
               borderColor: '#60a5fa'
             }}`
     * Update icon color: `className="w-5 h-5" style={{ color: '#93c5fd' }}`
     * Update text: `className="font-medium" style={{ color: '#bfdbfe' }}`

2. Upload Section Card:
   - Remove: `style={{ backgroundColor: '#2a3142' }}`
   - Replace with: `className="bg-card"`
   - Update h2 to: `className="text-xl font-bold text-accent mb-3"
                    style={{ color: '#93c5fd' }}`  /* primary-300 */

3. "How It Works" Section:
   - Remove: `style={{ backgroundColor: '#2a3142' }}`
   - Replace with: `className="bg-card"`
   - Update h3 to: `className="text-2xl font-bold mb-6"
                    style={{ color: '#a5b4fc' }}`  /* indigo-300 for variety */
   - Update step text spans to: `className="pt-1 text-base"
                                 style={{ color: '#e2e8f0' }}`
   - Ensure number badges use:
     `style={{ backgroundColor: '#3b82f6', color: '#ffffff' }}`
   - Update "View Example Results" button text color to white

4. Reduce Padding:
   - Change main container from `p-3 sm:p-6` to `p-3 sm:p-5`
   - Change header card padding from `p-8` to `p-6`
   - Change info section padding from `p-6` to `p-5`

Requirements:
- ALL text must have high contrast against dark backgrounds
- Remove ALL inline backgroundColor styles for #2a3142
- Use CSS variables where possible
- Maintain existing component structure
- Preserve responsive design
```

---

## Prompt 3: Create Compact FileUpload Component

```
Redesign src/client/components/FileUpload.tsx to be 60% more compact while maintaining functionality:

NEW LAYOUT SPECIFICATIONS:

1. Default Upload Zone (when no file uploaded):
   ```tsx
   <div
     {...getRootProps()}
     className="border-2 border-dashed rounded-lg p-6 cursor-pointer transition-all duration-200"
     style={{
       borderColor: isDragActive ? '#3b82f6' : error ? '#ef4444' : '#475569',
       borderStyle: isDragActive ? 'solid' : 'dashed',
       backgroundColor: isDragActive
         ? 'rgba(59, 130, 246, 0.1)'
         : error
           ? 'rgba(239, 68, 68, 0.1)'
           : '#0f172a'
     }}
   >
     <div className="flex items-center gap-4">
       {/* Icon - compact 40px */}
       <svg className="h-10 w-10 flex-shrink-0"
            style={{
              color: isDragActive ? '#60a5fa' : error ? '#fca5a5' : '#94a3b8'
            }}>
         {/* existing SVG path */}
       </svg>

       {/* Text - horizontal layout */}
       <div className="flex-1">
         <p className="text-base font-medium"
            style={{ color: '#e2e8f0' }}>
           {isDragActive
             ? 'Drop file here...'
             : 'Drag STL or 3MF file here, or click to browse'}
         </p>
         <p className="text-sm mt-1"
            style={{ color: '#94a3b8' }}>
           Maximum file size: 100MB
         </p>
       </div>
     </div>
   </div>
   ```

2. Hover State:
   Add to className when hovering (not dragging):
   ```tsx
   ${!isDragActive && !error ? 'hover:border-primary-400' : ''}
   ```
   Add to style for hover:
   ```tsx
   backgroundColor: !isDragActive ? 'rgba(59, 130, 246, 0.05)' : ...
   ```

3. Success State (file uploaded):
   ```tsx
   <div className="p-4 rounded-lg flex items-center justify-between gap-4"
        style={{
          backgroundColor: 'rgba(34, 197, 94, 0.15)',
          border: '1px solid #22c55e'
        }}>
     <div className="flex items-center gap-3 flex-1 min-w-0">
       <svg className="h-6 w-6 flex-shrink-0"
            style={{ color: '#86efac' }}>
         {/* checkmark icon */}
       </svg>
       <div className="flex-1 min-w-0">
         <p className="font-medium truncate"
            style={{ color: '#f1f5f9' }}>
           {uploadedFile.filename}
         </p>
         <p className="text-sm"
            style={{ color: '#cbd5e1' }}>
           {(uploadedFile.fileSize / 1024 / 1024).toFixed(2)} MB
         </p>
       </div>
     </div>
     <button className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
             style={{ backgroundColor: '#22c55e', color: '#ffffff' }}
             onClick={() => setUploadedFile(null)}>
       Upload Another
     </button>
   </div>
   ```

4. Error State:
   ```tsx
   <div className="p-4 rounded-lg"
        style={{
          backgroundColor: 'rgba(239, 68, 68, 0.15)',
          border: '1px solid #ef4444'
        }}>
     <div className="flex items-start gap-3">
       <svg className="h-5 w-5 flex-shrink-0"
            style={{ color: '#fca5a5' }}>
         {/* warning icon */}
       </svg>
       <div className="flex-1">
         <p className="text-sm font-medium"
            style={{ color: '#fca5a5' }}>
           Upload Failed
         </p>
         <p className="text-sm mt-1"
            style={{ color: '#e2e8f0' }}>
           {error}
         </p>
         <button className="text-sm mt-2 underline"
                 style={{ color: '#fca5a5' }}
                 onClick={() => setError(null)}>
           Try Again
         </button>
       </div>
     </div>
   </div>
   ```

5. Loading State:
   - Keep existing LoadingSpinner
   - Ensure message color is `#e2e8f0`

ACCESSIBILITY REQUIREMENTS:
- Add aria-label="Upload 3D model file" to root div
- Add role="status" aria-live="polite" to success message
- Add role="alert" to error message
- Ensure focus visible state: outline: 2px solid #60a5fa

DIMENSIONAL REQUIREMENTS:
- Total height when empty: ~140px (currently ~350px)
- Padding: 24px (currently 48px+)
- Icon size: 40px (currently larger)
- Reduce vertical spacing throughout

RESPONSIVE:
- On mobile (< 640px): Stack icon and text vertically, center align
- Tablet+: Horizontal layout as specified
```

---

## Prompt 4: Update Global App Background

```
Update src/App.tsx to use the new app background color:

Find the main app container div and update it to use the new background color system.

Change from existing background to:
```tsx
<div className="min-h-screen" style={{ backgroundColor: '#0f172a' }}>
  {/* rest of app */}
</div>
```

Or if using Tailwind:
```tsx
<div className="min-h-screen bg-neutral-900">
  {/* rest of app */}
</div>
```

This provides the base dark background (#0f172a / neutral-900) that cards (#1e293b / neutral-800) will sit on top of, creating proper visual layering.
```

---

## Prompt 5: Accessibility Audit & Keyboard Navigation

```
Add accessibility improvements to FileUpload component:

1. Keyboard Navigation:
   - Ensure upload zone is focusable: tabIndex={0}
   - Add keyboard handlers:
     ```tsx
     const handleKeyDown = (e: React.KeyboardEvent) => {
       if (e.key === 'Enter' || e.key === ' ') {
         e.preventDefault();
         // Trigger file picker
         inputRef.current?.click();
       }
     };
     ```

2. ARIA Labels:
   ```tsx
   <div
     {...getRootProps()}
     role="button"
     aria-label="Upload 3D model file. Drag and drop or click to browse."
     aria-describedby="upload-instructions"
     tabIndex={0}
     onKeyDown={handleKeyDown}
   >
   ```

3. Screen Reader Announcements:
   ```tsx
   {uploadedFile && (
     <div role="status" aria-live="polite" className="sr-only">
       File {uploadedFile.filename} uploaded successfully
     </div>
   )}

   {error && (
     <div role="alert" aria-live="assertive" className="sr-only">
       Upload error: {error}
     </div>
   )}
   ```

4. Focus Visible:
   Add to upload zone style:
   ```css
   &:focus-visible {
     outline: 2px solid #60a5fa;
     outline-offset: 2px;
   }
   ```

5. Color Blindness:
   - Ensure error/success states use BOTH color AND icons
   - Never rely on color alone to convey information

Requirements:
- Test with keyboard only (no mouse)
- Test with screen reader (NVDA, JAWS, or VoiceOver)
- Verify all contrast ratios with WebAIM contrast checker
```

---

## Prompt 6: Responsive Mobile Optimization

```
Optimize FileUpload component for mobile devices:

Update the upload zone layout to be responsive:

```tsx
<div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4
                text-center sm:text-left">
  {/* Icon */}
  <svg className="h-12 w-12 sm:h-10 sm:w-10 flex-shrink-0"
       style={{ color: '#94a3b8' }}>
    {/* icon path */}
  </svg>

  {/* Text content */}
  <div className="flex-1">
    <p className="text-sm sm:text-base font-medium"
       style={{ color: '#e2e8f0' }}>
      {isMobile
        ? 'Tap to upload STL or 3MF file'
        : 'Drag STL or 3MF file here, or click to browse'}
    </p>
    <p className="text-xs sm:text-sm mt-1"
       style={{ color: '#94a3b8' }}>
      Max 100MB
    </p>
  </div>
</div>
```

Mobile-specific requirements:
- Touch targets minimum 44x44px
- Stack layout on screens < 640px
- Larger icon on mobile for better visibility
- Simplified text on mobile
- Test on actual mobile devices
```

---

## Prompt 7: Add Micro-interactions & Polish

```
Add smooth micro-interactions to FileUpload component:

1. Upload Zone Hover Effect:
   ```tsx
   className={`
     transition-all duration-200 ease-out
     ${!isDragActive && !error ? 'hover:scale-[1.01]' : ''}
   `}
   ```

2. Success Animation:
   ```tsx
   // Add to success state div
   className="animate-fadeIn"

   // Add to CSS
   @keyframes fadeIn {
     from {
       opacity: 0;
       transform: translateY(-10px);
     }
     to {
       opacity: 1;
       transform: translateY(0);
     }
   }
   .animate-fadeIn {
     animation: fadeIn 0.3s ease-out;
   }
   ```

3. Error Shake Animation:
   ```tsx
   // Add to error state div
   className="animate-shake"

   // Add to CSS
   @keyframes shake {
     0%, 100% { transform: translateX(0); }
     25% { transform: translateX(-5px); }
     75% { transform: translateX(5px); }
   }
   .animate-shake {
     animation: shake 0.3s ease-in-out;
   }
   ```

4. Loading Pulse:
   ```tsx
   {isUploading && (
     <div className="mt-4 flex items-center justify-center gap-2">
       <div className="animate-pulse">
         <LoadingSpinner size="md" />
       </div>
       <p className="text-sm" style={{ color: '#e2e8f0' }}>
         Uploading...
       </p>
     </div>
   )}
   ```

5. Focus Ring Animation:
   ```css
   .upload-zone:focus-visible {
     outline: 2px solid #60a5fa;
     outline-offset: 2px;
     animation: focusRing 0.2s ease-out;
   }

   @keyframes focusRing {
     from {
       outline-offset: 0px;
       outline-width: 0px;
     }
     to {
       outline-offset: 2px;
       outline-width: 2px;
     }
   }
   ```

Requirements:
- All animations should be subtle and performant
- Respect prefers-reduced-motion media query
- Use CSS transforms for better performance
- Keep durations under 300ms
```

---

## Testing Checklist

After implementing these prompts, verify:

- [ ] **Contrast**: Use WebAIM Contrast Checker - all text must be 4.5:1 or higher
- [ ] **Keyboard**: Tab through entire interface, activate upload with Space/Enter
- [ ] **Screen Reader**: Test announcements with NVDA/JAWS/VoiceOver
- [ ] **Mobile**: Test on actual devices, verify touch targets are 44x44px
- [ ] **Responsive**: Test breakpoints at 640px, 768px, 1024px
- [ ] **Upload States**: Test default, hover, drag, uploading, success, error
- [ ] **Performance**: Verify smooth 60fps animations
- [ ] **Cross-browser**: Test in Chrome, Firefox, Safari, Edge

---

## Implementation Order

1. ✅ Prompt 1: Design System (foundation)
2. ✅ Prompt 4: App Background (base layer)
3. ✅ Prompt 2: HomePage Colors (content layer)
4. ✅ Prompt 3: Compact FileUpload (key component)
5. ✅ Prompt 5: Accessibility (compliance)
6. ✅ Prompt 6: Mobile Optimization (responsive)
7. ✅ Prompt 7: Micro-interactions (polish)

---

## Quick Start Commands

```bash
# Before starting, ensure dev server is running
npm run dev

# Open in browser
http://localhost:5173

# For testing with screen reader
# Windows: Download NVDA (free)
# Mac: Enable VoiceOver (Cmd + F5)
# Linux: Enable Orca

# For contrast checking
# Visit: https://webaim.org/resources/contrastchecker/
```

---

**These prompts provide complete, copy-paste instructions for AI coding assistants to implement the UX redesign with high-contrast colors and compact layouts.**
