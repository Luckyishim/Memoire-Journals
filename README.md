# Memoire-Journals
Use this website on https://memoire-0610.web.app


# Memoire — Personal Journaling Web App

## Overview

Memoire is a modern, responsive journaling application designed to help users capture thoughts, track emotions, and reflect on daily experiences. It provides a clean and intuitive interface for creating, managing, and searching journal entries in a secure environment.

## Features

### Authentication & User Management

* User signup and login with secure authentication
* Profile update functionality (name, email, password)
* Re-authentication for sensitive actions
* Logout and session handling

### Journal Management

* Create, edit, and delete journal entries
* Rich text editing experience
* Organized entry cards with clean UI
* Real-time updates using Firestore listeners

### Search & Filtering

* Search entries dynamically via query parameters
* Instant filtering without page reload
* Smooth navigation between journal views

### UI/UX Design

* Responsive design across devices
* Modular CSS architecture
* Theme support (light/dark toggle)
* Clean dashboard-style layout with card components

### Prompt Suggestions

* Built-in journaling prompts to help users get started
* Encourages reflection and consistency

## Tech Stack

### Frontend

* React (with hooks)
* React Router for navigation
* Modular CSS styling

### Backend & Services

* Firebase Authentication
* Cloud Firestore (real-time database)
* Firebase Hosting / alternative deployment setups

### Tooling

* Vite for fast builds and development
* Environment-based configuration

## Key Concepts Used

* Real-time data handling with Firestore (`onSnapshot`)
* Protected routes and authentication flow
* State management with custom hooks
* URL-based search and filtering
* Component-based architecture

## Folder Structure (Simplified)

```
src/
│── components/
│── pages/
│── hooks/
│── styles/
│── firebase/
│── assets/
```

## Deployment

* Build using Vite
* Deploy via Firebase Hosting or alternatives like Surge
* SPA routing handled with rewrite rules

## Challenges Solved

* Fixing asset path issues during deployment
* Managing multiple CSS files and responsiveness
* Handling real-time updates efficiently
* Maintaining consistent theme across components

## Future Improvements

* Rich text formatting enhancements
* Tags and categories for entries
* Export/download journal entries
* Offline support
* Analytics for mood tracking

## Purpose

Memoire is built to provide a simple yet powerful space for self-reflection, helping users build a consistent journaling habit with minimal friction.

---

**Author:** Lucky
**Status:** In active development

