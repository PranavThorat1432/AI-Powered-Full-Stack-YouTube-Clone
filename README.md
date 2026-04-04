# 🎬 AI Powered YouTube Clone (MERN)

<div align="center">
  <img src="./Client/public/yt.png" alt="Logo" width="180" />
</div>

A comprehensive YouTube-like streaming application built with the MERN stack, featuring AI-powered search, real-time interactions, and complete content management system.

## Table of Contents

- [🌟 Overview](#-overview)
- [🛠️ Tech Stack & Tools](#️-tech-stack--tools)
- [✨ Features](#-features)
- [🎬 Project Preview](#-project-preview)
- [⚡ Quick Start](#-quick-start)
- [📦 Installation](#-installation)
- [⚙️ Configuration](#️-configuration)
- [🎯 Usage](#-usage)
- [📚 API Documentation](#-api-documentation)
- [🎨 UI/UX Features](#-uiux-features)
- [📁 Project Structure](#-project-structure)
- [🧪 Testing](#-testing)
- [🚀 Deployment](#-deployment)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)

## 🌟 Overview

AI Powered YouTube Clone provides a complete video streaming experience with:

- **YouTube-style Interface** - Familiar video and Shorts feed with vertical snapping
- **Advanced Authentication** - Email/password, Google OAuth, OTP-based password reset
- **Content Creation Studio** - Upload videos, shorts, and community posts with Cloudinary storage
- **Smart Interactions** - Like/dislike, save, comments with nested replies, view tracking
- **Channel Management** - Create, customize, and manage personal channels
- **Social Features** - Subscribe to channels, track watch history, get recommendations
- **AI-Powered Discovery** - Intelligent search and category filtering using Google Gemini

The backend is an Express + MongoDB REST API, while the frontend is a React + Vite app using Redux Toolkit and Tailwind CSS.

## 🛠️ Tech Stack & Tools

### Frontend
- **React 19.2.0** + React Router 7.11.0 - UI framework and routing
- **Vite 7.2.4** - Fast development server and build tool
- **Redux Toolkit 2.11.2** + React Redux 9.2.0 - State management
- **Tailwind CSS 4.1.18** - Utility-first CSS framework
- **Axios 1.13.2** - HTTP client for API calls
- **Firebase 12.7.0** - Google authentication
- **React Icons 5.5.0** - Icon library
- **React Spinners 0.17.0** - Loading animations
- **Recharts 3.7.0** - Data visualization

### Backend
- **Node.js + Express 5.2.1** - REST API server
- **MongoDB + Mongoose 9.1.2** - Database and ODM
- **JWT 9.0.3** - Authentication tokens
- **bcryptjs 3.0.3** - Password hashing
- **Cloudinary 2.8.0** - Media storage and CDN
- **Multer 2.0.2** - File upload handling
- **Google Gemini (@google/genai 1.39.0)** - AI-powered search and filtering
- **Nodemailer 7.0.12** - Email notifications
- **Cookie-parser 1.4.7** - Session management

## ✨ Features

### 🔐 Authentication & User Management
- **Multi-method Login**: Email/password and Google OAuth integration
- **Secure Sessions**: HTTP-only JWT cookies with environment-based security
- **Password Recovery**: OTP-based email verification system
- **User Profiles**: Avatar uploads and profile management

### 📺 Content Management
- **Videos**: Upload, update, delete with metadata and thumbnails
- **Shorts**: Vertical video format with TikTok-style experience
- **Community Posts**: Text and image posts for channel engagement
- **Playlists**: Create, manage, and organize video collections

### 🎯 Interactive Features
- **Engagement System**: Like/dislike, save/bookmark functionality
- **Comments & Replies**: Nested comment system 
- **View Tracking**: Automatic view counting for videos and shorts
- **Subscriptions**: Follow channels and get personalized feeds

### 🤖 AI-Powered Features
- **Smart Search**: AI-corrected keywords and typo tolerance
- **Category Intelligence**: Automatic content classification
- **Personalized Recommendations**: Content suggestions based on history
- **Content Discovery**: AI-enhanced browsing and filtering

### 📊 Analytics & History
- **Watch History**: Track viewed videos and shorts
- **Engagement Metrics**: Likes, saves, and view statistics
- **Channel Analytics**: Performance tracking for creators

## 🎬 Project Preview

![1](https://github.com/user-attachments/assets/6b0805a7-5b90-4867-a243-9b60b0ceb6f6)

![2](https://github.com/user-attachments/assets/db2fed17-9f60-4f1c-b4d1-09f557d7c940)

![3](https://github.com/user-attachments/assets/191c0713-7e41-494d-b225-676f0966260c)

![4](https://github.com/user-attachments/assets/3d79bb5b-6865-4589-a2b9-28b695a47290)

![5](https://github.com/user-attachments/assets/012f6346-19d0-49e5-99e7-8df1675f90d9)


### User Experience Flow
```
1. Landing Page → Sign Up/In
2. Home Feed → Browse Videos/Shorts
3. Search → AI-Powered Discovery
4. Watch Content → Interact (Like, Comment, Save)
5. Create Studio → Upload Content
6. Channel Management → Customize Profile
7. Analytics → Track Performance
```

### Key Interfaces
- **Home Page**: AI-enhanced search and content discovery
- **Video Player**: Full YouTube-like playback experience
- **Shorts Feed**: Vertical scrolling with snap navigation
- **Channel Dashboard**: Creator tools and analytics
- **Studio**: Content creation and management



### Data Flow Architecture
1. **Authentication**: JWT tokens in HTTP-only cookies
2. **Content Pipeline**: Upload → Cloudinary → MongoDB → React UI
3. **AI Processing**: User queries → Gemini → Keyword extraction → Content matching
4. **Real-time Updates**: User actions → API → Redux → UI updates

### Key Backend Components
- **Server Configuration**: Express, CORS, cookie parsing
- **Authentication Middleware**: JWT verification with `isAuth`
- **File Upload**: Multer for temporary storage before Cloudinary
- **AI Controller**: Gemini integration for search and filtering

## ⚡ Quick Start

### Prerequisites
- **Node.js 18+** and npm/yarn
- **MongoDB** (local or Atlas)
- **Cloudinary** account for media storage
- **Google Gemini** API key
- **Gmail** account for OTP emails

### Run Locally
```bash
# 1. Clone the repository
git clone https://github.com/yourusername/ai-powered-youtube-clone.git
cd ai-powered-youtube-clone

# 2. Start backend
cd Server
npm install
npm run dev

# 3. Start frontend (new terminal)
cd ../Client
npm install
npm run dev

# 4. Access the app
# Frontend: http://localhost:5173
# Backend: http://localhost:5000
```

## 📦 Installation

### Backend Setup
```bash
cd Server
npm install
```

### Frontend Setup
```bash
cd Client
npm install
```

### Dependencies Overview
- **Backend**: Express, MongoDB, JWT, Cloudinary, Gemini AI, Nodemailer
- **Frontend**: React, Redux, Tailwind CSS, Axios, Firebase

## ⚙️ Configuration

### Server Environment Variables (`Server/.env`)
```env
# Server Configuration
PORT=5000
FRONTEND_URL=http://localhost:5173
NODE_ENV=development

# Database
MONGODB_URL=mongodb+srv://username:password@cluster.mongodb.net/dbname

# Authentication
JWT_SECRET=your-super-secret-jwt-key-here

# AI Services
GEMINI_API_KEY=your-google-gemini-api-key

# Cloud Storage
CLOUD_NAME=your-cloudinary-cloud-name
CLOUD_API_KEY=your-cloudinary-api-key
CLOUD_API_SECRET=your-cloudinary-api-secret

# Email Service
EMAIL=your-email@gmail.com
EMAIL_PASS=your-app-password-or-email-password
```

### Client Environment Variables (`Client/.env`)
```env
VITE_SERVER_URL=http://localhost:5000
VITE_FIREBASE_API_KEY=your-firebase-api-key
```

## 🎯 Usage

### Authentication Flow
- **Sign Up**: Create account with optional avatar upload
- **Sign In**: Email/password or Google OAuth
- **Password Reset**: OTP-based email verification

### Content Creation
- **Upload Videos**: MP4 with thumbnail image
- **Create Shorts**: Vertical format videos
- **Community Posts**: Text posts with optional images
- **Manage Playlists**: Organize video collections

### Discovery & Interaction
- **Browse Feed**: Home page with videos and shorts
- **AI Search**: Smart search with typo correction
- **Category Filter**: AI-powered content classification
- **Engage**: Like, comment, save, and subscribe

## 📚 API Documentation

### Base URL
- **Development**: `http://localhost:5000`
- **Production**: `https://your-domain.com`

### Authentication Endpoints
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/auth/signup` | ❌ | User registration |
| POST | `/auth/signin` | ❌ | User login |
| GET | `/auth/signout` | ❌ | Clear session |
| POST | `/auth/google-auth` | ❌ | Google OAuth |
| POST | `/auth/send-otp` | ❌ | Send password reset OTP |
| POST | `/auth/verify-otp` | ❌ | Verify OTP |
| POST | `/auth/reset-password` | ❌ | Reset password |

### Content Endpoints
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/content/videos/public` | ❌ | Public videos |
| GET | `/content/get-videos` | ✅ | Authenticated videos |
| POST | `/content/create-video` | ✅ | Upload video |
| PUT | `/content/video/:id/toggle-like` | ✅ | Toggle like |
| POST | `/content/video/:id/add-comment` | ✅ | Add comment |

### AI Endpoints
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/content/search` | ✅ | AI-enhanced search |
| POST | `/content/filter` | ✅ | AI category filtering |

### Request Examples
```javascript
// AI Search
POST /api/content/search
{
  "input": "gta 5 gameplay"
}

// Add Comment
POST /api/content/video/:id/add-comment
{
  "message": "Great video!"
}
```

## 🎨 UI/UX Features

### Design System
- **Responsive Layout**: Mobile-first design with Tailwind CSS
- **Dark Theme**: YouTube-like dark interface
- **Component Library**: Reusable React components
- **Loading States**: Skeleton screens and spinners

### Interactive Elements
- **YouTube-like Interactions**: Familiar button styles and behaviors
- **Shorts Experience**: Vertical snap scrolling
- **Real-time Updates**: Instant UI feedback
- **Error Handling**: Graceful error states with user feedback

### Accessibility
- **Semantic HTML**: Proper heading hierarchy
- **ARIA Labels**: Screen reader support
- **Keyboard Navigation**: Full keyboard accessibility
- **Focus Management**: Logical tab order

## 📁 Project Structure

```
AI-Powered-YouTube-Clone/
├── 📁 Client/                     # React Frontend
│   ├── 📁 src/
│   │   ├── 📁 Components/        # Reusable UI components
│   │   │   ├── PostCard.jsx      # Community post component
│   │   │   ├── CustomAlert.jsx   # Alert notifications
│   │   │   └── ...               # Other components
│   │   ├── 📁 Pages/             # Route components
│   │   │   ├── 📁 Videos/        # Video pages
│   │   │   ├── 📁 Shorts/        # Short pages
│   │   │   ├── 📁 Playlists/     # Playlist pages
│   │   │   ├── 📁 Channel/       # Channel pages
│   │   │   ├── Home.jsx          # Main feed
│   │   │   └── ...               # Other pages
│   │   ├── 📁 Redux/             # State management
│   │   │   ├── contentSlice.js   # Content state
│   │   │   ├── userSlice.js      # User state
│   │   │   └── store.js          # Redux store
│   │   ├── 📁 Hooks/             # Custom hooks
│   │   │   ├── useGetCurrentUser.js
│   │   │   ├── useGetContentData.js
│   │   │   └── useGetRecommendedContent.js
│   │   └── 📁 Utils/             # Utilities
│   ├── 📄 package.json
│   └── 📄 vite.config.js
├── 📁 Server/                     # Node.js Backend
│   ├── 📁 Controllers/           # Route handlers
│   │   ├── authController.js     # Authentication
│   │   ├── userController.js     # User management
│   │   ├── videoController.js   # Video operations
│   │   ├── shortController.js   # Short operations
│   │   ├── playlistController.js # Playlists
│   │   ├── postController.js     # Community posts
│   │   └── aiController.js       # AI features
│   ├── 📁 Models/               # Database schemas
│   │   ├── User.js
│   │   ├── Channel.js
│   │   ├── Video.js
│   │   ├── Short.js
│   │   ├── Playlist.js
│   │   └── Post.js
│   ├── 📁 Routes/               # API routes
│   │   ├── authRoute.js
│   │   ├── userRoute.js
│   │   └── contentRoute.js
│   ├── 📁 Middlewares/          # Express middleware
│   │   ├── isAuth.js           # JWT verification
│   │   └── multer.js          # File upload
│   ├── 📁 Config/               # Configuration
│   │   ├── cloudinary.js       # Cloud storage
│   │   ├── mongoDB.js          # Database connection
│   │   └── emailHelper.js      # Email service
│   ├── 📄 server.js            # Express app
│   └── 📄 package.json
└── 📄 README.md                # This file
```

## 🧪 Testing

### Manual Testing Checklist

#### Authentication Flow
- [ ] User registration with email verification
- [ ] Email/password login functionality
- [ ] Google OAuth integration
- [ ] Password reset OTP flow
- [ ] Session management and logout

#### Content Management
- [ ] Video upload with thumbnail
- [ ] Short creation and metadata
- [ ] Playlist creation and management
- [ ] Community post creation
- [ ] Content deletion and updates

#### Interactive Features
- [ ] Like/dislike functionality
- [ ] Save/bookmark system
- [ ] Comment and reply system
- [ ] View tracking
- [ ] Subscription system

#### AI Features
- [ ] Search with typo correction
- [ ] Category-based filtering
- [ ] Recommendation engine
- [ ] Keyword extraction accuracy

#### Performance Testing
- [ ] Large file upload handling
- [ ] Concurrent user interactions
- [ ] Mobile responsiveness
- [ ] Loading state management

### Testing Commands
```bash
# Frontend linting
cd Client
npm run lint

# Backend testing (manual)
cd Server
npm run dev
# Test endpoints with Postman/Insomnia
```

## 🚀 Deployment

### Production Environment Setup

#### Backend Deployment
```bash
# Set production variables
export NODE_ENV=production
export FRONTEND_URL=https://your-domain.com

# Install and start
npm install --production
npm start
```

#### Frontend Deployment
```bash
# Build for production
npm run build

# Deploy dist/ folder to static hosting
# Configure SPA routing
```

### Environment-Specific Configurations
- **Database**: Use MongoDB Atlas for production
- **Security**: Enable HTTPS and secure cookies
- **CORS**: Update origin to production domain
- **Cloudinary**: Configure signed uploads




## 🤝 Contributing

### How to Contribute
1. **Fork Repository**
2. **Create Feature Branch** (`git checkout -b feature/amazing-feature`)
3. **Commit Changes** (`git commit -m 'Add amazing feature'`)
4. **Push to Branch** (`git push origin feature/amazing-feature`)
5. **Open Pull Request**

### Code Standards
- **Follow ESLint Rules**: Maintain consistent code style
- **Write Clear Messages**: Descriptive commit messages
- **Test Thoroughly**: Ensure features work as expected
- **Document Changes**: Update README for new features

### Bug Reports
- **Use Issue Template**: Provide detailed reproduction steps
- **Include Environment**: OS, browser, and version info
- **Add Screenshots**: Visual documentation of issues
- **Be Specific**: Clear title and description

### Development Guidelines
- **Component Structure**: Keep components small and focused
- **State Management**: Use Redux for global state, local state for UI
- **API Design**: RESTful endpoints with consistent responses
- **Error Handling**: Graceful error states with user feedback
- **Performance**: Optimize images and implement lazy loading

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](./LICENSE) file for details.


## 📞 Contact & Support

| Platform              | Link                                                          |
| --------------------- | ------------------------------------------------------------- |
| 🧑 **Author**      | Pranav Thorat                      |
| 🌐 **Live Demo**      | [View Now](https://youtube-pyta.onrender.com)                        |
| 🧑‍💻 **GitHub Repo** | [View Code](https://github.com/PranavThorat1432/AI-Powered-Full-Stack-YouTube-Clone) |
| 💼 **LinkedIn**       | [Connect with Me](https://www.linkedin.com/in/curiouspranavthorat)       |
| 📩 **Email**          | [pranavthorat95@gmail.com](mailto:pranavthorat95@gmail.com)   |


---

<div align="center">

**⭐ If you find this project helpful, please give it a star!**

**🚀 Happy Learning & Teaching!**

</div>