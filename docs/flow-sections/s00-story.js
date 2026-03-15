module.exports = `
<section class="section" id="story">
<h2 class="section-title">📖 The MyMeal Story</h2>

<div class="card open">
<div class="card-header" onclick="this.parentElement.classList.toggle('open')"><h3>What are we building?</h3></div>
<div class="card-body" style="max-height:none">
<p><strong>MyMeal</strong> is a bridge between the comfort of home-cooked food and the fast-paced life of modern consumers. We are building a hyper-local meal subscription engine that empowers home chefs ("Cooks") to run their own professional kitchens while providing "Consumers" with healthy, predictable, and customizable meal plans.</p>
<p style="margin-top:12px">Unlike traditional food delivery, MyMeal focuses on <strong>long-term relationships</strong> via subscriptions, ensuring cooks have stable income and consumers have one less daily chore to worry about.</p>
</div></div>

<div class="card open">
<div class="card-header" onclick="this.parentElement.classList.toggle('open')"><h3>How are we building it?</h3></div>
<div class="card-body" style="max-height:none">
<p>The backend is engineered for <strong>reliability and transparency</strong> using the following principles:</p>
<ul style="margin: 12px 20px; font-size: 13px; color: var(--text2)">
  <li><strong>Robust Foundation:</strong> Powered by <strong>AdonisJS v6</strong> for its elegant TypeScript-first architecture and developer-friendly abstractions.</li>
  <li><strong>Data Integrity:</strong> Every meal plan creation and subscription event is wrapped in <strong>SQL Transactions</strong> to prevent data corruption.</li>
  <li><strong>Daily Order Engine:</strong> Instead of static schedules, we use a dynamic <code>OrderService</code> that generates individual orders for every valid subscription day, allowing for granular status tracking (scheduled → prepared → picked_up).</li>
  <li><strong>Real-time Trust:</strong> Integrated with <strong>WhatsApp Web.js</strong> to send instant notifications for every payment, earning, and order note, keeping both parties in sync without checking the app constantly.</li>
  <li><strong>Financial Ledger:</strong> A dual-entry style ledger tracks <code>amountPaid</code> vs <code>amountConsumed</code>, allowing for flexible payouts and advance payments.</li>
</ul>
</div></div>

<div class="mermaid">
graph TD
  A[Concept] --> B[Home Chef Empowerment]
  A --> C[Healthy Consumer Habits]
  B --> D[Stable Income]
  C --> E[Homestyle Nutrition]
  D --> F[MyMeal Platform]
  E --> F
  F --> G[Real-time Notifications]
  F --> H[Transparent Financials]
</div>
</section>
`;
