# UI/UX Design System

## Color Palette

### Primary Colors
- **Forest Green** (#2D5A27): Main brand color for primary buttons, navigation, headings
- **Earthy Brown** (#8B6914): Secondary accent for highlights and borders
- **Golden Yellow** (#D4AF37): Premium accent for highlights and special elements

### Secondary Colors
- **Clinical Blue** (#0066CC): Accent for links, success states, and information
- **Harvest Orange** (#FF7F00): Caution and warning states
- **Soil Red** (#C41E3A): Errors and critical alerts
- **Growth Green** (#52B788): Success states
- **Sky Blue** (#87CEEB): Informational states

### Neutral Palette
- White (#FFFFFF): Background and cards
- Light Grey (#F5F5F5): Page backgrounds
- Medium Grey (#D3D3D3): Borders and dividers
- Dark Grey (#666666): Secondary text
- Charcoal (#212121): Primary text

## Typography

### Font Family
- **Display**: Poppins (headings, large text)
- **Body**: Inter (body text, labels)

### Font Sizes
- **Hero**: 48px / 3rem (page titles)
- **H1**: 36px / 2.25rem (major sections)
- **H2**: 28px / 1.75rem (subsections)
- **H3**: 20px / 1.25rem (card titles)
- **Body**: 16px / 1rem (default text)
- **Small**: 14px / 0.875rem (secondary text)
- **Extra Small**: 12px / 0.75rem (labels, hints)

### Font Weights
- Regular: 400
- Medium: 500 (labels, buttons)
- Semi-bold: 600 (emphasis)
- Bold: 700 (headings)

## Spacing System

Based on 4px units:
- xs: 4px (0.25rem)
- sm: 8px (0.5rem)
- md: 16px (1rem)
- lg: 24px (1.5rem)
- xl: 32px (2rem)
- 2xl: 48px (3rem)
- 3xl: 64px (4rem)

## Components

### Buttons
```
Primary Button:
- Background: Forest Green
- Text: White
- Padding: 12px 24px
- Border Radius: 8px
- Font Weight: 600
- States: Default, Hover (darker green), Active, Disabled

Secondary Button:
- Background: Light Grey
- Text: Dark Grey
- Padding: 12px 24px
- Border Radius: 8px
- States: Default, Hover (medium grey), Active

Ghost Button:
- Background: None
- Text: Forest Green
- Border: 2px solid Forest Green
- Padding: 10px 22px (account for border)
```

### Cards
```
Background: White
Border: 1px solid Medium Grey
Border Radius: 12px
Padding: 24px
Box Shadow: 0 2px 8px rgba(0, 0, 0, 0.08)
Hover: Shadow increases to 0 4px 12px rgba(0, 0, 0, 0.12)
```

### Form Elements
```
Input/Textarea:
- Border: 1px solid Medium Grey
- Border Radius: 8px
- Padding: 12px
- Font: Body (16px)
- Placeholder: Dark Grey
- Focus: Blue border + blue ring
- Error: Red border

Labels:
- Font Size: 14px
- Font Weight: 600
- Color: Dark Grey
- Margin Bottom: 8px
```

### Navigation
```
Header:
- Height: 64px
- Background: White
- Border Bottom: 1px solid Medium Grey
- Box Shadow: 0 2px 4px rgba(0, 0, 0, 0.05)

Sidebar:
- Width: 250px
- Background: Forest Green (#2D5A27)
- Text: White
- Active Item: Lighter shade, left accent bar (Golden Yellow)
```

### Messages & Alerts
```
Success:
- Background: #E8F5E9
- Border: 1px solid #4CAF50
- Text: #2E7D32
- Icon: Growth Green

Warning:
- Background: #FFF3E0
- Border: 1px solid #FF9800
- Text: #E65100
- Icon: Harvest Orange

Error:
- Background: #FFEBEE
- Border: 1px solid #F44336
- Text: #C62828
- Icon: Soil Red

Info:
- Background: #E3F2FD
- Border: 1px solid #2196F3
- Text: #1565C0
- Icon: Clinical Blue
```

## Icons

### Style
- Outline style (not filled)
- 2px stroke width for icons 24px and larger
- Consistent stroke width across set
- Clean, agricultural/livestock-related imagery

### Sizes
- xs: 16px (inline text)
- sm: 20px (small buttons)
- md: 24px (default)
- lg: 32px (large buttons)
- xl: 48px (illustrations)

### Icon Sets
- Livestock: Cow, chicken, pig, sheep
- Crops: Grain, corn, vegetable, seed
- Services: Syringe, stethoscope, clipboard
- Actions: Settings, search, filter, download
- Navigation: Home, menu, back, forward

## Responsive Design

### Breakpoints
- Mobile: 480px
- Tablet: 768px
- Desktop: 1024px
- Large Desktop: 1440px
- Extra Large: 1920px

### Mobile-First Approach
- Start with mobile design (320px+)
- Progressively enhance for larger screens
- Touch targets minimum 44x44px
- Readable text on mobile (16px+)

## Accessibility

### WCAG 2.1 AA Compliance
- Color contrast ratio: 4.5:1 for text
- 3:1 for large text
- Focus indicators visible (2px ring)
- Keyboard navigation throughout
- Semantic HTML
- ARIA labels for complex components

### Alt Text
- All images must have descriptive alt text
- Icons used as buttons need aria-label
- Decorative elements can have empty alt

## Animation & Transitions

### Durations
- Fast: 150ms (hover states, popups)
- Standard: 300ms (page transitions)
- Slow: 500ms (complex animations)

### Easing
- ease-in-out: Standard transitions
- ease-out: Entrances
- ease-in: Exits

### Examples
```
- Button hover: color 150ms ease-in-out
- Modal fade in: opacity 300ms ease-out
- Page transition: transform 300ms ease-in-out
```

## Design Patterns

### Loading States
- Skeleton screens for content
- Progress bars for long operations
- Spinner with "Loading..." text

### Empty States
- Friendly illustration
- Explanatory text
- Call-to-action button

### Error Handling
- Clear error message
- Suggestion for resolution
- Highlight problematic fields
- Allow retry action

### Confirmation Dialogs
- Clear action description
- Confirm and Cancel buttons
- Primary action is confirm (right side)
- Secondary action cancel (left side)

## Brand Voice

- Professional yet approachable
- Clear and concise
- Action-oriented
- Farmer-friendly language
- Avoids jargon

## Do's and Don'ts

### Do's
✓ Use consistent spacing and alignment
✓ Maintain color hierarchy
✓ Test on real devices
✓ Use semantic HTML
✓ Provide feedback on actions
✓ Make interactive elements obvious
✓ Optimize for different screen sizes

### Don'ts
✗ Mix multiple color schemes
✗ Use too many font sizes
✗ Create custom scrollbars
✗ Auto-play media
✗ Disable zoom
✗ Use outdated design patterns
✗ Forget about mobile users
