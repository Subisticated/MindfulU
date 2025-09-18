# Animation System Documentation

## Overview
This documentation covers the comprehensive animation system implemented across the entire application using Framer Motion. The system provides consistent, smooth animations that enhance user experience while maintaining good performance.

## Animation Library (`lib/animations.ts`)

### Core Animation Variants

#### 1. Page Animations (`pageAnimations`)

**containerVariants**
- Purpose: For page-level containers with staggered children
- Animation: Opacity fade-in with 0.1s stagger between children
- Delay: 0.2s before starting
- Use Case: Main page containers, grids of cards

**fastContainerVariants**
- Purpose: Quick loading containers
- Animation: Same as containerVariants but faster (0.05s stagger, 0.1s delay)
- Use Case: Navigation menus, quick lists

**itemVariants**
- Purpose: Individual elements within containers
- Animation: Fade up (opacity 0→1, y 20→0)
- Duration: 0.6s with easing curve
- Use Case: Cards, text blocks, form elements

**cardVariants**
- Purpose: Interactive cards with hover effects
- Animation: Fade up + hover lift + tap scale
- Hover: y: -8px, scale: 1.02
- Tap: scale: 0.98
- Use Case: Dashboard cards, meditation cards, journal entries

**headerVariants**
- Purpose: Page titles and section headings
- Animation: Fade down (y -20→0)
- Duration: 0.7s
- Use Case: Page titles, section headers

**slideInLeft / slideInRight**
- Purpose: Directional entrance animations
- Animation: Slide from left/right (x ±50→0)
- Duration: 0.6s
- Use Case: Sidebar content, form sections

**scaleVariants**
- Purpose: Buttons and interactive elements
- Animation: Scale entrance + hover/tap feedback
- Initial: scale 0.8→1 with bounce
- Hover: scale 1.05
- Use Case: Action buttons, CTAs

**fadeVariants**
- Purpose: Subtle elements
- Animation: Simple opacity fade
- Duration: 0.5s
- Use Case: Helper text, secondary content

**listItemVariants**
- Purpose: List items with hover interactions
- Animation: Slide from left + hover shift
- Hover: x: 5px shift
- Use Case: Navigation items, menu options

### Page Transitions (`pageTransitions`)

**pageTransition**
- Entry/Exit: Fade + slight vertical movement
- Duration: 0.4s
- Use Case: Standard page changes

**slideTransition**
- Entry/Exit: Slide from right/left
- Duration: 0.3s
- Use Case: Navigation between related pages

### Loading Animations (`loadingAnimations`)

**pulse**
- Animation: Scale and opacity pulsing
- Duration: 1.5s infinite
- Use Case: Loading states, awaiting input

**bounce**
- Animation: Vertical bouncing
- Duration: 0.6s infinite
- Use Case: Active indicators, fun feedback

**rotate**
- Animation: Full rotation
- Duration: 1s infinite linear
- Use Case: Loading spinners

## Animated Components (`components/ui/animated-components.tsx`)

### Core Components

#### AnimatedWrapper
- **Purpose**: Generic wrapper for any content with customizable animations
- **Props**: 
  - `variant`: Animation type from pageAnimations
  - `delay`: Custom delay timing
  - `duration`: Override animation duration
  - `customVariants`: Use custom animation variants
- **Usage**: Wrapping existing elements for animation

#### AnimatedPage
- **Purpose**: Page-level container with stagger animation
- **Props**: 
  - `containerVariant`: Which container animation to use
- **Usage**: Wrapping entire page content

#### AnimatedCard
- **Purpose**: Interactive cards with hover effects
- **Props**: 
  - `hoverEffect`: Enable/disable hover animations
  - `delay`: Stagger delay for multiple cards
  - `onClick`: Click handler
- **Usage**: Dashboard cards, content cards

#### AnimatedButton
- **Purpose**: Buttons with scale animations
- **Props**: Standard button props + animation
- **Usage**: Primary actions, CTAs

#### AnimatedList / AnimatedListItem
- **Purpose**: Lists with staggered item animations
- **Usage**: Navigation menus, content lists

#### AnimatedHeader
- **Purpose**: Headers with entrance animations
- **Props**: 
  - `level`: Header level (h1-h6)
- **Usage**: Page titles, section headers

## Implementation Examples

