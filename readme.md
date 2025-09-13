
---

<div align="center">
  <img src="packages\frontend\public\adoptlySVG.svg" alt="Adoptly Logo" width="100"/>
  <br/>
  <h1>Adoptly - A Modern Pet Adoption Platform</h1>
  <p>A full-stack application built from the ground up, enabling seamless and direct pet adoption from one good home to another.</p>

  <p>
    <a href="#-key-features">Key Features</a> •
    <a href="#-tech-stack--architecture">Tech Stack</a> •
    <a href="#-project-showcase">Showcase</a> •
    <a href="#-getting-started">Setup</a>
  </p>
</div>

<!-- You can add a GIF of your app in action here. It's highly recommended! -->
[![DEMO VIDEO](https://img.youtube.com/vi/UDtcM2PuEo8/maxresdefault.jpg)](https://youtu.be/UDtcM2PuEo8)

## 🐾 About The Project

**Adoptly** was born from a passion for connecting loving homes with pets in need. As my first major solo full-stack project, the goal was to go beyond basic functionality and architect a modern, professional, and scalable application using best practices.

This platform empowers two key user roles: **Sellers**, who can easily list pets needing a new home, and **Adopters**, who can browse, filter, and apply for their perfect companion. The entire application is built on a foundation of clean code, a strong user experience, and a robust backend API.

The user interface and animations were heavily inspired by the high-end designs of sites like [Rejouice](https://www.rejouice.com/) and [Cuberto](https://cuberto.com/), focusing on a minimal aesthetic, fluid animations, and a delightful user experience.

---

## ✨ Key Features

- **Dual Role Authentication:** Secure, stateless JWT-based authentication (stored in httpOnly cookies) with distinct user flows for **Adopters** and **Sellers**.
- **Dynamic Pet Browsing:** A rich browsing experience with real-time, multi-faceted filtering for species, breed, status, and health.
- **Full-Stack Image Management:** A professional image upload system where users upload directly and securely to **Cloudinary**, keeping the backend fast and scalable.
- **Complete Seller Dashboard:** Sellers can create new pet listings, view all their current listings, edit details, and delete listings with confirmation.
- **Comprehensive User Settings:** Users can update their profile information and upload a custom avatar.
- **Adoption & Application Flow (Core Logic):**
  - **Apply for Adoption:** A detailed form for adopters to submit applications.
  - **View Applications:** A dedicated page for sellers to view and manage applications for their pets.
- **Rich, Interactive UI/UX:**
  - Immersive, animated landing page.
  - Custom GSAP-powered mouse follower.
  - Fluid, animated menu system inspired by award-winning design agencies.
  - Site-wide smooth scrolling using `lenis`.
  - Toasts and notifications for user feedback.
- **Responsive Design:** A beautiful, mobile-first design that works seamlessly on all devices.

---

## 🛠️ Tech Stack & Architecture

This project is built as a **monorepo** using npm workspaces, keeping the frontend and backend codebases separate but managed under a single repository.

### Frontend:
| Category | Technology |
| :--- | :--- |
| **Framework** | **React** with **Vite** & **TypeScript** |
| **Styling** | **Tailwind CSS** (v3) for utility-first styling |
| **Components** | **Shadcn UI** for a fully customizable component library |
| **Animation** | **Framer Motion** & **GSAP** |
| **State Management**| **Zustand** (with `persist` middleware) for global auth state |
| **Forms** | **React Hook Form** with **Zod** for validation |
| **API Client** | **Axios** (with a centralized instance) |
| **User Feedback**| `react-hot-toast` |

### Backend:
| Category | Technology |
| :--- | :--- |
| **Framework** | **Node.js** with **Express** |
| **Database** | **MongoDB** with **Mongoose** for modeling |
| **Authentication**| **JSON Web Tokens (JWT)** & **Argon2** for password hashing |
| **Image Handling**| **Cloudinary SDK** for secure signature generation |

### Core Architectural Concepts:
- **RESTful API Design:** A clean, predictable API structure with clear endpoints for resources.
- **Stateless Authentication:** The backend is fully stateless. User identity is verified on each request via an httpOnly JWT cookie.
- **Full-Stack Image Upload Flow:** Implements the secure "signed upload URL" pattern, where the browser uploads directly to Cloudinary, ensuring the backend remains highly performant.
- **Component-Based & Reusable UI:** The frontend is built with a strong focus on creating reusable, self-contained components (`AuthForm`, `InfoCard`, `ChoiceCard`, etc.).

---

## 📸 Project Showcase

To create a professional portfolio piece, I recommend taking high-quality screenshots of the following pages. They tell the complete story of the application.

-   [ ] **The Landing Page:** Highlighting the immersive video hero section and the "Why Choose Us" cards.
-   [ ] **The Browse Pets Page:** Showing the complete layout with the **Filter Panel** on the left and the **Pet Card Grid** on the right.
-   [ ] **The Pet Details Page:** A single pet's page, showcasing the image gallery and detailed information layout.
-   [ ] **The "List a Pet" Form:** Displaying the professional, multi-column form with the image uploader.
-   [ ] **The User Settings Page:** Showing the two-column layout with the avatar uploader and the profile form pre-populated with data.
-   [ ] **The Animated Menu:** A screenshot of the full-screen menu open, with the 'X' button visible on top.

---

## 🚀 Getting Started

To run this project locally, follow these steps:

**1. Clone the repository:**
```bash
git clone https://github.com/your-username/adoptly.git
cd adoptly
```

**2. Configure Environment Variables:**
This project requires two `.env` files.

*   **Backend (`/packages/backend/.env`):**
    ```env
    MONGODB_URI=your_mongodb_connection_string
    JWT_SECRET=your_super_secret_jwt_string
    CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
    CLOUDINARY_API_KEY=your_cloudinary_api_key
    CLOUDINARY_API_SECRET=your_cloudinary_api_secret
    ```

*   **Frontend (`/packages/frontend/.env`):**
    ```env
    VITE_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
    VITE_CLOUDINARY_API_KEY=your_cloudinary_api_key
    ```

**3. Install Dependencies:**
From the **root** directory of the project, run:
```bash
npm install
```
This command will automatically install dependencies for both the `frontend` and `backend` workspaces.

**4. Run the Development Servers:**
You need to run both the frontend and backend servers simultaneously. Open two terminals in the root directory.

*   In **Terminal 1**, run the backend:
    ```bash
    npm run dev:backend
    ```

*   In **Terminal 2**, run the frontend:
    ```bash
    npm run dev:frontend
    ```
    *Alternatively, you can run `npm run dev` from the root to start both concurrently.*

Your application should now be running, with the frontend available at `http://localhost:5173` and the backend at `http://localhost:3000`.
