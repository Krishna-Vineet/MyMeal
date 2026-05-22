# MyMeal System Design

```mermaid
flowchart LR
  U[Users\nConsumer | Cook] --> C[MyMeal Web App\nReact + Vite\nReact Router + Zustand + React Query]

  C -->|HTTPS /api/v1| A[MyMeal API\nAdonisJS + TypeScript]

  subgraph API[AdonisJS Backend]
    R[Route Layer\nAuth, Profile, Discover, Meal Plans,\nSubscriptions, Orders, Payments, Reviews]
    M[Middleware\nAuth, Role, Force JSON]
    CTR[Controllers]
    SVC[Domain Services\nOrderService, PaymentService, NotificationService]
    ORM[Lucid Models / ORM]

    R --> M --> CTR --> SVC --> ORM
    CTR --> ORM
  end

  ORM --> DB[(Primary DB\nSQLite (default) / PostgreSQL)]

  SVC --> WA[WhatsApp Integration\nwhatsapp-web.js]
  SVC --> CLD[Cloudinary\nImage Uploads (simulated fallback)]

  DB --> ENT[Core Entities\nUsers, CookProfiles, MealPlans,\nSubscriptions, Orders, Payments, Reviews]

  A -->|JSON responses| C
```

## Key Runtime Flows

1. Authentication: `client` -> `/api/v1/auth/*` -> token/session-based protected routes.
2. Discovery & subscriptions: Consumer discovers cooks, subscribes to meal plans, and generates order schedules.
3. Order lifecycle: Cook updates order status; financials are synced to subscription consumption and cook wallet.
4. Payments: Consumer deposits/topups/settlements; payout flow moves cook wallet funds out.
5. Notifications: Payment/order-note/wallet events trigger WhatsApp notifications.

## Notes

- Backend follows layered flow: Routes -> Middleware -> Controllers -> Services/Models.
- `OrderService` handles order generation, pause/resume edit sync, and auto-missed transitions.
- `PaymentService` uses DB transactions for payment/subscription/wallet consistency.
- DB is configurable; SQLite is default for local development, PostgreSQL is supported.
