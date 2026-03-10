Below is a **complete, end-to-end roadmap for MyMeal** from **Phase 0 → Final Phase**, consolidating **everything we have discussed so far** (architecture, schema, map pins, pickup slots with time, subscription snapshot, reviews, orders, payments, media later, etc.).
This roadmap is structured like a **real startup engineering roadmap** so you can follow it step-by-step and also use it as **project documentation**.

---

# MyMeal — Complete Development Roadmap

**Product:** MyMeal
**Goal:** Platform connecting **home cooks** with **consumers** for one-time meals or subscription meal plans.

Key concept:

```
Cook prepares meal plans
↓
Consumers subscribe to them
↓
Consumers pick pickup slot (place + time)
↓
Daily orders are generated
↓
Meals picked up by consumers
↓
Reviews + payments
```

---

# Phase 0 — Product Planning & Architecture

### Objective

Define the **product concept, architecture, and development strategy** before writing code.

### Major Decisions

#### Product Model

Platform connecting:

```
Cooks
Consumers
```

Cooks can sell:

```
one-time meals
subscription meal plans
```

---

### Core System Entities Identified

```
Users
CookProfiles
MealPlans
MealComponents
PickupSlots
Subscriptions
SubscribedMealComponents
Orders
OrderNotes
Payments
Reviews
```

---

### Pickup Slot Design

Important real-world requirement:

```
same location
different times
```

Example:

```
Home Kitchen — 2:00 PM
Home Kitchen — 4:00 PM
College Gate — 2:30 PM
Sector 4 Entrance — 3:00 PM
```

Solution:

```
PickupSlot = location + time
```

---

### Meal Component Design

Meal components include:

```
Roti
Dal
Paneer
Salad
Achar
```

Design supports:

```
quantity based items
toggle items (salad / achar)
```

Field added:

```
include (boolean)
```

---

### Subscription Snapshot Design

When a consumer subscribes:

```
meal components copied
→ subscribed_meal_components
```

Reason:

```
lock prices
allow customization
prevent future price changes affecting old subscriptions
```

---

### Technology Stack Selected

Frontend:

```
React
Vite
Tailwind
```

Backend:

```
AdonisJS
TypeScript
Lucid ORM
```

Database:

```
PostgreSQL
Hosted on Neon
```

---

### Phase 0 Outcome

```
✔ product concept finalized
✔ architecture defined
✔ database entities identified
✔ technology stack chosen
✔ development roadmap planned
```

---

# Phase 1 — Backend Foundation

### Objective

Create the **backend infrastructure** needed for development.

---

### Backend Framework Setup

Framework used:

AdonisJS

Generated project structure:

```
app/
config/
database/
start/
.env
```

---

### MVC Architecture

```
Controllers
Models
Middleware
Routes
Migrations
```

---

### Environment Configuration

Environment variables stored in:

```
.env
```

Example variables:

```
PORT
HOST
NODE_ENV
APP_KEY
LOG_LEVEL
```

---

### Database Setup

Database:

PostgreSQL

Hosted on:

Neon

Connection configured using:

```
DATABASE_URL
pooler connection string
```

---

### Migration System

Adonis migrations enabled.

Command used:

```
node ace migration:run
```

Purpose:

```
versioned database schema
team collaboration
environment reproducibility
```

---

### API Versioning

API prefix introduced:

```
/api/v1
```

Future safe upgrades possible:

```
/api/v2
```

---

### Health Check

Endpoint available:

```
/health
```

Used for:

```
server monitoring
deployment health checks
```

---

### Phase 1 Outcome

```
✔ backend framework initialized
✔ Neon PostgreSQL connected
✔ migration system working
✔ environment config setup
✔ API versioning ready
✔ routing structure defined
```

---

# Phase 2 — Core Backend System

### Objective

Implement **database schema + authentication system**.

---

# Database Schema Implemented

Tables created:

```
users
cook_profiles
meal_plans
meal_components
subscriptions
subscribed_meal_components
pickup_slots
orders
order_notes
payments
reviews
```

---

# Users System

Base identity table.

Fields:

```
id
name
email
password
role
```

Roles:

```
consumer
cook
```

---

# Cook Profiles

Separate cook-specific information.

Purpose:

```
keep users table clean
store cook data separately
```

---

# Meal Plans

Represents food offerings.

Examples:

