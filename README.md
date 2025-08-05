# Product List App

## Goal

A simple fullstack Next.js app (frontend + backend) to manage a personal product list.

---

## Features

- Login with **email only** (no password)
- Add products with:
  - product name
  - amount
  - comment
- View, edit, delete, and reorder product list
- Filter products by date and amount range
- Sort and search products
- "Load more" to paginate the product list
- Each email sees only their own items

---

## Tech Stack

- **Frontend Framework** : Next.js 15 (Pages Router)
- **Styling** : Tailwind CSS + shadcn/ui components
- **Database** : MongoDB with Mongoose ODM
- **Language** : TypeScript
- **Authentication** : JWT (JSON Web Tokens)
- **Drag & Drop** : Drag & Drop
- **State Management** : React Context API + Custom Hooks
- **API** : Next.js API Routes


## Environment variables

```bash
# Database Configuration
MONGODB_URI=mongodb+srv://your-username:your-password@cluster.mongodb.net/product-list-app

# OR for Local MongoDB:
MONGODB_URI=mongodb://localhost:your db port /product-list-app

# JWT Authentication
JWT_SECRET=your-super-secure-jwt-secret-key-here

```

## Usage Flow

### user login

- Enter your email
- New users get automatically registered 
- Redirected to product list

### Product List

- View all your products
- Add new products with the "+" button
- Edit products inline by clicking on edit button
- Delete products with the trash icon
- Drag and drop to reorder
- Use filters to find specific products
- Load more products as needed

### Folder Structure

```
├── pages/ 
│ ├── api/ → API routes
│ ├── index.tsx
│ ├── login.tsx
│ ├── _app.tsx
│ └── _document.tsx
│
├── public/ → Static assets
│
├── src/
│ ├── config/ → Configuration files
│ ├── context/ → Global state (auth)
│ ├── hooks/ → Custom React hooks for products
│ ├── layout/ → UI components with Tailwind styling
│ ├── models/ → MongoDB/Mongoose models
│ ├── screens/ → Page-level components
│ ├── service/ → Frontend fetching logic
│ ├── types/ → TypeScript definitions
│ ├── utils/ → Utility/helper functions
│ └── styles/ → Shared styling if needed
│
├── .env → Environment variables
├── .gitignore
├── package.json

```

## Local Setup

```bash
# Clone the repository
git clone https://github.com/buka1calvin/technical-test.git

# Move into the project folder
cd technical-test

# Install dependencies
npm install

# Start the development server
npm run dev