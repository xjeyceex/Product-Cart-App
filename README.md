# Project Setup

## How to Setup

1. Clone the repository.
2. Navigate to the project directory.
3. Run the following command to install all dependencies (including legacy peer deps):  
   ### `npm install --legacy-peer-deps`
4. Start the development server:  
   ### `npm start`
5. Open http://localhost:3000 in your browser to view the app.

---

## Features Implemented

- React app bootstrapped with Create React App.
- Uses `localStorage` to persist cart data across page reloads.
- Basic product cart functionality (add, remove, update items).
- State management with React hooks.
- Assumes modern browser with ES6+ support.
- Assumes Node.js and npm are installed.
- Uses `--legacy-peer-deps` flag to resolve dependency conflicts with React and testing libraries.

---

## Feature Flow / Behavior

- Clicking a product displays a card with more details.
- When adding a product to the cart, the product quantity resets to 1.
- The total count of items in the cart does not change immediately upon adding.
- The grand total updates, applying a 10% discount if the total reaches $100 or more.

## Time Spent

- Total development time: Approximately **1 hour 30 minutes**  