```
Dinner Thali
Breakfast Snacks
Weekly Tiffin Plan
```

---

# Meal Components

Each meal contains components.

Examples:

```
roti
dal
paneer
salad
achar
```

Supports:

```
quantity items
toggle items
```

---

# Pickup Slots

Location + time combination.

Example:

```
College Gate — 2:30 PM
Home Kitchen — 4:00 PM
```

---

# Subscription System

Consumer commits to meal plan.

Stored fields:

```
consumer_id
meal_plan_id
pickup_slot_id
start_date
end_date
```

---

# Subscribed Meal Components

Stores final meal customization.

Includes:

```
quantity
enabled
price snapshot
```

---

# Orders

Orders represent **daily meal events**.

Generated from subscriptions.

Fields:

```
subscription_id
order_date
status
total_price
pickup_slot_id
```

---

# Order Notes

Notes added by users.

Examples:

```
Less spicy
Extra roti
Running late
```

---

# Payments

Tracks payments.

Fields:

```
order_id
amount
status
transaction_id
```

Cash payments removed in MVP.

---

# Reviews

Consumers review cooks.

Fields:

```
consumer_id
cook_id
rating
comment
```

---

# Authentication System

Implemented using:

AdonisJS Access Tokens.

APIs created:

```
POST /api/v1/auth/signup
POST /api/v1/auth/login
POST /api/v1/auth/logout
GET  /api/v1/account/profile
```

---

# Protected APIs

Authentication middleware implemented.

Role system enforced.

Examples:

```
cook-only APIs
consumer-only APIs
```

---

### Phase 2 Outcome

```
✔ complete relational database schema
✔ authentication system
✔ role system
✔ protected APIs
✔ core platform data structure
```

Backend is now **production-grade and functional**.

---

# Phase 3 — Cook Platform

### Objective

Allow cooks to **join and create meal offerings**.

Features:

```
Create cook profile
Update cook profile
Add kitchen location
Create meal plans
Add meal components
Create pickup slots
```

APIs:

```
POST /cook/profile
POST /meal-plans
POST /meal-components
POST /pickup-slots
```

---

# Phase 4 — Consumer Discovery

### Objective

Allow consumers to **discover cooks and meals**.

Features:

```
Browse meal plans
Search cooks
Filter by location
Filter by price
```

Map integration planned using:

```
Google Maps or Mapbox
```

Map will display:

```
cook pins
pickup locations
```

---

# Phase 5 — Subscription System

### Objective

Allow consumers to subscribe.

Flow:

```
select meal plan
customize components
choose pickup slot
create subscription
```

System will:

```
copy components → subscribed_meal_components
lock pricing
```

---

# Phase 6 — Order Generation System

### Objective

Generate daily orders.

Mechanism:

```
cron job / scheduler
```

Daily process:

```
active subscription
→ create order
→ attach meal components
```

Orders become visible to cooks.

---

# Phase 7 — Payments

Integrate payment gateway.

Options:

```
Razorpay
Stripe
UPI
```

Payments tied to:

```
orders
subscriptions
```

---

# Phase 8 — Reviews & Reputation

Consumers can review cooks.

Features:

```
ratings
comments
cook rating aggregation
```

---

# Phase 9 — Media & Images

Image storage integration.

Recommended service:

```
Cloudinary
```

Used for:

```
meal images
cook profile images
food gallery
```

---

# Phase 10 — Notifications

Notification system.

Types:

```
order reminders
pickup reminders
new meal alerts
```

Channels:

```
email
push notifications
```

---

# Phase 11 — Performance & Scaling

Production improvements:

```
caching
rate limiting
query optimization
indexes
```

Monitoring tools:

```
logging
error tracking
analytics
```

---

# Final Phase — Production Launch

Prepare platform for real users.

Tasks:

```
UI polish
mobile responsiveness
SEO
security audit
load testing
deployment
```

Deployment targets:

```
Frontend → Vercel
Backend → Fly.io / Railway / Render
Database → Neon
```

---

# Final System Capabilities

After all phases the platform supports:

```
cook onboarding
meal plan creation
pickup slot scheduling
consumer discovery
subscriptions
daily order generation
payments
reviews
map-based discovery
image gallery
notifications
```

This becomes a **complete food marketplace platform**.

---

If you want, I can also show you **the 12 biggest architectural mistakes people make in projects like MyMeal** (knowing them now will save you **months of refactoring later**).
