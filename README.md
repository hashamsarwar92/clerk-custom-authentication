# 📦 Project Dependencies & Setup

This project uses modern React libraries for form handling, validation, authentication, webhooks, and UI icons.

---

## 🧩 Tech Stack Overview (Correct Order)

1. **React Hook Form** – Handles form state and submission efficiently
2. **Zod** – Schema-based validation for forms and data
3. **Hookform Resolvers** – Connects React Hook Form with validation libraries like Zod
4. **Clerk** – Authentication and user management system
5. **Svix** – Secure webhook verification and handling
6. **Lucide React** – Icon library for React applications

---

## 📥 Installation Guide

### Install dependencies individually

```bash
npm install react-hook-form
```

```bash
npm install zod
```

```bash
npm install @hookform/resolvers
```

```bash
npm install @clerk/nextjs
```

```bash
npm install svix
```

```bash
npm install lucide-react
```

```bash
npm install -g localtunnel
```

---

### ⚡ Install all dependencies in one command

```bash
npm install react-hook-form zod @hookform/resolvers @clerk/clerk-react svix lucide-react
```

---

## 🔐 Usage Examples

### React Hook Form + Zod Setup

```js
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
```

---

### Clerk Authentication

```js
import { ClerkProvider, useUser } from "@clerk/clerk-react";
```

---

### Svix Webhooks

```js
import { Webhook } from "svix";
```

---

### Lucide React Icons

```js
import { Camera, Trash, User } from "lucide-react";
```

---

## 📁 Suggested Folder Structure

```
lib/
 ├── components/
 ├── pages/
 ├── hooks/
 ├── lib/
 ├── validations/
 └── utils/
```

---

## 🚀 Summary

This setup provides:

* ✅ Strong form handling (React Hook Form)
* ✅ Schema validation (Zod)
* ✅ Authentication system (Clerk)
* ✅ Secure webhook handling (Svix)
* ✅ Modern UI icons (Lucide React)

---

## 🧠 Notes

* Always use Zod schemas with React Hook Form for better type safety
* Keep Clerk provider at the root of your app
* Verify all webhooks using Svix before processing data
