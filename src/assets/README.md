# Assets Directory

This directory contains all static assets used in the Ivory Partner Portal application.

## Directory Structure

- `/images`: Contains all image files (.png, .jpg, .svg, etc.)
  - Currently includes `ivwhite.png` (logo)

Additional assets may be found in the `public` directory for files that need to be directly accessible via URL.

## Usage Guidelines

### Images

Import images directly in your React components:

```jsx
import logo from 'src/assets/images/ivwhite.png';

function Component() {
  return <img src={logo} alt="Ivory Logo" />;
}
```

### SVG Icons

For icon systems, consider using:

1. SVG files imported as React components:
```jsx
import { ReactComponent as IconName } from 'src/assets/images/icon-name.svg';

function Component() {
  return <IconName className="icon" />;
}
```

2. Icon libraries like React Icons or Heroicons for consistent UI

### Global Styles

If you add global styles, import them in your main App component:

```jsx
import 'src/assets/styles/global.css';
```

## Best Practices

- Keep image file sizes optimized (use tools like TinyPNG)
- Use SVG for icons and simple graphics when possible
- Follow the existing naming convention (lowercase with descriptive names)
- When adding new asset types, create appropriate subdirectories
- Consider lazy-loading large images to improve performance
- Use appropriate alt text for accessibility

## Adding New Assets

When adding new assets:
1. Place them in the appropriate directory
2. Optimize files before committing
3. Update this README if creating new category directories 