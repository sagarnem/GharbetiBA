# Gharbeti BA - House Rental Management System

## Overview

Gharbeti BA is a digital platform designed to help property owners in Nepal manage their rental properties efficiently. The platform provides tools to:

- Post and manage rental properties (houses, apartments, rooms)
- Track rent payments with automated billing and reminders
- Maintain detailed tenant records, including citizenship information and rental agreements
- Flag tenants who default on rent through a warning list system
- Help tenants search for suitable rental properties

## Features

- Automated rent calculation and billing
- Payment tracking (paid, due, overdue)
- Secure tenant profile management
- Warning list for problematic tenants
- Property listing and inquiry system
- Search and filter options for tenants

## Technology Stack

- Frontend: Next.js, TypeScript
- Backend: Django REST Framework
- Database: MySQL

## Getting Started

### Prerequisites

- Node.js (v14+)
- Python (v3.8+)
- MySQL server


### Installation


# 1. Clone the repository
```bash
git clone git@github.com:sagarnem/GharbetiBA.git
cd gharbeti-ba

# 2. Setup backend
cd backend
python -m venv venv
source venv/bin/activate      # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver


# 3. Setup frontend
```bash
cd ../frontend
npm install
npm run dev
