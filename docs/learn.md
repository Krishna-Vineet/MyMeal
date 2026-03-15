# 🎓 MyMeal: Developer Learning Guide

Namaste! This guide is designed to help you understand the **MyMeal** backend from the ground up. We'll cover the architecture, the flow of data, and how each component works together.

## 1. The Big Picture
MyMeal is built using **AdonisJS**, a powerful Node.js framework that follows the **MVC (Model-View-Controller)** pattern.

-   **Node.js**: The environment that runs our JavaScript on the server.
-   **TypeScript**: A "typed" version of JavaScript that helps us catch errors early (it's what makes the code look like it's from a professional studio).
-   **PostgreSQL**: Our "storage room" where all data is kept permanently.
-   **AdonisJS**: The "manager" that organizes how requests come in, how they are validated, and how they talk to the database.

---

## 2. The Request Lifecycle (How a request travels)
When a user clicks "Login" or "Subscribe", a request is sent to our server. Here is how it flows:

1.  **Routes (`start/routes.ts`)**: The entry gate. It says "If someone hits `/api/v1/login`, send them to `AuthController.login`."
2.  **Middleware (`app/middleware/`)**: The security guards. For example, `auth` middleware checks if the user is logged in. `role` middleware checks if they are a 'cook' or 'consumer'.
3.  **Validators (`app/validators/`)**: The form checkers. They ensure that `email` is a real email, `phone` is unique, and `rating` is between 1-5. If validation fails, the user gets an error immediately.
4.  **Controllers (`app/controllers/`)**: The brain. This is where the logic happens. It takes the validated data and decides what to do.
5.  **Services (`app/services/`)**: The specialist helpers. Controllers often call "Services" for complex tasks (like calculating payments or sending WhatsApp messages) to keep the code clean.
6.  **Models (`app/models/`)**: The data translators. They allow the code to talk to the database in a "human-friendly" way (using Lucid ORM).

---

## 3. Core Features: How they work

### A. Authentication & Registration
When a user registers:
-   The **Validator** checks for unique email and phone.
-   The **Controller** hashes the password (never store plain text!) and saves the User.
-   The **Access Token** system gives the user a "key" (token) so they don't have to log in for every single click.

### B. Subscriptions & Order Generation
This is the heart of the system.
-   **Subscription creation**: We calculate the price based on the `basePrice` + `mealComponentExtras`. 
-   **Order Generation**: As soon as a subscription is created, the `OrderService` runs a loop from the `startDate` to `endDate`. It checks the "Validity Type" (e.g., if it's 'weekdays', it skips Sat/Sun) and creates an `Order` record for every valid date.
-   **Status Transition**: 
    -   `scheduled`: The future state.
    -   `prepared`: Cook marks it ready.
    -   `picked_up` / `missed`: Final states that trigger money moving to the cook's wallet.

### C. The Financial Ledger
We don't just store "money". we track a ledger.
-   `amountPaid`: Total money the consumer has deposited.
-   `amountConsumed`: Total value of meals they have actually picked up or missed.
-   `due`: `amountConsumed - amountPaid`.

When an order is **Completed**, the price of that meal is added to `amountConsumed` and credited to the Cook's **Wallet**.

---

## 4. Advanced Integrations
-   **Cloudinary**: When you upload an image, it doesn't stay on our server. We send it to Cloudinary (a cloud storage) and save the URL they give us. This makes the app fast and scalable.
-   **WhatsApp Business API**: We use `fetch` to send messages to users about payments, notes, and earnings. If the API key is missing, it "simulates" the message in the server logs.

---

## 5. How to be a Pro Developer
-   **Migrations**: Every time you want a new column in the DB, never do it manually in Postgres. Create a migration file (`node ace make:migration`). This keeps the database in sync for everyone.
-   **Types**: Always declare types for your variables. It feels slow at first, but it saves hours of debugging later.
-   **Testing**: Use tools like Japa to verify your logic without having to click through the UI 100 times.

You've got this! The backend is now ready and robust. Happy coding!
