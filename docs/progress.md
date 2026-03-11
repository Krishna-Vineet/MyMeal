

# 🍱 MyMeal
# Phase 0 Product & System Design


## Table of Contents
1. Product Overview
2. Core Concepts
3. User Roles
4. System Flows
5. Discovery System
6. Meal Plan Architecture
7. Subscription System
8. Order Engine
9. Payment & Due System
10. Review System
11. Capacity Control
12. Database Architecture
13. Entity Relationships
14. Order Lifecycle
15. Business Rules
16. Edge Cases Considered
17. MVP Scope
18. Tech Stack Moving Forward

---

## 1. Product Overview

**MyMeal** is a hyperlocal marketplace connecting **home cooks** with **consumers seeking homemade meals**.

Unlike traditional food delivery platforms, the system operates on a **pickup-based model**, eliminating the need for delivery logistics.

Consumers subscribe to **customizable meal plans**, pick up food at designated locations, and interact directly with cooks through subscriptions and orders.

Core principles of the product:

* Hyperlocal food discovery
* Subscription-based meal plans
* Flexible meal customization
* Pickup-based logistics
* Transparent payment and due tracking
* Continuous feedback loop between consumer and cook

---

# 2. Core Concepts

The platform revolves around **five main concepts**:

### Cook

A user who prepares meals and publishes meal plans.

### Consumer

A user who subscribes to meal plans and consumes meals.

### Meal Plan

A customizable template created by a cook describing a meal offering.

### Subscription

An agreement between consumer and cook to receive meals according to a plan.

### Order

A daily instance of a meal created from a subscription.

### Review

Feedback left by consumers after meal completion.

---

# 3. User Roles

Two roles exist in the MVP system.

### Consumer

Responsibilities:

* Browse nearby cooks
* Explore meal plans
* Customize meals
* Subscribe to meal plans
* Manage subscriptions
* Pick up meals
* Leave reviews
* Manage payments

---

### Cook

Responsibilities:

* Create profile
* Create meal plans
* Configure meal components
* Configure pickup locations
* Receive subscriptions
* Prepare daily orders
* Mark orders as completed
* View consumer reviews

---

# 4. User Flow

## Consumer Flow

1. Register/Login
2. Enter location
3. Discover cooks nearby
4. Open cook profile
5. View available meal plans
6. Customize meal components
7. Select pickup location
8. Select subscription dates
9. Make advance payment
10. Subscription created
11. Orders generated automatically
12. Consumer picks up meals daily
13. Consumer reviews meals

---

## Cook Flow

1. Register/Login
2. Create cook profile
3. Add kitchen details
4. Create meal plan
5. Define meal components
6. Define pickup locations
7. Set subscriber capacity
8. Wait for subscriptions
9. Receive daily order list
10. Prepare meals
11. Mark orders prepared
12. Consumer picks up meals
13. Orders complete
14. Cook receives reviews

---

# 5. Discovery System

Consumers discover cooks using a **map-based interface**.

Interface contains:

Search bar
Interactive map
Cook location pins
Scrollable cook list

User interactions:

* Moving map updates visible cooks
* Clicking a map pin highlights cook card
* Clicking cook card focuses map pin
* Searching location moves map

Backend queries cooks using **geographical coordinates stored in cook profiles**.

Example query:

```
GET /cooks?lat=28.61&lng=77.37&radius=5km
```

---

# 6. Meal Plan Architecture

Meal plans are **templates created by cooks** describing a meal offering.

Each meal plan includes:

Title
Description
Banner image
Base price
Validity type
Maximum subscribers

Example:

```
Home Style Veg Lunch
Base price: ₹30
Validity: weekdays
Max subscribers: 10
```

Meal plans contain **multiple meal components**.

---

# 7. Meal Components

Meal components represent **individual food items inside a meal plan**.

Examples:

Roti
Rice
Sabzi
Dal
Salad
Achaar

Each component contains:

Minimum quantity
Maximum quantity
Price per unit
Optional or mandatory flag

Example:

| Component | Min | Max | Price    |
| --------- | --- | --- | -------- |
| Roti      | 2   | 4   | ₹5       |
| Rice      | 0   | 1   | ₹10      |
| Sabzi     | 1   | 1   | included |
| Salad     | 0   | 1   | ₹5       |

Consumers select quantities during subscription.

---

# 8. Pickup Locations

Each meal plan may contain **multiple pickup locations**.

Examples:

