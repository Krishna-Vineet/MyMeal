module.exports = `
<nav class="sidebar">
  <h2>🍱 MyMeal Backend</h2>
  <div class="nav-group">
    <div class="nav-group-title">Overview</div>
    <a href="#story">📖 The Story</a>
    <a href="#arch">🏗️ Architecture Flow</a>
    <a href="#models">🗄️ Database Models</a>
    <a href="#middleware">🔗 Middleware Pipeline</a>
  </div>
  <div class="nav-group">
    <div class="nav-group-title">Auth & Profile</div>
    <a href="#api-register">POST /auth/register</a>
    <a href="#api-login">POST /auth/login</a>
    <a href="#api-logout">POST /auth/logout</a>
    <a href="#api-profile">GET /account/profile</a>
  </div>
  <div class="nav-group">
    <div class="nav-group-title">Cook APIs</div>
    <a href="#api-cook-create">POST /cook-profiles</a>
    <a href="#api-cook-update">PATCH /cook-profiles</a>
    <a href="#api-mp-list">GET /meal-plans</a>
    <a href="#api-mp-create">POST /meal-plans</a>
    <a href="#api-mp-update">PATCH /meal-plans/:id</a>
  </div>
  <div class="nav-group">
    <div class="nav-group-title">Consumer APIs</div>
    <a href="#api-discover-list">GET /discover/cooks</a>
    <a href="#api-discover-show">GET /discover/cooks/:id</a>
    <a href="#api-sub-list">GET /subscriptions</a>
    <a href="#api-sub-show">GET /subscriptions/:id</a>
    <a href="#api-sub-create">POST /subscriptions</a>
    <a href="#api-sub-update">PATCH /subscriptions/:id</a>
    <a href="#api-sub-status">PATCH /subscriptions/:id/status</a>
  </div>
  <div class="nav-group">
    <div class="nav-group-title">Orders</div>
    <a href="#api-order-cook">GET /orders/cook</a>
    <a href="#api-order-consumer">GET /orders/consumer</a>
    <a href="#api-order-status">PATCH /orders/:id/status</a>
    <a href="#api-note-list">GET /orders/:id/notes</a>
    <a href="#api-note-create">POST /orders/:id/notes</a>
  </div>
  <div class="nav-group">
    <div class="nav-group-title">Payments & Reviews</div>
    <a href="#api-pay-create">POST /payments</a>
    <a href="#api-pay-list">GET /payments/subscription/:id</a>
    <a href="#api-wallet">GET /payments/wallet/status</a>
    <a href="#api-payout">POST /payments/payout</a>
    <a href="#api-review-create">POST /reviews</a>
    <a href="#api-review-list">GET /reviews/cook/:id</a>
  </div>
  <div class="nav-group">
    <div class="nav-group-title">Services</div>
    <a href="#svc-order">📦 OrderService</a>
    <a href="#svc-payment">💳 PaymentService</a>
    <a href="#svc-notification">🔔 NotificationService</a>
    <a href="#svc-cloudinary">☁️ CloudinaryService</a>
    <a href="#svc-whatsapp">📱 WhatsAppService</a>
  </div>
</nav>

<main class="main">
<h1>MyMeal Backend — Deep Dive</h1>
<p style="color:var(--text2);margin-bottom:32px">Interactive documentation for the complete AdonisJS + PostgreSQL backend. Every model, middleware, API, service — explained.</p>
`;
