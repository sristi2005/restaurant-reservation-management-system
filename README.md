# 🍽️ Restaurant Reservation Management System

A full-stack Restaurant Reservation Management System built using the MERN stack. The application enables customers to reserve tables while providing administrators with complete reservation management through secure role-based access control.

This project was developed as part of a Full-Stack Developer technical assessment with a focus on clean architecture, business logic, security, and maintainability.

---

## ✨ Features

### Customer

- Secure Registration & Login
- JWT Authentication
- Create Reservations
- Automatic Table Assignment
- View Personal Reservations
- Update Existing Reservations
- Cancel Reservations

### Administrator

- Secure Admin Login
- View All Reservations
- Filter Reservations by Date
- Update Any Reservation
- Cancel Any Reservation
- View Restaurant Tables

---

## 🚀 Tech Stack

### Frontend

- React
- Vite
- React Router
- Axios
- Vanilla CSS

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- bcryptjs
- express-validator

---

## 📂 Project Structure

```
restaurant-reservation-management-system/
│
├── backend/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── server.js
│   └── .env.example
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
└── README.md
```

---

## 🔐 Authentication

The application uses JSON Web Tokens (JWT) for authentication.

- Customer Registration
- Secure Login
- Password Hashing using bcryptjs
- Protected API Routes
- Role-Based Authorization

Roles:

- Customer
- Administrator

---

## 🪑 Intelligent Table Assignment

Instead of requiring customers to manually select a table, the system automatically assigns the most suitable available table.

### Reservation Algorithm

1. Find all tables with capacity greater than or equal to the requested guest count.
2. Sort tables by ascending seating capacity.
3. Check reservation conflicts for the selected date and time slot.
4. Assign the first available table.
5. If no suitable table exists, return an appropriate error message.

This approach minimizes unused seating while preventing double bookings.

---

## ✅ Reservation Validation

The system validates every reservation request by ensuring:

- User is authenticated
- Date is valid
- Time slot is valid
- Guest count is greater than zero
- Suitable table exists
- No overlapping reservation exists for the assigned table

---

## 👥 Role-Based Access Control

### Customer

Customers can:

- Create reservations
- View their reservations
- Update their reservations
- Cancel their reservations

### Administrator

Administrators can:

- View all reservations
- Filter reservations by date
- Update any reservation
- Cancel any reservation
- View restaurant tables

---

## ⚙️ Setup Instructions

### Clone Repository

```bash
git clone https://github.com/yourusername/restaurant-reservation-management-system.git
```

---

## Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file.

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
SECRET=your_jwt_secret
```

Run the server.

```bash
npm start
```

---

## Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

## 👨‍💼 Default Admin Account

For demonstration purposes, the backend automatically seeds an administrator account if one does not already exist.

```
Email:
admin@reserveit.com

Password:
admin123
```

> This account is intended only for testing. In production, administrator accounts should be created securely.

---

## 🌐 Deployment

Frontend

```
Vercel
```

Backend

```
Render
```

Database

```
MongoDB Atlas
```

---

## 📸 Screenshots

> Add screenshots of:

- Login Page
Secure JWT-based authentication for Customers and Administrators.
![Login](<img width="1920" height="1080" alt="Screenshot (605)" src="https://github.com/user-attachments/assets/4b9c81e4-8115-424b-af41-a41994d6c3f0" />)

- Customer Dashboard
- Reservation Form
- Reservation List
- Admin Dashboard

---

## 📈 Future Improvements

- WebSocket-based live reservation updates
- Email notifications
- Pagination
- Audit logs
- Timezone support
- Restaurant operating hours
- Multiple restaurant support
- Unit & Integration Testing
- Docker support

---

## ⚠️ Known Limitations

- Fixed reservation time slots
- No timezone handling
- No payment integration
- No notification system
- No audit logging

---

## 📄 Environment Variables

```env
PORT=
MONGO_URI=
SECRET=
```
---