### Dashboard Page
```tsx
<AnimatedPage>
  <div className="grid gap-4 md:grid-cols-3">
    <AnimatedCard delay={0}>
      <MoodTrackerCard />
    </AnimatedCard>
    <AnimatedCard delay={0.1}>
      <JournalCard />
    </AnimatedCard>
    <AnimatedCard delay={0.2}>
      <ToolsCard />
    </AnimatedCard>
  </div>
</AnimatedPage>
```

### Journal Page
```tsx
<AnimatedPage>
  <AnimatedWrapper variant="slideInLeft">
    <SearchBar />
  </AnimatedWrapper>
  
  {entries.map((entry, index) => (
    <motion.div
      key={entry.id}
      variants={pageAnimations.itemVariants}
      transition={{ delay: index * 0.1 }}
    >
      <JournalEntry entry={entry} />
    </motion.div>
  ))}
</AnimatedPage>
```

### Settings Page
```tsx
<AnimatedPage>
  <div className="grid xl:grid-cols-3">
    <div className="xl:col-span-2">
      <AnimatedWrapper variant="slideInLeft">
        <ProfileSection />
      </AnimatedWrapper>
      <AnimatedWrapper variant="slideInLeft" delay={0.1}>
        <NotificationSection />
      </AnimatedWrapper>
    </div>
    <div>
      <AnimatedWrapper variant="slideInRight">
        <ThemeSection />
      </AnimatedWrapper>
    </div>
  </div>
</AnimatedPage>
```

## Performance Considerations

### Optimizations Applied
1. **Lazy Loading**: Animations are lazy-loaded with components
2. **Hardware Acceleration**: Using transform and opacity for smooth 60fps
3. **Reduced Motion**: Respects user's `prefers-reduced-motion` settings
4. **Selective Animation**: Only animate visible elements
5. **Efficient Variants**: Reusable animation variants prevent re-creation

### Best Practices

#### Do's
- Use `transform` and `opacity` for best performance
- Keep animations under 500ms for interactions
- Use staggered animations for groups (0.1s intervals)
- Apply animations to direct children, not deep nesting
- Use `layoutId` for smooth element transitions

#### Don'ts
- Avoid animating `width`, `height`, `left`, `top`
- Don't chain too many animations
- Avoid animations longer than 1s (except loading states)
- Don't animate everything - use purposefully
- Avoid animating during heavy computations

## Browser Support
- **Modern Browsers**: Full support with hardware acceleration
- **Safari**: Optimized for iOS/macOS with proper easing
- **Firefox**: Good performance with transform animations
- **Fallbacks**: Graceful degradation for unsupported features

## Animation Guidelines

### Timing
- **Micro-interactions**: 100-300ms (button hovers, toggles)
- **Element transitions**: 300-500ms (cards, modals)
- **Page transitions**: 400-600ms (route changes)
- **Loading states**: 1-2s loops (spinners, pulses)

### Easing
- **Default**: `[0.25, 0.46, 0.45, 0.94]` (Material Design)
- **Bouncy**: `"backOut"` for playful interactions
- **Linear**: For continuous animations (loading spinners)
- **Ease-in-out**: For reversible interactions

### Staggering
- **Cards/Grid**: 0.1s between items
- **Lists**: 0.05s for quick reveals
- **Complex layouts**: 0.15s for clear hierarchy

## Accessibility

### Reduced Motion
- Animations respect `prefers-reduced-motion: reduce`
- Essential animations maintain functionality
- Decorative animations are disabled

### Screen Readers
- Animations don't interfere with assistive technology
- Important state changes are announced
- Focus management during transitions

## Future Enhancements

### Planned Features
1. **Custom easing curves** for brand personality
2. **Route-based animations** for page transitions
3. **Gesture animations** for mobile interactions
4. **3D transforms** for immersive experiences
5. **SVG path animations** for illustrations

### Performance Monitoring
- Animation performance tracking
- FPS monitoring during complex sequences
- Battery usage optimization for mobile
- Memory usage analysis for long-running animations

## Troubleshooting

### Common Issues
1. **Jerky animations**: Check for layout thrashing
2. **Delayed starts**: Verify initial states are set
3. **Missing animations**: Ensure variants are properly applied
4. **Performance issues**: Reduce complexity or add hardware acceleration

### Debug Tools
- React DevTools Profiler
- Chrome DevTools Performance tab
- Framer Motion Debug mode
- Animation timeline inspection

This animation system provides a solid foundation for consistent, performant, and accessible animations throughout the application while maintaining flexibility for future enhancements.