Sector 62 Metro
Amity Gate
Gaur City Gate

Pickup locations store:

Name
Latitude
Longitude

Consumers select a pickup location during subscription and may change it for individual orders.

---

# 9. Subscription System

Subscriptions represent the **agreement between consumer and cook**.

They store:

Consumer
Meal plan
Pickup location
Start date
End date
Customized meal configuration
Meal price snapshot
Financial information

Example:

```
Consumer subscribes for 30 days
Meal price = ₹50
Total value = ₹1500
```

Subscription also tracks:

Amount paid
Amount consumed

This allows real-time due calculation.

---

# 10. Subscribed Meal Components

When a consumer subscribes, their **custom meal configuration** is stored.

Example:

Consumer selects:

```
Roti: 3
Rice: 1
Salad: 0
```

These selections are stored separately so that cooks know **exact meal preparation requirements**.

---

# 11. Order Generation Engine

Orders are **automatically generated when a subscription is created**.

Algorithm:

1. Take subscription start and end date
2. Check meal plan validity rules
3. Generate order for each valid date

Example:

```
Start: May 1
End: May 30
Validity: weekdays
```

Generated orders:

May 1 → order
May 2 → order
May 3 → skip (Sunday)

Orders store:

Subscription reference
Order date
Pickup location
Status

---

# 12. Order Lifecycle

Orders move through the following states:

```
scheduled
prepared
picked_up
missed
cancelled
```

Explanation:

Scheduled → created but not prepared
Prepared → meal ready for pickup
Picked_up → consumer collected meal
Missed → meal prepared but not collected
Cancelled → cancelled beforehand

Missed orders may incur a penalty (for example 50% charge).

---

# 13. Order Notes

Consumers and cooks can communicate via **order notes**.

Examples:

Consumer:

```
Please add extra chutney
```

Cook:

```
Pickup delayed by 10 minutes
```

Notes are attached to orders and visible to both parties.

---

# 14. Review System

Consumers may review meals after pickup.

Reviews contain:

Rating
Review text
Consumer ID
Cook ID
Meal plan ID
Subscription ID
Order ID

Only **one review per order** is allowed.

Reviews contribute to cook rating statistics.

---

# 15. Payment System

Payments are tracked through a **payment ledger**.

Subscriptions maintain:

Total subscription value
Amount paid
Amount consumed

Due is calculated as:

```
due = amount_consumed - amount_paid
```

Payment types:

Advance → initial subscription payment
Partial → payment during subscription
Settlement → final payment clearing dues
Refund → returned amount when overpaid

---

# 16. Capacity Control

Each meal plan has a **maximum subscriber limit**.

Example:

```
max_subscribers = 10
```

Before creating a subscription, the system checks:

```
active_subscriptions < max_subscribers
```

If the limit is reached, the meal plan cannot accept new subscriptions.

---

# 17. Database Architecture

Core tables in the system:

```
users
cook_profiles
meal_plans
meal_components
pickup_locations
subscriptions
subscribed_meal_components
orders
order_notes
reviews
payments
```

---

# 18. Entity Relationships

High-level relationships:

User → may be cook or consumer
Cook profile → belongs to user
Cook → creates meal plans
Meal plan → contains meal components
Meal plan → contains pickup locations
Consumer → creates subscriptions
Subscription → generates orders
Orders → contain notes and reviews

---

# 19. Edge Cases Considered

The system design already accounts for:

Subscription pauses
Single order cancellation
Pickup location change
Consumer customization of meals
Missed meal penalties
Partial payments
Refunds
Meal plan capacity limits
Price changes after subscription

---

# 20. MVP Scope

The first release focuses on:

Authentication
Cook profiles
Meal plan creation
Meal customization
Subscription system
Order generation
Order management
Reviews
Basic payment tracking

Advanced features like delivery logistics, push notifications, and real payment gateway integrations are intentionally excluded from MVP.

---

# 21. Technology Stack Moving Forward

Backend framework:

**AdonisJS**

Frontend framework:

**React**

Styling:

**Tailwind CSS**

Database:

**PostgreSQL**

---

# Phase-0 Outcome

After Phase-0, the following are finalized:

Product idea
User roles
System flows
Discovery model
Meal plan architecture
Subscription engine
Order lifecycle
Payment logic
Database entities
Edge cases

This provides a **clear blueprint for engineering implementation**.

---











# MyMeal — Phase 1 Report

**Project:** MyMeal
**Phase:** Phase 1 — Backend Foundation Setup
**Goal:** Establish a stable backend infrastructure ready for feature development.

