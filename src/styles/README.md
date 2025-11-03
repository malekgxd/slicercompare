# SlicerCompare Design System

## 🎨 Overview

A complete design system built with CSS custom properties (CSS variables) that provides:
- Consistent color palette
- Typography scale
- Spacing system
- Component tokens
- Accessibility standards
- Dark mode support

---

## 📁 Files

```
src/styles/
├── design-system.css      # Core design tokens (CSS variables)
├── component-examples.css # Pre-built component styles
└── README.md             # This file
```

---

## 🚀 Getting Started

### 1. Already Imported!

The design system is already imported in `src/index.css`:

```css
@import './styles/design-system.css';
```

### 2. Use in Your Components

**Option A: Direct CSS Variables**
```tsx
<div style={{
  color: 'var(--color-primary-600)',
  padding: 'var(--space-4)',
  borderRadius: 'var(--radius-lg)'
}}>
  Hello World
</div>
```

**Option B: Tailwind Classes (Recommended)**
```tsx
<div className="text-[var(--color-primary-600)] p-[var(--space-4)] rounded-[var(--radius-lg)]">
  Hello World
</div>
```

**Option C: Pre-built Component Classes**
```tsx
import '@/styles/component-examples.css';

<button className="btn-primary">Click Me</button>
<div className="alert alert-error">Error message</div>
<div className="card">Card content</div>
```

---

## 🎨 Color Palette

### Brand Colors

| Color | Variable | Hex | Usage |
|-------|----------|-----|-------|
| Primary Blue | `--color-primary-600` | #2563eb | CTAs, links, focus states |
| Accent Orange | `--color-accent-500` | #f97316 | Highlights, progress, energy |

### Semantic Colors

| Type | Background | Text | Border |
|------|------------|------|--------|
| Success | `--color-success-50` | `--color-success-700` | `--color-success-300` |
| Error | `--color-error-50` | `--color-error-700` | `--color-error-300` |
| Warning | `--color-warning-50` | `--color-warning-700` | `--color-warning-300` |
| Info | `--color-info-50` | `--color-info-700` | `--color-info-300` |

---

## 📝 Quick Examples

### Error Alert Box (What you need now!)

```tsx
<div className="bg-[var(--color-error-50)] border border-[var(--color-error-200)] rounded-[var(--radius-lg)] p-[var(--space-4)]">
  <div className="flex items-start gap-[var(--space-3)]">
    <svg className="w-6 h-6 text-[var(--color-error-600)]">
      {/* X icon */}
    </svg>
    <div>
      <h3 className="font-[var(--font-semibold)] text-[var(--color-error-900)]">
        Upload Failed
      </h3>
      <p className="text-sm text-[var(--color-error-700)] mt-[var(--space-1)]">
        Could not connect to server. Please check your connection.
      </p>
      <button className="mt-[var(--space-3)] text-sm text-[var(--color-error-600)] underline">
        Try Again
      </button>
    </div>
  </div>
</div>
```

Or use the pre-built class:
```tsx
import '@/styles/component-examples.css';

<div className="alert alert-error">
  <div className="alert-icon">❌</div>
  <div>
    <div className="alert-title">Upload Failed</div>
    <div className="alert-message">Could not connect to server.</div>
    <div className="alert-action">
      <button>Try Again</button>
    </div>
  </div>
</div>
```

### Primary Button

```tsx
<button className="bg-[var(--color-primary-600)] hover:bg-[var(--color-primary-700)] text-white px-[var(--space-4)] py-[var(--space-2)] rounded-[var(--radius-lg)] shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-base)] transition-all duration-[var(--transition-base)]">
  Upload File
</button>
```

Or:
```tsx
<button className="btn-primary">Upload File</button>
```

### Success State

```tsx
<div className="bg-[var(--color-success-50)] border border-[var(--color-success-200)] rounded-[var(--radius-lg)] p-[var(--space-4)]">
  <div className="flex items-center gap-[var(--space-3)]">
    <svg className="w-6 h-6 text-[var(--color-success-600)]">✓</svg>
    <div>
      <h3 className="font-[var(--font-semibold)] text-[var(--color-success-900)]">
        Upload Successful!
      </h3>
      <p className="text-sm text-[var(--color-success-700)]">
        Your file has been uploaded and is ready for processing.
      </p>
    </div>
  </div>
</div>
```

### Card with Hover

