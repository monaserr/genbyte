# 📚 GenByte - Learning Management System

A modern, full-stack learning management system with glassmorphism UI, built with React, Express, and MongoDB.

**Live Demo:** https://genbyte-five.vercel.app  
**Backend API:** https://cozy-fulfillment-production.up.railway.app

---

## ✨ Features

### 🎨 User Interface
- **Glassmorphism Design** - Modern, frosted glass effect UI components
- **Light/Dark Theme** - Automatic theme switching with smooth transitions
- **Responsive Layout** - Optimized for mobile, tablet, and desktop
- **Smooth Animations** - 0.2-0.3s transitions for all interactions
- **Interactive Components** - Hover effects, loading states, and feedback

### 👨‍🎓 Student Features
- **Dashboard Overview** - At-a-glance stats (GPA, tasks, subjects, pending items)
- **Subject Browse** - Filter subjects by year (Year 1-4)
- **Course Materials** - Access summaries (PDFs), exams, and video lectures
- **Task Management** - Create, track, and filter personal study tasks
- **GPA Calculator** - Calculate semester GPA with interactive UI
- **University Links** - Quick access to important links

### 👨‍💼 Admin Features
- **Dashboard Analytics** - User distribution charts and platform stats
- **Subject Management** - Create, edit, and delete courses
- **Content Upload** - Upload:
  - 📄 Course summaries (PDF)
  - 📝 Exams (PDF)
  - 🎥 Video lectures (YouTube links)
  - 🖼️ Subject cover images
- **User Management** - View all registered users in table format
- **Assignment Posting** - Create and assign tasks
- **Link Management** - Maintain university resource links

### 🔒 Security
- **JWT Authentication** - Secure token-based authentication
- **Password Hashing** - bcryptjs with 10 rounds
- **Role-Based Access** - Student vs Admin privileges
- **Protected Routes** - All sensitive operations require authentication
- **CORS Protection** - Cross-origin whitelisting

---

## 🛠️ Tech Stack

### Frontend
- **Vite** - Next generation build tool
- **React 18** - UI library
- **Axios** - HTTP client
- **React Router v6** - Client-side routing
- **CSS-in-JS** - Inline styles with CSS variables

### Backend  
- **Express.js** - Web server
- **MongoDB** - NoSQL database
- **Mongoose** - ODM
- **JWT** - Token authentication
- **bcryptjs** - Password hashing
- **Cloudinary** - File/image storage
- **multer** - File upload handling

### Deployment
- **Vercel** - Frontend hosting
- **Railway** - Backend hosting
- **MongoDB Atlas** - Cloud database

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** 14+ and npm
- **Git**
- MongoDB Atlas account (for cloud DB)or local MongoDB
- Cloudinary account (for file uploads)

### Local Development Setup

#### 1. Clone Repository
```bash
git clone https://github.com/yourusername/genbyte.git
cd genbyte
```

#### 2. Backend Setup
```bash
cd backend
npm install

# Create .env file in backend/
MONGO_URI=mongodb+srv://user:password@cluster0.mongodb.net/genbyte
JWT_SECRET=your-secret-key-make-it-long-and-random
CLOUDINARY_API_KEY=your-cloudinary-key
CLOUDINARY_API_SECRET=your-cloudinary-secret
CLOUDINARY_NAME=your-cloudinary-name
NODE_ENV=development
PORT=5000
```

#### 3. Start Backend
```bash
cd backend
npm start
# Server running at http://localhost:5000
```

#### 4. Frontend Setup
```bash
cd frontend
npm install

# Create .env.local file in frontend/
VITE_API_URL=http://localhost:5000
```

#### 5. Start Frontend
```bash
cd frontend
npm run dev
# App running at http://localhost:5173
```

#### 6. Open in Browser
Visit: http://localhost:5173

---

## 📋 Quick Test Flow

### 1. Register a Student Account
- Click "Sign Up"
- Fill in:
  - Full Name: `John Doe`
  - Email: `john@benha.edu.eg`
  - Password: `TestPassword123` (min 6 chars)
  - Year: Select `Year 1`
- Click "Create Account"
- Redirected to Student Dashboard

### 2. View Subjects
- Click "📚 Subjects" in sidebar
- Click year filters to see subjects for that year
- Hover on subject cards to see animations
- Buttons available: 📄 Summaries, 📝 Exams, 🎥 Videos