Phase 1 focuses on building the **technical foundation** of the system before implementing application features.

---

# 1. Objectives of Phase 1

The primary objectives of Phase 1 were:

* Initialize backend framework
* Establish project structure
* Configure environment variables
* Connect production-grade database
* Implement API versioning
* Prepare routing architecture
* Ensure scalability and maintainability

This phase ensures that the system follows **industry-grade backend architecture** from the beginning.

---

# 2. Backend Framework Selection

The backend framework selected is:

**Framework:** AdonisJS

Reasons for choosing AdonisJS:

* Full-stack backend framework
* MVC architecture
* Built-in authentication
* Built-in ORM (Lucid)
* Strong TypeScript support
* Middleware system
* Scalable architecture similar to Laravel

This makes it suitable for building a **production-level API platform**.

---

# 3. Backend Initialization

The backend project was initialized using the AdonisJS CLI.

Initial setup automatically generated:

```
app/
config/
database/
start/
.env
```

These folders represent the **core backend architecture**.

---

# 4. Project Structure

The backend now follows a **clean MVC structure**.

Main directories:

```
app/
 ├ controllers
 ├ models
 ├ middleware

config/
 ├ database
 ├ auth

database/
 ├ migrations
 ├ seeders

start/
 ├ routes
 ├ kernel
```

Explanation:

**Controllers**

Handle API logic.

Example:

```
AuthController
AccountController
```

---

**Models**

Represent database tables using Lucid ORM.

Examples:

```
User
CookProfile
MealPlan
Subscription
Order
```

---

**Migrations**

Define database schema.

Purpose:

```
version controlled database
team collaboration
reproducible environments
```

---

**Middleware**

Used for request processing such as:

```
authentication
authorization
role validation
```

---

**Routes**

Central location for defining API endpoints.

---

# 5. Environment Configuration

The project uses environment variables via `.env`.

Example variables:

```
PORT
HOST
NODE_ENV
APP_KEY
APP_URL
LOG_LEVEL
```

Purpose of `.env`:

* Store sensitive configuration
* Separate development & production configs
* Prevent secrets from being committed to git

---

# 6. Database Setup

Primary database selected:

**Database:** PostgreSQL

Cloud provider used:

**Database hosting:** Neon

Reasons:

* Serverless Postgres
* Automatic scaling
* Branching support
* Free tier for development
* Production-grade reliability

---

# 7. Neon Database Integration

A Neon project was created and connected to the backend.

Connection was configured through:

```
DATABASE_URL
```

Using **Neon Pooler Connection String**.

Benefits of using pooler:

```
connection pooling
better concurrency
lower latency
serverless optimization
```

---

# 8. Database Driver Setup

AdonisJS was configured to use the PostgreSQL driver:

```
pg
```

Configuration handled inside:

```
config/database.ts
```

Key configuration values:

```
client: pg
connection: env variables
migrations path
debug mode
```

---

# 9. Database Migration System

The database migration system was initialized.

Migration commands used:

```
node ace migration:run
```

Purpose:

* Apply database schema
* Keep schema versioned
* Enable reproducible environments

Initial migrations executed successfully on Neon.

---

# 10. API Architecture

The project follows a **REST API structure**.

Base API prefix:

```
/api/v1
```

Example routes:

```
/api/v1/auth/signup
/api/v1/auth/login
/api/v1/account/profile
```

---

# 11. API Versioning Strategy

Versioning was introduced early to avoid breaking APIs in the future.

Current version:

```
v1
```

Example:

```
/api/v1/auth
```

Future upgrades may introduce:

```
/api/v2
```

without affecting existing users.

---

# 12. Routing Architecture

Routes are organized using route groups.

Example logical structure:

```
/api/v1
   ├ auth
   ├ account
   ├ cooks
   ├ meals
   ├ subscriptions
```

Benefits:

```
clean API structure
maintainability
clear separation of features
```

---

# 13. Authentication System

Authentication uses the built-in token system of AdonisJS.

Token system:

```
Access Tokens
```

Tokens are stored in the database and used to authenticate API requests.

Example usage:

```
Authorization: Bearer TOKEN
```

This enables secure API access.

---

# 14. Security Foundations

Security considerations implemented in Phase 1:

### Password Hashing

Passwords will be hashed using:

```
Adonis hash service
```

Never stored as plain text.

---

### Environment Security

Sensitive credentials stored only in:

