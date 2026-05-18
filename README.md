# KhalijiGo — Backend

A Node.js/Express REST API for booking one-way car trips from Bahrain to GCC countries. Handles user authentication, booking management with driver conflict prevention, and a blog system.

> 🔗 **Frontend UI Repository:** [View the React.js Frontend Here](https://github.com/mahoozi97/KhalijiGo-frontend)

---

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB + Mongoose
- **Auth:** JWT + bcrypt
- **Dev Tools:** Nodemon, Morgan

---

## Getting Started

## Installation & Running

```bash
# Install dependencies
npm install

# Development
npm run dev
```

### Environment Variables

Create a `.env` file in the root of the backend directory:

```env
PORT=3000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

---

## API Reference

### Auth — `/auth`

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/sign-up` | Register a new user |
| POST | `/auth/sign-in` | Login and receive a JWT |

### Bookings — `/booking`

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| POST | `/booking` | ✅ | User | Create a new booking |
| GET | `/booking` | ✅ | Admin | Get all bookings |
| GET | `/booking/my-bookings` | ✅ | User | Get current user's bookings |
| PUT | `/booking/:id` | ✅ | Admin | Update a booking status |
| DELETE | `/booking/:id` | ✅ | Admin | delete a booking |

### Blogs — `/api/blogs`

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| POST | `/api/blogs` | ✅ | Admin | Create a new blog post |
| GET | `/api/blogs` | ❌ | — | Get all blog posts |
| GET | `/api/blogs/:id` | ❌ | — | Get a single blog post |
| PUT | `/api/blogs/:id` | ✅ | Admin | Update an existing blog post |
| DELETE | `/api/blogs/:id` | ✅ | Admin | Delete a blog post |
| POST | `/api/blogs/:id/comments` | ✅ | User | Add a comment to a post |
| DELETE | `/api/blogs/:id/comments/:commentId` | ✅ | Admin/User | Delete a comment |

---

## Data Models

### User
| Field | Type | Notes |
|-------|------|-------|
| `username` | String | Required, unique, min 3 chars |
| `hashedPassword` | String | bcrypt hashed, never returned in responses |
| `role` | String | `"user"` (default) or `"admin"` |

### Booking
| Field | Type | Notes |
|-------|------|-------|
| `name` | String | Passenger full name |
| `cpr` | String | National ID number |
| `destination` | String | GCC destination |
| `date` | Date | Trip date |
| `phoneNumber` | Number | Contact number |
| `driver` | String | One of: `Ahmed`, `Ali`, `Husain`, `Taha` |
| `status` | String | `Pending ⏳` / `Accepted ✅` / `Completed ✔️` / `Cancelled ❌` |
| `userId` | ObjectId | Ref to User |

### Blog
| Field | Type | Notes |
|-------|------|-------|
| `title` | String | Required |
| `description` | String | Required |
| `image` | String | Image URL, required |
| `comments` | Array | Embedded comment subdocuments |

---

## Key Features

- **Double-booking prevention** — when creating a booking, the API checks for any existing `Pending` or `Accepted` booking for the same driver on the same day and rejects the request with a `409` if a conflict is found.
- **Role-based access** — admin users can view all bookings and update any booking status; regular users are restricted to their own.

---