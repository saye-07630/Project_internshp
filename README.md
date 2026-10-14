Hawi Software Solutions - Enterprise Web Application

📌 Project Context & My Contribution

This repository is a fork of the enterprise team project developed during my internship at Hawi Software Solutions**.

Role: Backend & Database Engineer
Tech Stack: Laravel (PHP), MySQL/PostgreSQL, RESTful APIs, React, TypeScript, Tailwind CSS
My Specific Contributions:
  * Designed and structured relational database schemas and migration scripts.
  * Built RESTful API endpoints for user authentication, project tracking, service requests, and admin management.
  * Implemented model relationships, authorization controllers, and input validation.
  * Solved backend integration issues (fixed 500 API errors, connected real database endpoints, and configured database seeders).


 🚀 Project Overview

Hawi Software Solutions (HSS) is an emerging software firm located in Adama, Ethiopia, specializing in quality software development, business automation, and consultation services. This enterprise web application provides client management dashboards, service tracking, and automated client-admin workflows.


 🛠️ Technology Stack
 Backend & Database
* Framework: Laravel 10 (PHP 8.x)
* Database: MySQL / PostgreSQL
* API Architecture: RESTful API with JSON response formatting
* Authentication: Laravel Sanctum / Token-based Authentication
* ORM: Eloquent ORM

Frontend
* Framework: React 18 with TypeScript
* Build Tool: Vite
* Styling:** Tailwind CSS & shadcn/ui
* Icons & Motion: Lucide React & Framer Motion

---
 ✨ Core Features & Backend Architecture

 🔧 Backend & Database Engineering
* Database Schema & Models: Engineered clean database migrations and Eloquent models with relationships for Users, Service Requests, Messages, and Project Progress.
* Service Request API: Robust API endpoints to submit, view, edit, and update request statuses with database persistence.
* Messaging & Notifications System:Real-time messaging endpoints and notification seeders.
* Admin & User Dashboards API: Role-based access endpoints supporting client project tracking, metrics, and user management.

 👤 Frontend Interface
* User Dashboard: Project progress tracking, service requests submission, and notification panel.
* Admin Dashboard: System analytics, user administration, request handling, and content management.
* Service & Blog Pages: Interactive showcase of HSS services, portfolio, and industry blog posts.

---

 📁 Project Structure

```text
Project_internshp/
├── app/                    # Laravel Backend Logic (Controllers, Models, Middleware)
├── database/               # Database Migrations, Seeders, and Factories
├── routes/                 # API and Web Routes
├── src/                    # React/TypeScript Frontend
│   ├── components/         # Reusable UI components
│   ├── pages/             # Dashboard and Public Pages
│   └── hooks/             # Custom React hooks
├── public/                 # Static Assets
└── package.json            # Frontend Dependencies

🔧 Backend Setup & Quick Start
1. Backend (Laravel) Setup
Bash


# Navigate to backend directory and install dependencies
composer install

# Set up environment variables
cp .env.example .env

# Generate application key
php artisan key:generate

# Run database migrations and seeders
php artisan migrate --seed

# Start the Laravel development server
2. Frontend (React) Setup
Bash


# Install NPM packages
npm install

# Start development server
npm run dev
📄 License
This project was developed during my internship at Hawi Software Solutions. All rights reserved.
php artisan serve