```
.env
```

Never committed to source control.

---

### Authentication Middleware

Protected routes use:

```
auth middleware
```

Ensures only authenticated users can access protected APIs.

---

# 15. Health Check Endpoint

Health endpoint available at:

```
/health
```

Purpose:

```
server monitoring
deployment health checks
infrastructure validation
```

---

# 16. Development Tools Prepared

Development setup includes:

```
TypeScript
Hot reload server
Lucid ORM
Migration system
Environment configuration
```

These tools enable efficient development of the backend.

---

# 17. Frontend Preparation

Frontend environment prepared separately.

Frontend stack:

```
React
Vite
Tailwind
```

Frontend will consume backend APIs starting in later phases.

---

# 18. Phase 1 Outcome

At the completion of Phase 1 the project now has:

```
✔ Backend framework initialized
✔ Project architecture established
✔ PostgreSQL database connected
✔ Neon serverless DB configured
✔ Environment variables configured
✔ Migration system active
✔ API versioning implemented
✔ Routing architecture defined
✔ Authentication system ready
✔ Development environment prepared
```

This establishes a **solid production-ready backend foundation**.

---

# 19. What Phase 1 Does NOT Include

Phase 1 intentionally does not implement business features.

Excluded items:

```
user registration
meal plans
subscriptions
orders
payments
reviews
maps
```

These are implemented in later phases.

---

# 20. Next Phase

Next development phase:

```
Phase 2 — Core Backend System
```

Phase 2 focuses on:

```
database schema design
user system
authentication APIs
role system
protected APIs
core models
```

This phase will transform the backend into a **functional application API**.

---











---

# MyMeal — Phase 2 Report

**Project:** MyMeal
**Phase:** Phase 2 — Core Backend System
**Goal:** Build the core backend system including database schema, authentication, role system, and protected APIs.

Phase 2 converts the backend foundation created in Phase 1 into a **functional backend capable of handling real users and core application data**.

---

# 1. Objectives of Phase 2

The main goals of this phase were:

* Design a production-grade database schema
* Implement core application entities
* Establish relationships between entities
* Implement user authentication system
* Introduce role-based access control
* Create protected API endpoints
* Ensure backend data flow supports the MyMeal business model

---

# 2. Database System

Primary database used:

**Database:** PostgreSQL

Hosted on:

**Platform:** Neon

Benefits:

* serverless scaling
* connection pooling
* managed infrastructure
* reliable Postgres environment

---

# 3. ORM System

The backend uses the ORM provided by AdonisJS.

ORM used:

```text
Lucid ORM
```

Lucid provides:

* model based database access
* relationship management
* migrations
* query builder
* TypeScript support

---

# 4. Database Schema Design

A complete schema representing the **MyMeal ecosystem** was implemented.

Core entities include:

