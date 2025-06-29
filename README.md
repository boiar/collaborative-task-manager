# Collaborative Task Manager

![Project Preview](project.png

A collaborative platform to create, manage, and discuss ideas — inspired by Reddit and Twitter, tailored for team productivity.

---

## User Stories

- Authenticate users
- Users can **Create**, **Read**, **Update**, and **Delete** (CRUD):
  - Boards
  - Lists
  - Cards (Tasks)
  - Comments on Cards
- Upload files using **Multer**
- Log card changes using **Winston**

---

## Stack

- **Database:** MySQL
- **Backend Framework:** NestJS (REST API)

---

## 🚀 Features & Techniques Implemented

This project includes a variety of advanced backend features to ensure scalability, performance, and maintainability:

- **🔐 JWT Authentication**  
  Secure user authentication using JSON Web Tokens.

- **📶 WebSocket Support**  
  Real-time communication with clients using WebSockets.

- **🧩 Subscriber Pattern**  
  Entity Subscribers in TypeORM to trigger logic after data changes.

- **Rate Limiting**  
  Protects the API from abuse and excessive requests.

- **🌐 CORS & CSRF Protection**
  - CORS enabled for safe API access from different origins
  - CSRF protection for enhanced security in forms and state-changing requests

- **🧪 Testing with Jest**  
  Comprehensive unit and integration testing with Jest.

- **📝 Logging with Winston**  
  Integrated Winston for structured, file-based and console logging.

- **📢 EventEmitter**  
  Utilized Node.js EventEmitter for internal event-driven architecture (e.g., post-registration tasks).

- **⏰ ScheduleModule**  
  Automated tasks with @nestjs/schedule for recurring jobs and cron tasks.

- **🌍 Multi-language Support (i18n)**  
  Application supports Arabic and English using nestjs-i18n.

- **📁 File Upload with Multer**  
  Handled file uploads securely using Multer middleware.

---

## 📁 Technologies Used

- **NodeJs**
- **NestJS**
- **TypeORM**
- **JWT**
- **Jest**
- **Multer**
- **Winston**
- **i18n (nestjs-i18n)**
- **WebSocket Gateway**
- **ScheduleModule**
- **EventEmitter**