### 3. Admin Testing
Create an admin account manually:
```bash
# In MongoDB Atlas (or local MongoDB)
db.users.insertOne({
  name: "Admin User",
  email: "admin@benha.edu.eg",
  password: "$2a$10$...", // bcrypt-hashed "password123"
  role: "admin",
  year: "Year 1",
  createdAt: new Date()
})
```

Or use the backend test suite to create users with proper hashing.

### 4. Admin Dashboard (if admin)
- Login with admin account
- Click "📊 Dashboard" in sidebar
- Create subject: Click "+ Add Subject"
- Upload content:
  - Click on subject card
  - Click "📄 Summary" / "📝 Exam" / "🎥 Video"
  - Upload PDF or paste YouTube link
  - See it appear in student view immediately

---

## 🧪 Testing

### Backend API Tests
```bash
cd backend
node tests/api-diagnostic.js
```

**Tests:**
- User registration/login
- Subject CRUD
- File uploads
- Protected routes
- CORS headers
- Error handling
- Middleware validation

### Frontend Integration Tests
```javascript
// In browser console at http://localhost:5173
new FrontendTestSuite().runAll()
```

**Tests:**
- Network connectivity
- User registration
- User login
- Subject fetching
- Protected routes
- Form validation
- API response structure

---

## 📁 Project Structure

```
genbyte/
├── backend/
│   ├── server.js              # Express app entry point
│   ├── package.json
│   ├── .env                   # Environment variables
│   │
│   ├── routes/
│   │   ├── auth.js            # Register, Login
│   │   ├── subjects.js        # CRUD, uploads
│   │   └── users.js           # List users
│   │
│   ├── middleware/
│   │   ├── auth.js            # JWT verification
│   │   └── isAdmin.js         # Admin check
│   │
│   ├── models/
│   │   ├── User.js            # User schema
│   │   └── Subject.js         # Subject schema
│   │
│   ├── config/
│   │   └── cloudinary.js      # Cloudinary setup
│   │
│   └── tests/
│       └── api-diagnostic.js  # Backend tests
│
├── frontend/
│   ├── src/
│   │   ├── main.jsx           # React entry
│   │   ├── App.jsx            # Routing
│   │   ├── index.css          # Global styles
│   │   ├── api.js             # Axios client
│   │   │
│   │   ├── pages/
│   │   │   ├── Login.jsx      # Login/Register
│   │   │   ├── StudentDashboard.jsx
│   │   │   ├── AdminDashboard.jsx
│   │   │   └── Landing.jsx    # Home page
│   │   │
│   │   ├── components/
│   │   │   ├── Navbar.jsx     # Top nav
│   │   │   ├── Sidebar.jsx    # Side nav
│   │   │   └── Logo.jsx       # Brand logo
│   │   │
│   │   └── context/
│   │       └── AuthContext.jsx # Auth state
│   │
│   ├── tests/
│   │   └── frontend-test.js   # Frontend tests
│   │
│   ├── public/                # Static files
│   ├── package.json
│   ├── vite.config.js
│   └── .env.local             # Environment variables
│
├── README.md                  # This file
├── DEPLOYMENT_VERIFICATION.md # Full deployment checklist
└── .gitignore
```

---

## 🔐 API Endpoints

### Authentication (/api/auth)
```
POST   /auth/register    → Register new user
POST   /auth/login       → Login user
```

### Subjects (/api/subjects)
```
GET    /subjects              → Get all subjects (filter: ?year=Year%201)
POST   /subjects              → Create subject (admin)
DELETE /subjects/:id          → Delete subject (admin)
POST   /subjects/:id/upload   → Upload PDF summary/exam (admin)
POST   /subjects/:id/video    → Add video link (admin)
POST   /subjects/:id/image    → Upload subject image (admin)
```

### Users (/api/users)
```
GET    /users            → Get all users (admin)
```

All protected routes require: `Authorization: Bearer <token>`

---

## 🌍 Deployment

### Deploy to Vercel (Frontend)

1. **Push code to GitHub**
   ```bash
   git push origin main
   ```

2. **Import in Vercel**
   - Go to https://vercel.com
   - Click "Import Project"
   - Select your GitHub repo
   - Configure environment variable:
     ```
     VITE_API_URL=https://cozy-fulfillment-production.up.railway.app
     ```
   - Deploy

### Deploy to Railway (Backend)

1. **Push code to GitHub**
   ```bash
   git push origin main
   ```

2. **Connect to Railway**
   - Go to https://railway.app
   - Click "Create project" → "Deploy from GitHub"
   - Select your repo
   - Set environment variables:
     ```
     MONGO_URI=your-mongodb-uri
     JWT_SECRET=your-secret
     CLOUDINARY_API_KEY=key
     CLOUDINARY_API_SECRET=secret
     CLOUDINARY_NAME=name
     NODE_ENV=production
     ```
   - Auto-deploys on push