```text
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

These tables represent the full **consumer–cook–meal–order lifecycle**.

---

# 5. Users System

The **users table** is the base identity table for the system.

Key fields:

```text
id
name
email
password
role
created_at
updated_at
```

Roles implemented:

```text
consumer
cook
```

Purpose:

* allow users to register
* allow role-based system
* support both consumers and cooks

---

# 6. Cook Profiles

Cooks have additional information stored in a separate table:

```text
cook_profiles
```

Purpose:

* extend user profile only for cooks
* store cooking-related information

Typical fields:

```text
user_id
bio
location
rating
```

This separation keeps the **users table clean and scalable**.

---

# 7. Meal Plans

Cooks create **meal plans** which represent offerings like:

```text
Breakfast snacks
Dinner thali
Weekly meal plan
```

Meal plan contains:

```text
cook_id
title
description
base_price
status
```

Purpose:

* central object representing a meal offering.

---

# 8. Meal Components

Each meal plan contains multiple components.

Examples:

```text
roti
dal
paneer
salad
achar
```

Fields include:

```text
meal_plan_id
name
default_quantity
max_quantity
price
include (boolean)
```

The `include` field enables **toggle-style components** such as:

```text
salad
achar
```

These components do not require quantity selection.

---

# 9. Pickup Slot System

Pickup slots represent **location + time combinations** created by cooks.

Example:

```text
Home Kitchen — 2:00 PM
College Gate — 2:30 PM
Sector 4 Entrance — 3:00 PM
```

Fields:

```text
meal_plan_id
location
pickup_time
```

Important design decision:

A location can appear **multiple times with different times**.

This supports real-world cooking logistics.

---

# 10. Subscription System

Consumers subscribe to meal plans.

Subscriptions represent:

```text
consumer commits to a meal plan
```

Fields:

```text
consumer_id
meal_plan_id
pickup_slot_id
status
start_date
end_date
```

This table represents the **agreement between cook and consumer**.

---

# 11. Subscribed Meal Components

When a consumer subscribes, the system stores their **final customized meal configuration**.

Stored in:

```text
subscribed_meal_components
```

Fields include:

```text
subscription_id
meal_component_id
quantity
enabled
price
```

Purpose:

* store final selected meal composition
* allow customization
* lock component prices at subscription time

This prevents price changes from affecting existing subscriptions.

---

# 12. Order System

Orders represent the **daily meal fulfillment events**.

Orders are generated from subscriptions.

Fields include:

```text
subscription_id
order_date
status
total_price
pickup_slot_id
```

Purpose:

* track each meal delivery
* maintain daily order records
* support order history

---

# 13. Order Notes

Consumers or cooks can attach notes to an order.

Examples:

```text
Less spicy
Extra roti
Running late
```

Stored in:

```text
order_notes
```

Fields:

```text
order_id
user_id
note
```

---

# 14. Payments System

Payments track financial transactions related to orders.

Fields:

```text
order_id
amount
status
payment_method
transaction_id
```

Offline cash payments were intentionally **removed** to simplify the MVP.

Future versions may integrate:

* Razorpay
* Stripe
* UPI

---

# 15. Review System

Consumers can leave reviews for cooks after orders.

Stored in:

```text
reviews
```

Fields include:

```text
consumer_id
cook_id
rating
comment
```

Purpose:

* build trust
* maintain cook reputation
* help consumers choose meals

---

# 16. Data Relationships

The system now contains structured relationships.

Examples:

```text
User → CookProfile
User → Subscriptions
CookProfile → MealPlans
MealPlans → MealComponents
MealPlans → PickupSlots
Subscriptions → Orders
Orders → Payments
Orders → Reviews
```

These relationships enable efficient data retrieval and scalable architecture.

---

# 17. Authentication System

Authentication implemented using the token system of
AdonisJS.

System uses:

```text
Access Tokens
```

Features:

* token based authentication
* secure API access
* database stored tokens
* logout token invalidation

---

# 18. Implemented Authentication APIs

The following APIs were created:

```text
POST /api/v1/auth/signup
POST /api/v1/auth/login
POST /api/v1/auth/logout
GET  /api/v1/account/profile
```

These APIs allow:

```text
user registration
user login
user logout
fetch authenticated user
```

---

# 19. Protected API System

Protected APIs use the built-in **authentication middleware**.

Example:

```text
auth middleware
```

Flow:

```text
request
↓
token validation
↓
user extracted
↓
controller executed
```

---

# 20. Role-Based Access Control

The system supports role-based authorization.

Roles:

```text
consumer
cook
```

Middleware logic ensures:

```text
only cooks can create meal plans
only consumers can subscribe
```

This prevents misuse of APIs.

---

# 21. Production Design Decisions

Several important architectural decisions were made.

### 1. Subscription Snapshot

Subscribed components store their own price.

Purpose:

```text
prevent price change affecting old subscriptions
```

---

### 2. Pickup Slot Design

Location and time are stored together.

This allows:

```text
same location multiple times
multiple locations same time
```

---

### 3. Clean Role System

Users table handles identity while cook-specific data is separated.

Benefits:

```text
clean architecture
future scalability
```

---

# 22. Migration Execution

All schema migrations were successfully executed on Neon.

Tables created:

```text
cook_profiles
meal_plans
meal_components
subscriptions
subscribed_meal_components
orders
order_notes
payments
reviews
pickup_slots
```

This confirms the database structure is operational.

---

# 23. Phase 2 Outcome

At the end of Phase 2 the system now has:

```text
✔ production-grade relational schema
✔ all core entities implemented
✔ database hosted on Neon
✔ Lucid ORM models
✔ authentication APIs
✔ role-based access control
✔ protected API routes
✔ order and subscription system design
```

The backend is now capable of **handling real application data**.

---

# 24. What Phase 2 Does Not Include

Phase 2 does not yet implement application workflows.

Missing systems include:

```text
cook onboarding APIs
meal plan creation APIs
subscription APIs
order generation logic
map integration
image uploads
payment gateway
```

These are part of later phases.

---

# 25. Next Phase

Next phase:

```text
Phase 3 — Cook Platform
```

Focus areas:

```text
cook profile management
meal plan creation
meal component management
pickup slot creation
map integration for cook locations
consumer meal discovery
```

Phase 3 will make **MyMeal usable by cooks for the first time**.


---

# MyMeal — Phase 3 Report

**Project:** MyMeal
**Phase:** Phase 3 — Cook Platform & Meal Discovery
**Goal:** Implement the primary application workflows for cooks to onboard and for consumers to discover meal plans.

Phase 3 transforms the data models created in Phase 2 into **active application features**, enabling the core "Cook Onboarding" and "Meal Discovery" flows.

---

# 1. Objectives of Phase 3

The primary goals of this phase were:

* Implement Cook Profile management (Onboarding)
* Create a consolidated Meal Plan creation system
* Ensure transactional integrity for complex data structures
* Build the Consumer Discovery API (Map & List view)
* Implement role-based authorization for all new APIs
* Enable deep preloading for efficient frontend data fetching

---

# 2. Cook Onboarding System

Cooks can now formally establish their presence on the platform.

**Endpoints:**
```text
POST  /api/v1/cook-profiles
PATCH /api/v1/cook-profiles
```

**Features:**
* **Middleware Protected**: Only users with the `cook` role can access these.
* **Validation**: Strict validation of kitchen name, phone, bio, and bio location (lat/lng).
* **Profile Logic**: Prevents a user from creating multiple cook profiles.

---

# 3. Consolidated Meal Plan Engine

To support a seamless "Slider UI" (Wizard) on the frontend, we implemented a consolidated creation flow.

**Endpoint:**
```text
POST /api/v1/meal-plans
```

**Architectural Decision:**
Instead of high-frequency individual API calls, the frontend sends the **entire meal plan**, including all **components** and **pickup slots**, in a single request.

**Transactional Integrity:**
The backend uses **Database Transactions**. If saving any part (e.g., a pickup slot) fails, the entire meal plan is rolled back. This ensures a "zero-orphaned-data" state.

---

# 4. Meal Component & Slot Management

Components and slots are now fully operational within the Meal Plan ecosystem.

**Stored Data:**
* **Components**: Roti, Rice, Sabzi, etc., with price and quantity limits.
* **Pickup Slots**: Specific locations and times where consumers can collect meals.

These are managed transactionally during Meal Plan creation and updates.

---

# 5. Consumer Discovery API

The system now powers the core "Map Discovery" experience for consumers.

**Endpoints:**
```text
GET /api/v1/discover/cooks
GET /api/v1/discover/cooks/:id
```

**Features:**
* **Coordinate-Ready**: The index return geolocation data (lat/lng) for map pins.
* **Deep Preloading**: The detail API fetches the cook profile, their active meal plans, AND all associated components/slots in a single query.
* **Efficiency**: This minimizes "waterfall" requests on the frontend, making the app feel incredibly fast.

---

# 6. Security & Authorization

Every endpoint in Phase 3 is secured by our custom **Role System**.

**Enforced Rules:**
* **Auth Middleware**: Ensures user is logged in.
* **Role Middleware**:
    * Only `cook` can create profiles or meal plans.
    * Only `consumer` can access the discovery engine.
* **Owner Validation**: Cooks can only modify their own meal plans.

---

# 7. Production Design Decisions

* **Transactional Creation**: Used `db.transaction` to ensure atomic writes for recursive data structures.
* **Wizard-Friendly Payloads**: Designed validators to accept nested arrays of components and slots.
* **Data Flattening**: The Discovery API flattens complex relationships to provide the frontend with ready-to-use JSON objects.

---

# 8. Phase 3 Outcome

At the end of Phase 3, the MyMeal platform is functionally ready for its two main users:

```text
✔ Cooks can create kitchen profiles
✔ Cooks can publish multi-component meal plans
✔ Cooks can define various pickup locations
✔ Consumers can view all nearby cooks on a map
✔ Consumers can view complete menus for specific cooks
✔ Role security is enforced across the board
✔ Database transactions ensure data integrity
```

The platform is now **"Discovery-Ready"**.

---

# 9. Next Phase

Next phase:

```text
Phase 4 — Subscriptions & Orders
```

Focus areas:

```text
Subscription creation & customization
Advance payment tracking
Automated daily order generation
Order note communication
Order status management (prepared/picked_up)
```

Phase 4 will enable the **core transaction loop** of the MyMeal business model.

---












