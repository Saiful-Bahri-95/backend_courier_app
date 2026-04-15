# Backend Courier App

A Node.js backend application using Express.js, connected to MongoDB Atlas, with JWT authentication and email OTP support.

## Tech Stack

| Teknologi | Keterangan |
|---|---|
| Node.js | Runtime environment |
| Express.js | Web framework |
| MongoDB Atlas | Cloud database |
| Mongoose | ODM untuk MongoDB |
| bcryptjs | Hashing password |
| jsonwebtoken | JWT authentication |
| Resend | Kirim email OTP |
| dotenv | Environment variables |
| cors | Cross-Origin Resource Sharing |

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Buat file `.env` di root project:
   ```env
   PORT=3000
   MONGO_URI=your_mongodb_atlas_uri
   JWT_SECRET=your_jwt_secret
   RESEND_API_KEY=your_resend_api_key
   ```

3. Start the server:
   ```bash
   npm start
   ```

Server akan berjalan di port 3000 secara default.

## API Endpoints

### Auth
| Method | Endpoint | Deskripsi |
|---|---|---|
| POST | `/api/signup` | Registrasi user baru |
| POST | `/api/signin` | Login user |
| POST | `/api/forgot-password` | Kirim OTP ke email |
| POST | `/api/reset-password` | Reset password dengan OTP |
| PATCH | `/api/user/profile` | Update profil user (butuh token) |

### General
| Method | Endpoint | Deskripsi |
|---|---|---|
| GET | `/` | Cek server berjalan |
| GET | `/health` | Cek status server & database |

## Project Structure

```
backend_courier_app/
├── controllers/
│   └── user.controller.js
├── middlewares/
│   └── auth.middleware.js
├── models/
│   └── user.js
├── routes/
│   └── auth.js
├── .env
├── index.js
└── package.json
```

## Deployment

App ini di-deploy menggunakan **Railway** dan terhubung ke **MongoDB Atlas**.

- Production URL: `https://backendcourierapp.up.railway.app`
- Health check: `https://backendcourierapp.up.railway.app/health`

## Notes

- OTP berlaku selama **10 menit**
- Password minimal **8 karakter**
- JWT token berlaku selama **1 hari**
- Email OTP dikirim menggunakan **Resend** (free tier: 3.000 email/bulan)