3. **Get Railway URL**
   - Find in Railway dashboard
   - Update frontend VITE_API_URL
   - Update backend CORS whitelis

### Database (MongoDB Atlas)

1. **Create cluster** at https://www.mongodb.com/cloud/atlas
2. **Create database user** with strong password
3. **Whitelist IP address** (Railway's IP)
4. **Get connection string** → use as MONGO_URI
5. **Enable backups** automatically

---

## 🎨 Customization

### Change Theme Colors
Edit `src/index.css`:
```css
:root {
  --bg: #0f1117;        /* Background */
  --text: #f1f5f9;      /* Text */
  --primary: #6366f1;   /* Primary action color */
}

[data-theme='light'] {
  --bg: #f8fafc;
  --text: #0f172a;
  --primary: #4f46e5;
}
```

### Change Brand Name/Logo
Edit `src/components/Logo.jsx` and update everywhere.

### Add New Subjects Fields
Edit `backend/models/Subject.js` and add to schema, then update all endpoints.

---

## 🐛 Troubleshooting

### Backend won't start
```
✅ Check NODE_ENV is set
✅ Verify PORT is not in use (add: sudo lsof -i :5000)
✅ Check MONGO_URI format is correct
✅ Verify .env file exists in backend/
```

### Can't login
```
✅ Check email/password in database
✅ Verify JWT_SECRET matches (backend and any other services)
✅ Check token expiration (7 days)
✅ Look at browser console for API errors
```

### Files won't upload
```
✅ Check Cloudinary API keys are correct
✅ Verify account hasn't exceeded quota
✅ Check file size under 50MB
✅ Verify CLOUDINARY_NAME is correct (not API key)
```

### API calls fail with CORS error
```
✅ Check VITE_API_URL is set correctly in .env.local
✅ Verify CORS whitelis on backend includes your domain
✅ Check Authorization header is being sent
✅ Clear browser cache and try again
```

### Can't see uploaded content
```
✅ Refresh the page (might be cached)
✅ Check Cloudinary account still has files
✅ Verify admin uploaded to correct year
✅ Check student is filtering correct year
```

---

## 📚 Documentation

### Full Deployment Guide
See [DEPLOYMENT_VERIFICATION.md](./DEPLOYMENT_VERIFICATION.md)

### API Testing
- **Backend Tests**: `node backend/tests/api-diagnostic.js`
- **Frontend Tests**: Open browser console, run test suite

### Code Comments
All critical functions have inline documentation explaining:
- What the function does
- What parameters it accepts
- What it returns
- Any important side effects

---

## 🤝 Contributing

1. **Create feature branch**
   ```bash
   git checkout -b feature/awesome-feature
   ```

2. **Make changes**
   - Follow existing code style
   - Add comments for complex logic
   - Test thoroughly

3. **Commit messages**
   ```
   git commit -m "feat: Add awesome feature"
   git commit -m "fix: Resolve login bug"
   git commit -m "style: Update button colors"
   ```

4. **Push and create pull request**
   ```bash
   git push origin feature/awesome-feature
   ```

---

## 📄 License

MIT License - Feel free to use this project for personal or commercial purposes.

---

## 👨‍💻 Support

For issues or questions:
1. Check [Troubleshooting](#-troubleshooting) section
2. Review [DEPLOYMENT_VERIFICATION.md](./DEPLOYMENT_VERIFICATION.md)
3. Check GitHub Issues
4. Contact development team

---

## 🎯 Roadmap

### Phase 2 (Upcoming)
- [ ] Real-time notifications
- [ ] Email notifications for assignments
- [ ] Advanced search and filters
- [ ] Student progress tracking
- [ ] Attendance system
- [ ] Grade management
- [ ] Timetable integration
- [ ] Mobile app (React Native)

### Phase 3 (Future)
- [ ] AI-powered study recommendations
- [ ] Peer collaboration tools
- [ ] Live class streaming integration
- [ ] Discussion forums
- [ ] Quiz system with auto-grading
- [ ] Certificate generation
- [ ] Advanced analytics dashboard

---

## ⭐ Acknowledgments

- Built with ❤️ using React, Express, and MongoDB
- UI inspired by modern glassmorphism design trends
- Hosted on Vercel and Railway

---

**GenByte v1.0** | Ready for Production ✅

Last updated: `${new Date().toISOString()}`
