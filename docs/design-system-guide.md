# SlicerCompare Design System Guide

## Overview

This design system provides a comprehensive set of design tokens (CSS custom properties) for building consistent, accessible, and beautiful UI components.

---

## Color System

### Brand Colors

**Primary Blue** - Technical, trustworthy, professional
- Use for: Primary CTAs, links, focus states, brand elements
- Variable: `--color-primary-{50-950}`
- Example: `var(--color-primary-600)` → #2563eb

**Accent Orange** - Energy, heat, 3D printing warmth
- Use for: Secondary CTAs, highlights, progress indicators, success badges
- Variable: `--color-accent-{50-950}`
- Example: `var(--color-accent-500)` → #f97316

### Semantic Colors

**Success Green** - Confirmations, completed states
```css
background-color: var(--color-success-50);   /* Light background */
color: var(--color-success-700);              /* Text */
border-color: var(--color-success-300);      /* Border */
```

**Error Red** - Errors, failures, destructive actions
```css
background-color: var(--color-error-50);
color: var(--color-error-700);
border-color: var(--color-error-300);
```

**Warning Amber** - Warnings, caution states
```css
background-color: var(--color-warning-50);
color: var(--color-warning-700);
border-color: var(--color-warning-300);
```

**Info Cyan** - Informational messages, tips
```css
background-color: var(--color-info-50);
color: var(--color-info-700);
border-color: var(--color-info-300);
```

### Text Colors

```css
color: var(--color-text-primary);    /* Main headings, body text */
color: var(--color-text-secondary);  /* Subheadings, less important text */
color: var(--color-text-tertiary);   /* Helper text, placeholders */
color: var(--color-text-disabled);   /* Disabled states */
color: var(--color-text-link);       /* Hyperlinks */
```

---

## Typography

### Font Families

```css
font-family: var(--font-sans);  /* Default UI font */
font-family: var(--font-mono);  /* Code, technical data */
```

### Font Sizes

```css
font-size: var(--text-xs);      /* 12px - Small labels, badges */
font-size: var(--text-sm);      /* 14px - Body text secondary */
font-size: var(--text-base);    /* 16px - Default body text */
font-size: var(--text-lg);      /* 18px - Subheadings */
font-size: var(--text-xl);      /* 20px - Section headings */
font-size: var(--text-2xl);     /* 24px - Page titles */
font-size: var(--text-3xl);     /* 30px - Hero headings */
font-size: var(--text-4xl);     /* 36px - Marketing headlines */
```

### Font Weights

```css
font-weight: var(--font-normal);    /* 400 - Body text */
font-weight: var(--font-medium);    /* 500 - Emphasized text */
font-weight: var(--font-semibold);  /* 600 - Subheadings */
font-weight: var(--font-bold);      /* 700 - Headings */
font-weight: var(--font-extrabold); /* 800 - Hero text */
```

---

## Spacing

Use the spacing scale for consistent margins, padding, and gaps:

```css
padding: var(--space-4);    /* 16px - Standard padding */
margin-bottom: var(--space-6); /* 24px - Section spacing */
gap: var(--space-3);        /* 12px - Flex/grid gaps */
```

**Common patterns:**
- `--space-1` to `--space-3`: Component internals
- `--space-4` to `--space-6`: Component padding
- `--space-8` to `--space-12`: Section spacing
- `--space-16` to `--space-32`: Page-level spacing

---

## Border Radius

```css
border-radius: var(--radius-sm);    /* 2px - Subtle rounding */
border-radius: var(--radius-base);  /* 4px - Default */
border-radius: var(--radius-md);    /* 6px - Cards, inputs */
border-radius: var(--radius-lg);    /* 8px - Buttons */
border-radius: var(--radius-xl);    /* 12px - Large cards */
border-radius: var(--radius-2xl);   /* 16px - Modals */
border-radius: var(--radius-full);  /* 9999px - Circles, pills */
```

---

## Shadows

```css
box-shadow: var(--shadow-sm);    /* Subtle depth */
box-shadow: var(--shadow-base);  /* Cards */
box-shadow: var(--shadow-md);    /* Hover states */
box-shadow: var(--shadow-lg);    /* Dropdowns */
box-shadow: var(--shadow-xl);    /* Modals */
```

**Focus shadows:**
```css
box-shadow: var(--shadow-focus-primary);  /* Primary focus ring */
box-shadow: var(--shadow-focus-error);    /* Error focus ring */
box-shadow: var(--shadow-focus-success);  /* Success focus ring */
```

---

## Component Tokens

### Buttons

```css
.btn-primary {
  padding: var(--button-padding-base);
  border-radius: var(--button-radius);
  background-color: var(--color-primary-600);
  color: var(--color-text-inverse);
  box-shadow: var(--button-shadow);
  transition: all var(--transition-base);
}

.btn-primary:hover {
  background-color: var(--color-primary-700);
  box-shadow: var(--button-shadow-hover);
}
```

### Input Fields

```css
.input-field {
  padding: var(--input-padding);
  border: var(--input-border);
  border-radius: var(--input-radius);
  font-size: var(--text-base);
  transition: all var(--transition-fast);
}

.input-field:hover {
  border: var(--input-border-hover);
}

.input-field:focus {
  border: var(--input-border-focus);
  box-shadow: var(--input-shadow-focus);
  outline: none;
}
```

### Cards

