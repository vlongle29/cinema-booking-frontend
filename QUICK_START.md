# Quick Start Guide - HomePage UI

## 🚀 Get Started in 3 Steps

### Step 1: Install Dependencies

```bash
cd d:\Project.js\cine-book-app
npm install
```

### Step 2: Run Development Server

```bash
npm run dev
```

Open your browser and go to: `http://localhost:5173`

### Step 3: Start Customizing

Edit `src/components/HomePage.tsx` and `src/styles/HomePage.css`

---

## 📸 What You'll See

### Main Components

1. **Top Navigation** - Fixed header with logo, menu, search, and login
2. **Hero Banner** - Full-width movie showcase with action buttons
3. **Movie Grid** - "Now Showing" section with 4 movies displayed
4. **Trailers Section** - Additional movies with "Show More" button
5. **Footer** - Multi-column footer with links and info

---

## 🎨 Quick Customizations

### Change Hero Movie

```typescript
// In HomePage.tsx, update the hero content
<h1 className="hero-title">
  Your Movie Title<br />Here
</h1>
<p className="hero-genre">Genre | Genre | Genre</p>
<p className="hero-description">Movie description here...</p>
```

### Update Movie Grid

```typescript
const nowShowingMovies: Movie[] = [
   {
      id: 1,
      title: "Movie Title",
      genre: "Action, Adventure",
      year: "2024",
      duration: "2h 30m",
      rating: 4.8,
      image: "/images/movie.jpg",
   },
   // Add more movies...
];
```

### Change Colors

```css
/* In HomePage.css */
:root {
   --primary-color: #YOUR_COLOR;
   --secondary-color: #YOUR_DARK_COLOR;
   --text-primary: #YOUR_TEXT_COLOR;
}
```

### Update Navigation Links

```tsx
<a href="#movies" className="nav-link">
   Your Link
</a>
```

---

## 🖼️ Adding Images

Create an `images` folder in the `public` directory:

```
public/
├── images/
│   ├── hero-bg.jpg
│   ├── marvel-logo.png
│   ├── alita1.jpg
│   ├── alita2.jpg
│   ├── google-play.png
│   └── app-store.png
```

Then reference them in the component:

```tsx
<img src="/images/your-image.jpg" alt="description" />
```

---

## 📱 Testing Responsiveness

### Desktop View

-  Full navigation menu visible
-  4-column movie grid
-  All features enabled

### Tablet View (768px - 1199px)

-  Menu items may stack
-  2-3 column movie grid
-  Optimized spacing

### Mobile View (Below 768px)

-  Hamburger menu ready
-  2-column movie grid
-  Vertical stacking

### Test in Browser

Press `F12` → Click device icon → Select device

---

## 🎯 Key Features Explained

### Navigation Bar

-  **Sticky**: Stays at top while scrolling
-  **Logo**: Custom designed with icon
-  **Links**: Home, Movies, Theatres, Releases
-  **Actions**: Search and Login buttons

### Hero Section

-  **Background**: Full-width image with gradient overlay
-  **Content**: Movie info with title, genre, description
-  **Buttons**: Primary and secondary call-to-action
-  **Icons**: Calendar and clock showing year/duration

### Movie Cards

-  **Image**: Movie poster at top
-  **Info**: Title, genre, year, duration
-  **Rating**: Star icon with rating number
-  **CTA**: "Buy Ticket" button
-  **Hover**: Lift animation on mouse over

### Footer

-  **Logo Section**: Company info and description
-  **Links**: Quick navigation links
-  **Contact**: Phone and email
-  **Downloads**: App store links
-  **Copyright**: Legal notice

---

## 🔧 Project Structure

```
src/
├── components/
│   └── HomePage.tsx          ← Main component
├── styles/
│   └── HomePage.css          ← All styling
├── App.tsx                   ← Root component
├── App.css                   ← Global styles
├── index.css                 ← Reset styles
└── main.tsx                  ← Entry point

public/
└── images/                   ← Your images here
```

---

## 🎓 Common Tasks

### Add a New Movie to Grid

```typescript
{
  id: 5,
  title: "New Movie",
  genre: "Action",
  year: "2024",
  duration: "2h 45m",
  rating: 4.6,
  image: "/images/new-movie.jpg"
}
```

### Change Button Text

```tsx
<button className="btn btn-primary">New Text</button>
```

### Update Footer Links

```tsx
<a href="#your-link">Your Link Text</a>
```

### Modify Section Title

```tsx
<h2>Your Section Title</h2>
```

---

## 🐛 Quick Fixes

### Images Not Showing

1. Check image paths (start with `/images/`)
2. Verify images exist in `public/images/`
3. Check file extensions (.jpg, .png, etc.)

### Styling Not Updating

1. Save file (Ctrl+S)
2. Hard refresh browser (Ctrl+Shift+R)
3. Check CSS selectors match HTML classes

### Layout Broken

1. Check for typos in class names
2. Verify CSS closing braces `}`
3. Check media query conditions

---

## 📚 Useful Commands

```bash
# Install packages
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Format code (if prettier installed)
npm run format

# Lint code (if eslint installed)
npm run lint
```

---

## 🎯 Next Steps

1. **Add Images** - Place movie posters in `/public/images/`
2. **Update Data** - Replace sample movie data with real content
3. **Connect API** - Fetch movie data from backend
4. **Add Pages** - Create detail, booking, profile pages
5. **Deploy** - Push to production (Vercel, Netlify, etc.)

---

## 💬 Tips & Tricks

### Performance

-  Use optimized images (compress before uploading)
-  Lazy load images for better performance
-  Minify CSS and JavaScript for production

### Accessibility

-  Add alt text to all images
-  Use semantic HTML
-  Test with keyboard navigation
-  Check color contrast

### SEO

-  Add meta tags in HTML head
-  Use descriptive image alt text
-  Structure content with proper headings
-  Add schema markup for movies

---

## 🔗 Useful Resources

-  **Figma Design**: Check design file for exact specifications
-  **React Docs**: Learn React fundamentals
-  **CSS Grid**: Master responsive layouts
-  **Lucide Icons**: Browse available icons

---

## ✅ Checklist Before Deployment

-  [ ] Replace sample images with real movie posters
-  [ ] Update movie data from API
-  [ ] Test all responsive breakpoints
-  [ ] Check all links work correctly
-  [ ] Verify color scheme matches branding
-  [ ] Test on mobile devices
-  [ ] Check browser compatibility
-  [ ] Optimize images for web
-  [ ] Update footer contact info
-  [ ] Add analytics/tracking code

---

## 🎉 You're Ready!

Your HomePage is now ready to customize and deploy. Start by updating the images and movie data, then gradually add more features as needed.

Happy coding! 🚀

---

**Last Updated**: December 20, 2025
**Version**: 1.0.0
