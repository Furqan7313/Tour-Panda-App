# Copilot Instructions for TourPanda

## Project Overview
**TourPanda** is a React + Vite tour booking platform with Firebase backend. It features a landing page with tour discovery, admin/user dashboards, and real-time form submissions to Firestore.

## Architecture & Key Patterns

### Technology Stack
- **Frontend**: React 19, Vite 7, Tailwind CSS 4 with Vite plugin, React Router 7
- **Backend**: Firebase (Auth, Firestore, Analytics)
- **Animation**: Framer Motion
- **Icons**: Lucide React
- **Code Quality**: ESLint with React Hooks plugin

### Project Structure
- **`src/Components/`**: Reusable UI components (Navbar, Hero, Tours, Services, Gallery, Reviews, Contact, Footer)
- **`src/Pages/`**: Full page components (AdminDashboard, Dashboard, SignIn, SignUp, TourDetails)
- **`src/firebase.js`**: Firebase initialization exporting `db`, `auth`, `analytics`
- **`src/App.jsx`**: Single route for landing page (/) + dynamic tour detail route (/tour/:id)

### Design System
- **Color Palette**: Primary green (`#25D366` WhatsApp green), Secondary navy, Accent light, Nature green background
- **Styling**: Tailwind utility-first with custom color names (primary, secondary, accent, nature-green)
- **Layout**: `container mx-auto px-6` for consistent horizontal padding, `min-h-screen` for page height
- **Spacing**: Consistent use of Tailwind spacing utilities (p-6, gap-6, mb-10)

## Developer Workflows

### Development
```bash
npm run dev        # Start Vite dev server with HMR
npm run build      # Production build
npm run lint       # Run ESLint
npm run preview    # Preview production build locally
```

### Firebase Integration
- Firebase config is hardcoded in `src/firebase.js` (dev credentials - regenerate for production)
- Export services directly: `import { db, auth, analytics } from "../firebase"`
- Use Firestore collections with `collection()`, `addDoc()`, `serverTimestamp()` for server-side timestamps
- Example: Hero component submits tour inquiries to Firestore with `addDoc(collection(db, "inquiries"), {...})`

## Coding Conventions

### Component Structure
- Use **named exports** for Page components, **default exports** for reusable components
- Pages live in `src/Pages/`, reusable UI in `src/Components/`
- State management: useState for local UI state, no global state library (avoid unnecessary Redux/Context)

### Tailwind Patterns
- Use custom color variables: `bg-primary`, `text-secondary`, `bg-accent` instead of hardcoded hex
- **Fixed positioning**: Z-index layering - `z-[100]` for Navbar, `z-[150]` for WhatsApp button
- **Hover states**: `hover:scale-110 transition-transform` for buttons, `hover:text-primary transition-colors` for links
- **Responsive**: Hidden by default, show with `hidden md:flex` for desktop-only sections

### Form Patterns (from SignIn.jsx, Hero.jsx)
- Input styling: `p-4 bg-accent rounded-2xl border-2 border-transparent focus:border-primary/50 focus:bg-white outline-none transition-all`
- Modal forms use `useState` for visibility control
- Success feedback: Use `SuccessModal` component (see `src/Components/SuccessModal.jsx`)

### Firebase Data Submission
- Always use `serverTimestamp()` for audit trails in new documents
- Include loading state (`useState(false)`) to disable buttons during async operations
- Example pattern from Hero:
  ```jsx
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (data) => {
    setLoading(true);
    try {
      await addDoc(collection(db, "collection"), {...data, timestamp: serverTimestamp()});
      setIsModalOpen(true); // Show success
    } catch(err) { /* handle error */ }
    finally { setLoading(false); }
  };
  ```

### Component Integration Points
- **WhatsApp Floating Button**: Fixed to bottom-right (App.jsx line ~59), message link: `https://wa.me/message/HJDPGMFFZNI3H1`
- **Navbar**: Uses internal hash links (`/#section-id`) for single-page navigation
- **Modal Forms**: Hero, Contact components open modals for inquiries/bookings

## Common Tasks

### Adding a New Tour Type / Service
1. Edit the array in relevant component (e.g., `tourTypes` in Hero.jsx)
2. Add corresponding Firestore collection listener if needed
3. Use existing card components for consistency

### Creating a New Page
1. Create file in `src/Pages/YourPage.jsx` with default export
2. Add route in `src/App.jsx` under `<Routes>`
3. Link from Navbar if it's main navigation

### Styling New Components
1. Follow Tailwind utility-first approach, use design system colors
2. Reference existing components for padding/spacing consistency
3. Ensure responsive: `hidden md:flex` for desktop-only, `md:` prefixes for breakpoint-specific styles

## Important Notes
- **No TypeScript**: Project uses JSX without type annotations
- **ESLint Rules**: React Hooks plugin enabled; avoid stale closure warnings
- **Production Firebase**: Current credentials are development keys - migrate to environment variables before production
- **Form Validation**: Currently minimal; consider adding for production (email, phone validation)
