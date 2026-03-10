

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