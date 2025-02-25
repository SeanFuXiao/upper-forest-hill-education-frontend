# React + Vite

# Upper Forest Hill Education - Frontend

## Overview

The frontend for Upper Forest Hill Education is a React-based application designed to facilitate course management, user authentication, and role-based access for administrators, teachers, and students.

## Features

- **User Authentication:** Registration, login, and password reset.
- **Role-based Access:**
  - **Admin:** Manage users and courses.
  - **Teachers:** View courses, publish assignments, and manage attendance.
  - **Students:** View courses and submit assignments.
- **Course Management:** Add, edit, and delete courses.
- **Assignment Management:** Teachers can create assignments, and students can submit them.
- **Attendance Management:** Teachers can track student attendance.
- **Calendar Functionality:** Display due dates for courses and assignments.

## Tech Stack

- **Frontend Framework:** React + Vite
- **CSS Framework:** Bootstrap
- **State Management:** React Context API / Hooks
- **API Requests:** `axios`
- **Environment Variables Management:** `.env` file

## Installation

```bash
git clone https://github.com/SeanFuXiao/upper-forest-hill-education-frontend.git
cd upper-forest-hill-education-frontend
npm install
```

## Running the Project

```bash
npm run dev
```

**Default runs at:** `http://localhost:5173`

## Important Files

| File/Directory    | Purpose                                                       |
| ----------------- | ------------------------------------------------------------- |
| `src/api.js`      | Axios configuration for API requests                          |
| `src/pages/`      | Contains all pages (Login, Register, Course Management, etc.) |
| `src/components/` | Reusable components like Navbar and Calendar                  |
| `.env`            | Contains `VITE_API_BASE_URL`                                  |

## Environment Variables

Create a `.env` file with:

```env
VITE_API_BASE_URL=http://localhost:3000/api
```
