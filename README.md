# 🚀 GigFlow – Mini Freelance Marketplace

GigFlow is a mini freelance marketplace platform where users can post gigs, place bids, and hire freelancers.  
The project focuses on **secure authentication**, **role-less user flow**, and **atomic hiring logic** using MongoDB transactions.

---

## 🛠 Tech Stack

### Frontend
- React (Vite)
- Tailwind CSS

### Backend
- Node.js
- Express.js
- TypeScript

### Database
- MongoDB Atlas
- Mongoose

### Authentication
- JWT (stored in HttpOnly cookies)

### Bonus
- MongoDB Transactions (Race-condition safe hiring)

---

## ✨ Features

### 🔐 Authentication
- User registration & login
- JWT-based authentication using HttpOnly cookies
- No fixed roles (any user can post or bid)

### 📌 Gigs
- Create a gig (authenticated)
- Public feed of open gigs
- Search gigs by title
- Gig status management (`open`, `assigned`)

### 💼 Bidding
- Freelancers can bid on gigs
- Cannot bid on own gig
- Bid status: `pending`, `hired`, `rejected`

### 🤝 Hiring Logic (Core Feature)
- Only gig owner can hire
- Only **one freelancer** can be hired
- Other bids automatically rejected
- Gig marked as assigned
- Implemented using **MongoDB transactions** to prevent race conditions

---

## 🔥 API Endpoints

### Auth
| Method | Endpoint | Description |
|------|---------|-------------|
| POST | `/api/auth/register` | Register user |
| POST | `/api/auth/login` | Login user |

### Gigs
| Method | Endpoint | Description |
|------|---------|-------------|
| GET | `/api/gigs` | Get all open gigs |
| POST | `/api/gigs` | Create a gig (auth) |

### Bids
| Method | Endpoint | Description |
|------|---------|-------------|
| POST | `/api/bids` | Create a bid (auth) |
| GET | `/api/bids/:gigId` | Get bids for a gig (owner only) |
| PATCH | `/api/bids/:bidId/hire` | Hire a freelancer |

---

## 🔑 Environment Variables

Create `.env` files using the examples below.

### Backend
```env
PORT=5000
NODE_ENV=development
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
CLIENT_URL=http://localhost:5173
```
### Frontend
```env
VITE_API_URL=http://localhost:5000
```
## ▶️ Running the Project

### Backend
```bash
cd backend
npm install
npm run dev
```                 
### Frontend
```bash     
cd frontend
npm install
npm run dev
```
## 🎥 Demo Video

📽️ **Loom Walkthrough**  
👉 https://www.loom.com/share/6ce230ee56004575ac569eef2f3b2433

---

## 🌐 Live Demo

- 🔗 **Frontend (Vercel):** https://gig-flow-chi-nine.vercel.app
- 🔗 **Backend (Render):** https://gigflow-ieja.onrender.com

---

## 👨‍💻 Author

**Raj Kumar**  
Full Stack Developer