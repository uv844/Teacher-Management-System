# Teacher Management System (Brutalist Edition)

A high-performance, brutalist-designed Teacher Management System built with React, Express, and Supabase. This portal bridges the gap between authentication identities and academic professional records, providing a streamlined experience for both faculty and administrators.

## 🚀 Features

- **Brutalist UI/UX**: High-contrast, bold design with a focus on typography and motion.
- **Unified Authentication**: Secure JWT-based login and registration system.
- **Admin Dashboard**: Real-time system metrics, user management, and faculty oversight.
- **Faculty Directory**: Comprehensive mapping of teachers to their institutional roles and history.
- **Admin Controls**: Promote/demote users to administrative roles and manage synchronized deletions.
- **Responsive Design**: Fully optimized for both desktop and mobile devices.

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Lucide React, Framer Motion.
- **Backend**: Node.js, Express.js.
- **Database**: Supabase (PostgreSQL).
- **Authentication**: JWT (JSON Web Tokens), bcryptjs for password hashing.

---

## ⚙️ Setup Instructions

### 1. Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- A Supabase account (free tier works perfectly)

### 2. Database Configuration (Supabase)

Create the following tables in your Supabase SQL Editor:

#### `auth_user` Table
```sql
CREATE TABLE auth_user (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  password TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### `teachers` Table
```sql
CREATE TABLE teachers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth_user(id) ON DELETE CASCADE,
  university_name TEXT NOT NULL,
  gender TEXT NOT NULL,
  year_joined INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 3. Environment Variables

Create a `.env` file in the root directory and add the following:

```env
# Supabase Configuration
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# JWT Configuration
JWT_SECRET=your_secure_random_secret_string

# Node Environment
NODE_ENV=development
```

### 4. Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/teacher-management-system.git

# Navigate to the project directory
cd teacher-management-system

# Install dependencies
npm install

# Start the development server
npm run dev
```

---

## 🚢 Deployment

### Deploying to Cloud Run / Vercel / Heroku

1. **Build the Project**:
   ```bash
   npm run build
   ```
2. **Set Environment Variables**: Ensure all variables from your `.env` file are added to your deployment platform's environment settings.
3. **Start Command**: The project is configured to start via `node server.ts` (using `tsx` in development). For production, ensure your start script points to the compiled server or use a process manager like PM2.

### Admin Setup
By default, the system recognizes `admin@test.com` as the master administrator. You can change this in `server.ts` or promote other users via the **Users** tab in the Admin Dashboard once you've logged in as the master admin.

---

## 📁 Project Structure

- `/src`: React frontend source code.
  - `/components`: Reusable UI components and Layout.
  - `/pages`: Individual page views (Dashboard, Profile, Users, etc.).
  - `/lib`: Utility functions and Auth context.
- `/server.ts`: Express.js backend and API routes.
- `/admins.json`: Persistent storage for administrative roles.
- `/metadata.json`: Application metadata and permissions.

---

## 📄 License

This project is open-source and available under the MIT License.
