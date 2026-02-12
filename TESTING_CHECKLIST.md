# Pre-Deployment Testing Checklist

## Critical Functionality Tests

### Authentication & Data Persistence
- [ ] Sign up with valid credentials (name, email, password)
- [ ] Sign up validation blocks empty fields
- [ ] Sign up validation shows email format error
- [ ] Sign up validation shows password < 6 char error
- [ ] Sign in with email/password works
- [ ] User data persists after page refresh
- [ ] New entries appear after app reload
- [ ] Logout confirmation dialog appears
- [ ] Logout clears user data
- [ ] Splash screen shows after logout

### Entry Creation & Editing
- [ ] Can create new journal entry with title and content
- [ ] Entry saves to storage
- [ ] Entry appears in calendar
- [ ] Entry appears in garden analysis
- [ ] Empty entry shows validation error
- [ ] Multiple entries on same day work
- [ ] Entries persist after refresh
- [ ] Entry word count calculation correct
- [ ] Entry quality tier assigned (short/medium/long)

### Garden & Analysis
- [ ] Plant grows with unique days (not entry count)
- [ ] Water button animation works
- [ ] Analysis dropdown shows period options
- [ ] Analysis with "Today" shows only today entries
- [ ] Analysis with "This Week" shows last 7 days
- [ ] Analysis with "This Month" shows last 30 days
- [ ] Analysis with "This Year" shows last 365 days
- [ ] Weather mood changes based on sentiment

### Navigation
- [ ] Bottom nav tabs switch screens
- [ ] Active tab highlighted
- [ ] Navigation persists with tab change
- [ ] Back buttons work correctly
- [ ] All screens render without errors

### Error Handling
- [ ] Component error shows error boundary UI
- [ ] Try again button works
- [ ] Form validation errors display inline
- [ ] Network errors (if applicable) handled gracefully
- [ ] Console has no error logs

### Accessibility
- [ ] Tab navigation works through all elements
- [ ] Screen reader announces button labels
- [ ] Screen reader announces form errors
- [ ] Screen reader announces loading states
- [ ] Focus visible on all buttons
- [ ] Color contrast meets WCAG AA

---

## Browser Compatibility

- [ ] Chrome/Edge (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Mobile Chrome (iOS)
- [ ] Mobile Safari (iOS)

---

## Responsive Design

- [ ] Works on 375px (mobile)
- [ ] Works on 768px (tablet)
- [ ] Works on 1024px (desktop)
- [ ] Works on 1440px (large screen)
- [ ] Safe area padding works on notched devices
- [ ] Bottom nav doesn't overlap content
- [ ] Form fields are touch-friendly (44px minimum)

---

## Performance Tests

- [ ] Initial load < 3 seconds
- [ ] Entry save < 500ms
- [ ] No layout shift during animations
- [ ] Smooth 60fps animations
- [ ] localStorage access < 100ms
- [ ] No memory leaks (DevTools)

---

## Data Integrity Tests

- [ ] Storage quota warning at 8MB
- [ ] Entries ordered by date (newest first)
- [ ] Duplicate entry IDs don't occur
- [ ] Entry dates match selected date
- [ ] User data consistent across page reloads

---

## Edge Cases

- [ ] Creating entry at midnight
- [ ] Multiple days with same entry count
- [ ] Very long entry content (> 10KB)
- [ ] Special characters in title/content
- [ ] Empty localStorage (first visit)
- [ ] Corrupted localStorage (manual edit)
- [ ] Session storage full
- [ ] Rapid entry creation
- [ ] Rapid button clicks

---

## Security Tests

- [ ] Password field hidden by default
- [ ] Password show/hide toggle works
- [ ] No sensitive data in console logs
- [ ] No XSS vulnerabilities (sanitized inputs)
- [ ] Form data not logged unencrypted
- [ ] Clear error messages (no stack traces)

---

## Mobile-Specific Tests

- [ ] Keyboard doesn't cover input fields
- [ ] Safe area applied correctly
- [ ] Touch targets large enough (44x44px)
- [ ] Bottom nav accessible without scrolling
- [ ] Double-tap to zoom disabled appropriately
- [ ] Landscape/portrait rotation works
- [ ] Notch devices supported (iPhone X+)

---

## Performance Metrics Target

| Metric | Target | Actual |
|--------|--------|--------|
| First Contentful Paint (FCP) | < 1.5s | ___ |
| Largest Contentful Paint (LCP) | < 2.5s | ___ |
| Cumulative Layout Shift (CLS) | < 0.1 | ___ |
| Time to Interactive (TTI) | < 3.5s | ___ |
| Storage Size | < 5MB | ___ |

---

## Post-Deployment Monitoring

- [ ] Error logs monitored
- [ ] User behavior tracked
- [ ] Storage quota alerts set
- [ ] Performance metrics tracked
- [ ] User feedback collected

---

## Sign-off

| Role | Name | Date | Status |
|------|------|------|--------|
| QA | ___ | ___ | ___ |
| Engineering | ___ | ___ | ___ |
| Product | ___ | ___ | ___ |

---

**All tests must pass before production deployment**