```css
.card {
  padding: var(--card-padding);
  border-radius: var(--card-radius);
  border: var(--card-border);
  background-color: var(--color-background-primary);
  box-shadow: var(--card-shadow);
  transition: all var(--transition-base);
}

.card:hover {
  box-shadow: var(--card-shadow-hover);
}
```

### Dropzone

```css
.dropzone {
  padding: var(--dropzone-padding);
  border: var(--dropzone-border-default);
  border-radius: var(--dropzone-radius);
  background-color: var(--dropzone-bg-default);
  transition: all var(--transition-base);
}

.dropzone:hover {
  border: var(--dropzone-border-hover);
  background-color: var(--dropzone-bg-hover);
}

.dropzone.active {
  border: var(--dropzone-border-active);
  background-color: var(--dropzone-bg-active);
}

.dropzone.error {
  border: var(--dropzone-border-error);
  background-color: var(--color-error-50);
}
```

---

## Common Patterns

### Alert/Notification Boxes

#### Success
```css
.alert-success {
  padding: var(--space-4);
  border-radius: var(--radius-lg);
  background-color: var(--color-success-50);
  border: 1px solid var(--color-success-200);
  color: var(--color-success-800);
}
```

#### Error
```css
.alert-error {
  padding: var(--space-4);
  border-radius: var(--radius-lg);
  background-color: var(--color-error-50);
  border: 1px solid var(--color-error-200);
  color: var(--color-error-800);
}
```

#### Warning
```css
.alert-warning {
  padding: var(--space-4);
  border-radius: var(--radius-lg);
  background-color: var(--color-warning-50);
  border: 1px solid var(--color-warning-200);
  color: var(--color-warning-800);
}
```

#### Info
```css
.alert-info {
  padding: var(--space-4);
  border-radius: var(--radius-lg);
  background-color: var(--color-info-50);
  border: 1px solid var(--color-info-200);
  color: var(--color-info-800);
}
```

### Status Badges

```css
.badge {
  display: inline-flex;
  align-items: center;
  padding: var(--badge-padding);
  border-radius: var(--badge-radius);
  font-size: var(--badge-font-size);
  font-weight: var(--font-medium);
  line-height: var(--leading-none);
}

.badge-success {
  background-color: var(--color-success-100);
  color: var(--color-success-700);
}

.badge-error {
  background-color: var(--color-error-100);
  color: var(--color-error-700);
}

.badge-warning {
  background-color: var(--color-warning-100);
  color: var(--color-warning-700);
}

.badge-info {
  background-color: var(--color-info-100);
  color: var(--color-info-700);
}
```

### Progress Bar

```css
.progress-container {
  width: 100%;
  height: var(--progress-height);
  border-radius: var(--progress-radius);
  background-color: var(--progress-bg);
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  border-radius: var(--progress-radius);
  background-color: var(--progress-fill);
  transition: width var(--transition-slow);
}
```

---

## Accessibility

### Focus States

Always include visible focus indicators:

```css
.interactive-element:focus-visible {
  outline: 2px solid var(--color-primary-500);
  outline-offset: 2px;
}
```

Or use the utility class:
```html
<button class="focus-ring">Click me</button>
```

### Color Contrast

All text colors in this system meet WCAG 2.1 Level AA contrast requirements:
- `--color-text-primary` on white: 15.3:1 (AAA)
- `--color-text-secondary` on white: 7.1:1 (AAA)
- `--color-text-tertiary` on white: 4.9:1 (AA)

---

## Dark Mode

The design system includes automatic dark mode support via `prefers-color-scheme`:

```css
/* This happens automatically */
@media (prefers-color-scheme: dark) {
  :root {
    --color-background-primary: var(--color-neutral-900);
    --color-text-primary: var(--color-neutral-50);
    /* ...other overrides */
  }
}
```

**Manual theme switching:**
```html
<html data-theme="dark">  <!-- Force dark mode -->
<html data-theme="light"> <!-- Force light mode -->
```

---

## Tailwind Integration

This design system works seamlessly with Tailwind CSS. You can reference these variables in Tailwind classes:

```jsx
<div className="bg-[var(--color-primary-600)] text-[var(--color-text-inverse)]">
  Primary Button
</div>
```

Or extend your Tailwind config:

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: 'var(--color-primary-50)',
          100: 'var(--color-primary-100)',
          // ...etc
        }
      }
    }
  }
}
```

---

## Migration Guide

### Before (Hardcoded values)
```css
.button {
  background: #3b82f6;
  padding: 8px 16px;
  border-radius: 8px;
  color: white;
}
```

### After (Design tokens)
```css
.button {
  background: var(--color-primary-600);
  padding: var(--button-padding-base);
  border-radius: var(--button-radius);
  color: var(--color-text-inverse);
}
```

---

## Quick Reference

| Category | Variable Pattern | Example |
|----------|-----------------|---------|
| Colors | `--color-{category}-{shade}` | `var(--color-primary-600)` |
| Text | `--text-{size}` | `var(--text-lg)` |
| Spacing | `--space-{number}` | `var(--space-4)` |
| Radius | `--radius-{size}` | `var(--radius-lg)` |
| Shadow | `--shadow-{size}` | `var(--shadow-md)` |
| Transition | `--transition-{speed}` | `var(--transition-base)` |

---

## Examples in Action

See `/src/components/` for real-world component implementations using this design system.

---

## Resources

- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [MDN: CSS Custom Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/--*)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
