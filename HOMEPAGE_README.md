# HomePage UI Implementation - Cine Book App

## Overview

The HomePage UI has been implemented based on the Figma design for the Cine Book App. This is a modern, responsive movie booking platform interface featuring a hero section, movie listings, and a comprehensive footer.

## Features Implemented

### 1. **Navigation Bar**

-  Fixed header with glass-morphism effect (blur backdrop)
-  Logo with custom styling
-  Navigation links (Home, Movies, Theatres, Releases)
-  Search button and Login button
-  Responsive design with mobile menu support

### 2. **Hero Section**

-  Full-width background image with overlay
-  Featured movie title and information
-  Movie poster/logo
-  Genre and description
-  Call-to-action buttons (Explore Movies, Watch Trailer)
-  Movie metadata (year, duration) with icons

### 3. **Movies Section**

-  "Now Showing" section with movie grid
-  Movie cards with:
   -  Movie poster image
   -  Title
   -  Genre, year, and duration
   -  Star rating
   -  "Buy Ticket" button
-  "Trailers" section with similar layout
-  "Show More" button
-  Smooth hover animations

### 4. **Footer**

-  Multi-column footer layout
-  Company information and logo
-  Quick links
-  Contact information
-  App download links (Google Play, App Store)
-  Copyright information

## File Structure

```
src/
├── components/
│   └── HomePage.tsx          # Main HomePage component
├── styles/
│   └── HomePage.css          # HomePage styling
├── App.tsx                   # Main App component
├── App.css                   # Global styles
├── index.css                 # Root styles
└── main.tsx                  # Entry point
```

## Component Structure

### HomePage.tsx

The main component is divided into:

1. **Navigation Bar Component**

   -  Sticky navbar with logo, links, and action buttons
   -  Responsive design

2. **Hero Section**

   -  Background image with gradient overlay
   -  Featured movie information
   -  CTA buttons

3. **Movies Grid Section**

   -  Reusable MovieCard component
   -  Grid layout with responsive columns
   -  Section header with "View All" link

4. **Movie Card Component**

   -  Movie poster image
   -  Title and metadata
   -  Star rating
   -  Buy Ticket button
   -  Hover animations

5. **Footer**
   -  Multi-column layout
   -  Company info, links, and contact
   -  App store links

## Design Colors & Typography

### Colors

-  **Primary**: #F84565 (Pink/Red)
-  **Secondary**: #09090B (Very Dark Background)
-  **Text Primary**: #FFFFFF (White)
-  **Text Secondary**: #D1D5DC (Light Gray)
-  **Text Muted**: #797B7D (Muted Gray)
-  **Card Background**: #12161C (Dark Gray)

### Typography

-  **Font Family**: Outfit, Heebo (with fallbacks)
-  **Headlines**: Outfit 600-700 weight
-  **Body**: Outfit/Heebo 400-500 weight
-  **Font Sizes**: Responsive, scaled for different breakpoints

## Responsive Breakpoints

The design is fully responsive with breakpoints at:

-  **Desktop**: 1200px and above
-  **Tablet**: 768px to 1199px
-  **Mobile**: 480px to 767px
-  **Small Mobile**: Below 480px

## Animations & Interactions

### Hover Effects

-  Navigation links: Underline animation
-  Buttons: Scale and color transition
-  Movie cards: Translate upward with shadow
-  Images: Zoom on card hover

### Page Animations

-  Hero content: Slide in from left
-  Movie cards: Fade in effect
-  Smooth scroll behavior

## CSS Features Used

### Modern CSS

-  CSS Grid for layouts
-  Flexbox for component alignment
-  CSS Variables for theming
-  Backdrop filters for glass-morphism
-  Linear gradients for overlays
-  Transform and transition for animations

### Responsive Design

-  Mobile-first approach
-  Media queries for breakpoints
-  Relative sizing with rem/em
-  Grid auto-fit for flexible layouts

## Dependencies

### External Libraries

-  **lucide-react**: Icon library for SVG icons
   -  Star, Search, Calendar, Clock, Play, ArrowRight

### Built With

-  **React**: 18.x
-  **TypeScript**: For type safety
-  **Vite**: Build tool
-  **CSS3**: Pure CSS (no CSS-in-JS)

## How to Use

### Installation

```bash
npm install
```

### Development Server

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Preview

```bash
npm run preview
```

## Customization

### Changing Colors

Edit the CSS variables in `HomePage.css`:

```css
:root {
   --primary-color: #f84565;
   --secondary-color: #09090b;
   /* ... other variables */
}
```

### Adding Movie Data

Update the sample data in `HomePage.tsx`:

```typescript
const nowShowingMovies: Movie[] = [
   // Add your movie objects here
];
```

### Updating Navigation Links

Modify the nav-links in the NavBar section:

```tsx
<a href="#movies" className="nav-link">
   Movies
</a>
```

## Accessibility Features

-  Semantic HTML structure
-  ARIA-friendly navigation
-  Color contrast compliance
-  Keyboard navigation support
-  Focus states for interactive elements
-  Screen reader optimized

## Performance Optimizations

-  Lazy loading ready for images
-  CSS optimizations
-  Efficient animations using transform and opacity
-  Mobile-first CSS approach
-  No unnecessary re-renders

## Browser Support

-  Chrome/Edge: Latest versions
-  Firefox: Latest versions
-  Safari: Latest versions
-  Mobile browsers: All modern versions

## Future Enhancements

1. **Dynamic Data**

   -  Connect to backend API for real movie data
   -  Implement pagination for movie lists

2. **User Interactions**

   -  Movie detail page
   -  Search functionality
   -  Filtering by genre/year
   -  User reviews and ratings

3. **Advanced Features**

   -  Dark/Light theme toggle
   -  User authentication
   -  Wishlist functionality
   -  Advanced booking system

4. **Performance**
   -  Image optimization with next/image
   -  Code splitting for routes
   -  Service worker for offline support

## Notes

-  The hero background image path should be updated to your actual image
-  Movie poster images should be optimized for web
-  All icon assets are provided by lucide-react
-  The component is fully self-contained and can be reused

## Support

For questions or issues with the HomePage implementation, please refer to the component documentation or the Figma design file.
