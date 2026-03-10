Great. Below is the **MyMeal System Architecture (MVP level)** showing how the **Frontend, Backend, Database, Maps, and Storage** interact. This reflects everything we planned across **Phase 0 → Phase 2**, and prepares for upcoming phases.

---

# MyMeal — System Architecture Diagram (MVP)

```
┌──────────────────────────┐
│        Users             │
│                          │
│  Consumers   |   Cooks   │
└──────────────┬───────────┘
                │
                │ HTTP Requests
                ▼
┌────────────────────────────────┐
│           Frontend             │
│                                │
│  React + Vite + Tailwind       │
│                                │
│  Pages                         │
│  - Home                        │
│  - Auth (Login / Signup)       │
│  - Consumer Dashboard          │
│  - Cook Dashboard              │
│  - Meal Discovery              │
│                                │
│  State Management              │
│  - Zustand / React Query       │
│                                │
└──────────────┬─────────────────┘
            │
            │ REST API
            ▼
┌───────────────────────────────────────┐
│                Backend                │
│                                       │
│         AdonisJS API Server           │
│                                       │
│  Controllers                          │
│  - AuthController                     │
│  - AccountController                  │
│  - CookController (Phase 3)           │
│  - MealPlanController (Phase 3)       │
│  - SubscriptionController (Phase 4)   │
│                                       │
│  Middleware                           │
│  - Auth Middleware                    │
│  - Role Middleware                    │
│                                       │
│  Business Logic                       │
│  - User registration                  │
│  - Login / Token generation           │
│  - Meal plan management               │
│  - Subscription processing            │
│  - Order generation                   │
│                                       │
└──────────────┬────────────────────────┘
        │
ORM Queries    │
        ▼
┌──────────────────────────────────┐
│             ORM Layer            │
│                                  │
│             Lucid ORM            │
│                                  │
│  Models                          │
│  - User                          │
│  - CookProfile                   │
│  - MealPlan                      │
│  - MealComponent                 │
│  - Subscription                  │
│  - SubscribedMealComponent       │
│  - PickupSlot                    │
│  - Order                         │
│  - Payment                       │
│  - Review                        │
│                                  │
└──────────────┬───────────────────┘
        │
        ▼
┌──────────────────────────────┐
│        Database              │
│                              │
│        PostgreSQL            │
│                              │
│   Hosted on Neon             │
│                              │
│ Tables                       │
│ - users                      │
│ - cook_profiles              │
│ - meal_plans                 │
│ - meal_components            │
│ - subscriptions              │
│ - subscribed_meal_components │
│ - pickup_slots               │
│ - orders                     │
│ - payments                   │
│ - reviews                    │
│ - order_notes                │
│                              │
└──────────────────────────────┘
```

---

# External Services (Future Phases)

These are **external integrations planned in later phases**.

```
    ┌─────────────────────────┐
    │       Maps API          │
    │                         │
    │ Google Maps / Mapbox    │
    │                         │
    │ Used For                │
    │ - cook location pins    │
    │ - meal discovery map    │
    │ - pickup location view  │
    └─────────────┬───────────┘
                    │
                    ▼
            Frontend Map UI
```

---

```
    ┌─────────────────────────┐
    │      Image Storage      │
    │                         │
    │       Cloudinary        │
    │                         │
    │ Used For                │
    │ - meal images           │
    │ - cook profile images   │
    │ - food gallery          │
    └─────────────┬───────────┘
                    │
                    ▼
                Backend Upload API
```

---

```
    ┌─────────────────────────┐
    │      Payment Gateway    │
    │                         │
    │  Razorpay / Stripe      │
    │                         │
    │ Used For                │
    │ - subscription payment  │
    │ - order payment         │
    │                         │
    └─────────────┬───────────┘
                    │
                    ▼
                Backend Payment APIs
```

---

# Data Flow Example (Real Scenario)

### Consumer Subscribes to Meal Plan

```
Consumer
   │
   ▼
Frontend
   │
POST /api/v1/subscriptions
   │
   ▼
Backend Controller
   │
   ▼
Validate user + role
   │
   ▼
Create subscription
   │
   ▼
Copy meal components → subscribed_meal_components
   │
   ▼
Store pickup_slot
   │
   ▼
Return subscription
```

---

# Order Generation Flow

```
Subscription
     │
     ▼
Daily Scheduler / Cron
     │
     ▼
Create Order
     │
     ▼
Attach subscribed meal components
     │
     ▼
Ready for cook preparation
```

---

# Security Architecture

```
User Login
   │
   ▼
Password Hash Verification
   │
   ▼
Generate Access Token
   │
   ▼
Store Token in DB
   │
   ▼
Client sends Authorization Header
   │
   ▼
Auth Middleware validates token
   │
   ▼
Controller executes request
```

---

# Production-Level Design Decisions

The architecture supports:

### Scalability

* Serverless Postgres
* Stateless backend APIs
* Token authentication

---

### Data Integrity

* relational schema
* foreign keys
* migrations

---

### Maintainability

* MVC structure
* versioned APIs
* modular controllers

---