```tsx
<div className="p-[var(--card-padding)] rounded-[var(--card-radius)] border-[var(--card-border)] bg-white shadow-[var(--card-shadow)] hover:shadow-[var(--card-shadow-hover)] transition-all duration-[var(--transition-base)]">
  <h3 className="text-[var(--text-xl)] font-[var(--font-semibold)] text-[var(--color-text-primary)]">
    Configuration A
  </h3>
  <p className="text-[var(--color-text-secondary)] mt-[var(--space-2)]">
    Fast print settings
  </p>
</div>
```

---

## 🔧 Common Patterns

### Upload Dropzone with States

```tsx
<div className={`
  p-[var(--dropzone-padding)]
  rounded-[var(--dropzone-radius)]
  border-2 border-dashed
  ${isDragging
    ? 'border-[var(--color-primary-500)] bg-[var(--color-primary-50)]'
    : hasError
      ? 'border-[var(--color-error-400)] bg-[var(--color-error-50)]'
      : 'border-[var(--color-neutral-300)] hover:border-[var(--color-primary-400)]'
  }
  transition-all duration-[var(--transition-base)]
  cursor-pointer
`}>
  {/* Dropzone content */}
</div>
```

### Status Badge

```tsx
<span className="inline-flex items-center px-[var(--space-2)] py-[var(--space-1)] rounded-[var(--radius-base)] text-[var(--text-xs)] font-[var(--font-medium)] bg-[var(--color-success-100)] text-[var(--color-success-700)]">
  ✓ Complete
</span>
```

### Progress Bar

```tsx
<div className="w-full h-[var(--progress-height)] rounded-[var(--progress-radius)] bg-[var(--color-neutral-200)] overflow-hidden">
  <div
    className="h-full rounded-[var(--progress-radius)] bg-[var(--color-primary-500)] transition-all duration-[var(--transition-slow)]"
    style={{ width: `${progress}%` }}
  />
</div>
```

---

## 📖 Full Documentation

See `docs/design-system-guide.md` for:
- Complete color reference
- Typography scales
- Spacing system
- Component patterns
- Accessibility guidelines
- Dark mode usage
- Migration guide

---

## ✨ Pre-built Component Classes

Import `component-examples.css` to use these:

| Class | Description |
|-------|-------------|
| `.btn-primary` | Primary action button (blue) |
| `.btn-secondary` | Secondary button (white/border) |
| `.btn-accent` | Accent button (orange) |
| `.alert-success` | Success message box (green) |
| `.alert-error` | Error message box (red) |
| `.alert-warning` | Warning message box (amber) |
| `.alert-info` | Info message box (cyan) |
| `.badge-success` | Success badge |
| `.badge-error` | Error badge |
| `.card` | Standard card container |
| `.dropzone` | File upload dropzone |
| `.input` | Text input field |
| `.spinner` | Loading spinner |

See `component-examples.css` for complete list and usage.

---

## 🌙 Dark Mode

Dark mode is automatically supported via `prefers-color-scheme`:

```tsx
// Force light mode
<html data-theme="light">

// Force dark mode
<html data-theme="dark">

// Auto (system preference)
<html>
```

---

## ♿ Accessibility

All colors meet WCAG 2.1 Level AA contrast requirements.

**Always include focus states:**
```tsx
<button className="focus:outline-2 focus:outline-[var(--color-primary-500)] focus:outline-offset-2">
  Accessible Button
</button>
```

Or use the utility:
```tsx
<button className="focus-ring">Button</button>
```

---

## 🎯 Next Steps

1. **Fix Error State** - Apply error colors to your upload component
2. **Add Primary Button** - Style your CTAs with primary color
3. **Success Feedback** - Show green success messages
4. **Hover States** - Add color to interactive elements

---

## 💡 Tips

- **Use semantic tokens** - `--color-text-primary` instead of `--color-neutral-900`
- **Consistency is key** - Use the same spacing values throughout
- **Test in dark mode** - Make sure it looks good both ways
- **Check contrast** - Use browser DevTools to verify accessibility

---

## 🆘 Help

**Q: Colors not showing up?**
A: Make sure `design-system.css` is imported in `index.css` (it already is!)

**Q: Which color should I use?**
A: Check the semantic colors first (`success`, `error`, etc.), then brand colors

**Q: Can I customize the colors?**
A: Yes! Edit the CSS variables in `design-system.css`

**Q: Should I use Tailwind or custom classes?**
A: Both work! Tailwind for custom components, pre-built classes for speed

---

## 📚 Resources

- [Full Guide](../../docs/design-system-guide.md)
- [Component Examples](./component-examples.css)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [CSS Custom Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/--*)

---

**Built with ❤️ for SlicerCompare**
