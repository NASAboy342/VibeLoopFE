# VibeLoop Frontend Constitution

## Core Principles

### I. Vue 3 Composition API First
All components must use Vue 3 Composition API with `<script setup>` syntax; No Options API allowed; Use `ref`, `reactive`, `computed`, `watch` for reactivity; Prefer `defineProps`, `defineEmits` for component communication; TypeScript strict mode enabled - all types must be explicitly defined.

### II. TypeScript Strict Mode (NON-NEGOTIABLE)
TypeScript strict mode must be enabled at all times; All variables, functions, props, and return types must have explicit type annotations; No `any` types allowed - use `unknown` or proper type definitions; Interface over type alias for object shapes; Use type guards for runtime type safety.

### III. Composables for Reusable Logic
Extract reusable logic into composables following the `use[Feature]` naming convention; Composables must be placed in `src/composables/` directory; Each composable should have a single responsibility; Return only what consumers need; Properly handle lifecycle and cleanup (onUnmounted, watch cleanup).

### IV. DaisyUI Component Library Standard
Leverage DaisyUI components for all UI elements: `btn`, `card`, `modal`, `dropdown`, `checkbox`, `input`, `textarea`, `select`, `badge`, `alert`, etc.; Use Tailwind CSS utility classes for custom styling; Follow DaisyUI theming system; Maintain consistent spacing and color patterns across the application.

### V. Backend API Integration
All data fetching must be abstracted in dedicated API service files or composables; API calls should be placed in `src/api/` or within composables; Mock data is allowed within API methods for development purposes; Use TypeScript interfaces to define API request/response types; Handle loading, error, and success states consistently.

## Code Quality Standards

### Readability and Maintainability
Code must be self-documenting with clear variable and function names; Components should be small and focused (< 200 lines preferred); Use proper TypeScript types instead of comments to explain intent; Avoid deeply nested logic - extract into separate functions or composables; Consistent file structure: imports → types → composables → reactive state → computed → methods → lifecycle hooks.

### Component Structure
Components must follow this structure:
- Place in appropriate directory (`src/components/`, `src/views/`, `src/layouts/`)
- Use PascalCase for component names
- Single File Components (SFC) with `<script setup lang="ts">`, `<template>`, `<style scoped>`
- Props and emits must be typed using TypeScript interfaces
- Keep template logic minimal - move complex computations to computed properties or methods

### No Testing Requirements
No unit tests, integration tests, or E2E tests required; Focus on writing clean, readable, and maintainable code instead; Manual testing and code reviews are sufficient for quality assurance; However, type safety through TypeScript strict mode is mandatory.

## Technical Stack Requirements

### Required Technologies
- **Framework**: Vue 3 with Composition API
- **Language**: TypeScript (strict mode enabled)
- **Styling**: Tailwind CSS + DaisyUI component library
- **Build Tool**: Vite
- **State Management**: Composables and Vue reactivity (Pinia if needed for complex state)

### File Organization
```
src/
  api/          # API service functions and mock data
  assets/       # Static assets (images, fonts, etc.)
  components/   # Reusable components
  composables/  # Reusable composition functions
  types/        # TypeScript type definitions and interfaces
  views/        # Page-level components
  layouts/      # Layout components
  router/       # Vue Router configuration
  stores/       # Pinia stores (if needed)
```

## Governance

This constitution defines the non-negotiable standards for the VibeLoop frontend codebase; All code must comply with these principles; TypeScript strict mode and Composition API usage are mandatory; DaisyUI components should be used wherever applicable; Code reviews must verify adherence to these standards; Simplicity and readability take precedence over clever solutions.

**Version**: 1.0.0 | **Ratified**: 2025-11-22 | **Last Amended**: 2025-11-22
