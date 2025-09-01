# Google Drive Clone - Frontend

A modern, responsive frontend for the Google Drive clone built with React, Redux Toolkit Query, and Tailwind CSS.

## 🚀 Features

- **Authentication System**
  - User registration with email verification
  - Login/logout functionality
  - Protected routes
  - Persistent authentication state

- **File Management**
  - Upload multiple files
  - Create folders
  - Download files
  - Rename files and folders
  - Delete files and folders
  - File search functionality

- **Modern UI/UX**
  - Responsive design
  - Dark/light mode support
  - Drag and drop file upload
  - Real-time storage usage display
  - Toast notifications
  - Loading states

- **State Management**
  - Redux Toolkit for global state
  - RTK Query for API calls
  - Redux Persist for data persistence

## 🛠️ Tech Stack

- **React 19** - UI library
- **Redux Toolkit** - State management
- **RTK Query** - API data fetching
- **React Router DOM** - Routing
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **React Hook Form** - Form handling
- **Sonner** - Toast notifications
- **Redux Persist** - State persistence

## 📁 Project Structure

```
src/
├── components/
│   ├── auth/
│   │   └── ProtectedRoute.jsx
│   └── ui/
│       ├── button.jsx
│       ├── input.jsx
│       ├── label.jsx
│       ├── avatar.jsx
│       └── progress.jsx
├── layouts/
│   ├── AuthLayout.jsx
│   └── DashboardLayout.jsx
├── pages/
│   ├── auth/
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   └── VerifyEmail.jsx
│   └── dashboard/
│       └── Dashboard.jsx
├── store/
│   ├── api/
│   │   ├── authApi.js
│   │   └── fileApi.js
│   ├── slices/
│   │   └── authSlice.js
│   └── index.js
├── utils/
│   └── format.js
├── lib/
│   └── utils.js
├── App.jsx
└── main.jsx
```

## 🚀 Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```

3. **Build for production:**
   ```bash
   npm run build
   ```

## 🔧 Configuration

The frontend connects to the backend API at `http://localhost:8000/api/v1`. Make sure your backend server is running on this port.

## 📱 Features Overview

### Authentication Flow
1. User registers with email and password
2. Email verification with OTP
3. Login with verified credentials
4. JWT token management with refresh

### File Operations
- **Upload**: Drag & drop or click to upload files
- **Create Folder**: Organize files in folders
- **Download**: Download files to local machine
- **Rename**: Inline editing for file/folder names
- **Delete**: Confirmation dialog before deletion
- **Search**: Real-time file search

### Storage Management
- Real-time storage usage display
- Progress bar showing usage percentage
- 15GB default storage limit per user

## 🎨 UI Components

The project uses a custom UI component library built with:
- **Tailwind CSS** for styling
- **Class Variance Authority** for component variants
- **Radix UI** primitives for accessibility

## 🔒 Security Features

- Protected routes with authentication checks
- JWT token management
- Secure file uploads
- Input validation and sanitization

## 📊 State Management

- **Redux Toolkit**: Global state management
- **RTK Query**: Automatic caching and synchronization
- **Redux Persist**: Persistent authentication state

## 🚀 Deployment

The frontend can be deployed to any static hosting service:

1. Build the project: `npm run build`
2. Deploy the `dist` folder to your hosting service

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is licensed under the MIT License.
