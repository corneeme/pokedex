# Pokemon Pokedex Design Guidelines

## Design Approach
**Reference-Based**: Drawing inspiration from official Pokemon game interfaces (Pokemon GO, Pokemon Home) and Nintendo's clean, game-like aesthetics. The design balances playful Pokemon theming with utility-focused information architecture.

## Core Design Principles
1. **Game-like Interface**: UI should feel interactive and engaging like a Pokemon game menu system
2. **Type-driven Visual System**: Pokemon types dictate visual treatments (backgrounds, badges, move colors)
3. **Information Clarity**: Dense data presentation with clear hierarchy and scannable layouts
4. **Smooth Transitions**: Animations should feel polished and purposeful, never distracting

## Typography

**Primary Font**: "Poppins" (Google Fonts) - rounded, friendly, game-like
- Pokemon Names: 700 weight, 2xl-4xl sizes
- Headings/Labels: 600 weight, lg-xl sizes
- Body/Stats: 500 weight, sm-base sizes
- Dex Numbers: 400 weight, mono-spaced feel

**Secondary Font**: "Inter" (Google Fonts) for detailed information
- Move descriptions, Pokedex entries: 400 weight
- Stats and numerical data: 500 weight

## Layout System

**Spacing Units**: Tailwind primitives - 2, 4, 6, 8, 12, 16, 24
- Component padding: p-4 to p-8
- Section gaps: gap-6 to gap-8
- Card spacing: m-4, p-6

**Grid Structure**:
- Homepage: Responsive grid (grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8)
- Detail View: Two-column asymmetric (40% left / 60% right on desktop)

## Component Library

### Homepage Components

**Pokemon Card**:
- Circular background container (aspect-square, rounded-full)
- Sprite centered within circle (w-20 h-20 on mobile, w-24 h-24 desktop)
- Name below in centered text (text-sm md:text-base)
- Padding around card: p-4
- Hover state: subtle scale transform (scale-105)

**Search Bar** (Sticky):
- Rounded pill shape (rounded-full)
- Icon on left, clear button on right
- Width: max-w-md centered
- Padding: px-6 py-3
- Appears inline initially, becomes fixed on scroll
- Drop shadow when sticky (shadow-lg)
- NOT a full-width header bar

### Detail View Components

**Type Badges**:
- Pill-shaped (rounded-full px-4 py-1)
- Type-specific styling (Fire: warm tones, Water: cool tones, etc.)
- Uppercase text (text-xs font-semibold uppercase tracking-wide)
- Display inline-flex with gap-2

**Stat Bars**:
- Horizontal bar charts with labels
- Stat name on left (w-32, text-sm)
- Bar visualization in center (flex-1, h-2, rounded-full)
- Numerical value on right (text-sm font-mono)
- Stacked vertically with gap-3

**Move List Item**:
- Grid layout: Name | Type Badge | Power | Accuracy | Category
- Type badge colored appropriately
- Physical/Special/Status icon or badge
- Hover state: subtle background highlight
- Learn method in smaller text below
- Border between items (border-b)

**Evolution Chain**:
- Horizontal flow with arrow indicators between stages
- Small sprite thumbnails (w-16 h-16)
- Pokemon names beneath (text-xs)
- Responsive: stack vertically on mobile

**Info Cards** (Height, Weight, Abilities):
- Card-based layout (rounded-lg border p-4)
- Label + Value pairs
- Icons next to labels
- Display in 2-column grid on desktop

### Navigation

**Back Button**:
- Top-left fixed position
- Icon + "Back" text
- Rounded button style (rounded-full)
- Padding: px-4 py-2
- Positioned absolute or fixed with appropriate z-index

## Animations

**Circle Expansion Transition** (Critical):
1. Pokemon clicked → Circle fills with type color
2. Circle expands to fill viewport (scale transform + fixed positioning)
3. Fade type color back to background
4. Fade in detail content
Duration: 600-800ms total with easing

**Other Animations**:
- Sticky search: Smooth transform (transition-transform duration-300)
- Card hover: Scale (scale-105 transition-transform)
- Content fade-in: Opacity transition (opacity-0 to opacity-100, duration-500)
- Stat bars: Width animation on mount (transition-all duration-700)

## Layout Specifications

### Homepage
- Container: max-w-7xl mx-auto px-4
- Search initially: pt-8 pb-12 (becomes sticky with py-4)
- Pokemon grid: gap-4 md:gap-6

### Detail View

**Left Column (40% width)**:
- Top: Pokemon name (text-4xl font-bold)
- Dex number below name (text-lg text-muted, font-mono)
- Type badges horizontal (flex gap-2)
- Species info (text-sm)
- All above: top-right alignment
- Sprite display: Large centered (w-64 h-64 md:w-80 h-80)
- Base stats section below sprite (space-y-3)

**Right Column (60% width)**:
- Top section: Pokedex entry (p-6, prose styling, max-h-32 overflow-auto)
- Middle section: Scrollable area containing:
  - Abilities (mb-6)
  - Height/Weight grid (mb-6)
  - Moves list (space-y-1, max-h-96 overflow-y-auto)
- Bottom section: Evolution chain (p-6)

## Icons
**Library**: Heroicons via CDN
- Search icon (magnifying glass)
- Back arrow
- Physical/Special/Status move indicators
- Height/Weight icons
- Clear search (X icon)

## Images
**Pokemon Sprites**: Fetched from PokeAPI
- Homepage: Official sprites or artwork (smaller versions)
- Detail view: Large official artwork or high-res sprite
- Evolution chain: Thumbnail sprites

**No hero image needed** - This is a utility application focused on browsing and information display.

## Accessibility
- Semantic HTML throughout
- ARIA labels on interactive elements
- Keyboard navigation support for grid and search
- Focus indicators on all interactive elements
- Alt text for all Pokemon sprites
- Color contrast maintained in type badges
- Consistent tab order