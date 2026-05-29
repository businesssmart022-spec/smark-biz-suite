# Implementation Plan - SMARK BUSINESS E-commerce Platform

SMARK BUSINESS is a modern, mobile-first e-commerce platform providing sellers with private, autonomous storefronts and management tools. This plan focuses on building the frontend-only MVP with simulated data persistence (localStorage).

## Scope Summary
- **Landing Page:** Professional presentation of SMARK BUSINESS.
- **Seller Space (Dashboard):** Product management, order tracking, and statistics.
- **Subscription System:** Simulated 1-month trial and $10/month subscription (UI-only Stripe/Flutterwave simulation).
- **Admin Space:** Registration validation, financial tracking, and seller moderation.
- **Authentication:** Multi-role login (Seller, Admin) with comprehensive registration for sellers.

## Non-Goals
- Real backend integration (Supabase, SQL, etc.).
- Real payment processing (APIs will be simulated).
- Live Facebook API integration (UI hooks only).

## Assumptions & Risks
- **Persistence:** Data will be stored in `localStorage` for this session.
- **Security:** Since there's no backend, authentication is purely client-side logic.
- **Mobile-First:** The design must be highly responsive.

## Affected Areas
- **Frontend (React/Vite):** Entire application structure.
- **State Management:** LocalStorage and React Context for "database" simulation.
- **UI Components:** Utilizing existing Shadcn/UI components.

## Implementation Phases

### Phase 1: Foundation & Auth (frontend_engineer)
- Set up routing (React Router).
- Implement `AuthContext` to handle user sessions and roles (Admin/Seller) using localStorage.
- Create Registration Page with all required fields:
  - Full Name, Business Name (optional), Address, Email, Password, Country, City, Phone.
  - Credit Card input simulation for trial activation.
- Create Login Page for both Sellers and the single Admin.

### Phase 2: Seller Dashboard (frontend_engineer)
- **Product Management:** CRUD operations for products (Name, Price, Sync to Facebook toggle).
- **Order Tracking:** List of simulated orders and status updates.
- **Analytics:** Basic charts (using `src/components/ui/chart.tsx`) for revenue and visits.
- **Subscription UI:** Display trial status and monthly payment renewal date.

### Phase 3: Admin Dashboard (frontend_engineer)
- **User Validation:** Approve/Reject new seller registrations.
- **Financial Overview:** List of all sellers and their subscription status.
- **Moderation:** Ability to block/unblock seller access manually.

### Phase 4: Landing Page & Refinement (quick_fix_engineer)
- Build the home page with the official presentation and logo placeholder.
- Implement "Mobile-First" CSS adjustments across all views.
- Add feedback notifications (Sonner) for actions (e.g., "Product Added", "Subscription Renewed").

### Phase 5: Simulated Payment & Lockout (frontend_engineer)
- Logic to "block" seller space if the simulated trial/payment period expires.
- Integrate a "Stripe-like" modal for credit card entry.

## Deliverables
1. `src/context/AppContext.tsx`: Central state for users, products, and orders.
2. `src/pages/Landing.tsx`: Professional intro.
3. `src/pages/dashboard/SellerDashboard.tsx`: Seller tools.
4. `src/pages/dashboard/AdminDashboard.tsx`: Platform management.
5. `src/components/auth/RegisterForm.tsx`: Detailed seller signup.
