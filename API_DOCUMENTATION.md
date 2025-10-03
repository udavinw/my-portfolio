# Portfolio Backend API Documentation

## Base URL
```
http://localhost:5000
```

## Authentication
All protected routes require a JWT token in the request header:
```
x-auth-token: <your_jwt_token>
```

---

## 🔐 Authentication APIs

### Register User
**POST** `/auth/register`

Creates a new user account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "msg": "User registered successfully"
}
```

**Error Response:**
```json
{
  "msg": "User already exists"
}
```

---

### Login User
**POST** `/auth/login`

Authenticates a user and returns a JWT token.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

**Error Response:**
```json
{
  "msg": "User not found"
}
```

---

### Update Profile
**PUT** `/auth/update`

Updates user profile information. Requires authentication.

**Headers:**
```
x-auth-token: <jwt_token>
```

**Request Body:**
```json
{
  "name": "John Smith",
  "email": "johnsmith@example.com",
  "password": "newpassword123"
}
```

**Response:**
```json
{
  "msg": "Profile updated successfully",
  "user": {
    "id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "name": "John Smith",
    "email": "johnsmith@example.com"
  }
}
```

---

### Verify Token
**GET** `/auth/verify`

Verifies if the provided JWT token is valid.

**Headers:**
```
x-auth-token: <jwt_token>
```

**Response:**
```json
true
```

**Error Response:**
```json
false
```

---

## 🚀 Projects APIs

### Create Project
**POST** `/projects`

Creates a new project. Requires authentication.

**Headers:**
```
x-auth-token: <jwt_token>
Content-Type: multipart/form-data
```

**Request Body (Form Data):**
```
title: "E-commerce Website"
description: "A full-stack e-commerce application with React and Node.js"
tech: "React,Node.js,MongoDB,Express"
github: "https://github.com/username/ecommerce"
live: "https://ecommerce-demo.com"
image: <file_upload>
```

**Response:**
```json
{
  "msg": "Project created successfully",
  "project": {
    "projectId": "proj_abc123",
    "title": "E-commerce Website",
    "description": "A full-stack e-commerce application with React and Node.js",
    "tech": ["React", "Node.js", "MongoDB", "Express"],
    "github": "https://github.com/username/ecommerce",
    "live": "https://ecommerce-demo.com",
    "imageUrl": "https://supabase-storage.com/project-image.jpg",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

---

### Get All Projects
**GET** `/projects`

Retrieves all projects (public endpoint).

**Response:**
```json
[
  {
    "projectId": "proj_abc123",
    "title": "E-commerce Website",
    "description": "A full-stack e-commerce application with React and Node.js",
    "tech": ["React", "Node.js", "MongoDB", "Express"],
    "github": "https://github.com/username/ecommerce",
    "live": "https://ecommerce-demo.com",
    "imageUrl": "https://supabase-storage.com/project-image.jpg",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  },
  {
    "projectId": "proj_def456",
    "title": "Task Management App",
    "description": "A collaborative task management application",
    "tech": ["Vue.js", "Firebase", "Tailwind CSS"],
    "github": "https://github.com/username/taskapp",
    "live": "https://taskapp-demo.com",
    "imageUrl": "https://supabase-storage.com/taskapp-image.jpg",
    "createdAt": "2024-01-10T14:20:00.000Z",
    "updatedAt": "2024-01-10T14:20:00.000Z"
  }
]
```

---

### Get Single Project
**GET** `/projects/:projectId`

Retrieves a specific project by ID.

**Response:**
```json
{
  "projectId": "proj_abc123",
  "title": "E-commerce Website",
  "description": "A full-stack e-commerce application with React and Node.js",
  "tech": ["React", "Node.js", "MongoDB", "Express"],
  "github": "https://github.com/username/ecommerce",
  "live": "https://ecommerce-demo.com",
  "imageUrl": "https://supabase-storage.com/project-image.jpg",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

**Error Response:**
```json
{
  "msg": "Project not found"
}
```

---

### Update Project
**PUT** `/projects/:projectId`

Updates an existing project. Requires authentication.

**Headers:**
```
x-auth-token: <jwt_token>
Content-Type: multipart/form-data
```

**Request Body (Form Data):**
```
title: "Updated E-commerce Website"
description: "An enhanced full-stack e-commerce application"
tech: "React,Node.js,MongoDB,Express,Stripe"
github: "https://github.com/username/ecommerce-v2"
live: "https://ecommerce-v2-demo.com"
image: <file_upload>
```

**Response:**
```json
{
  "msg": "Project updated successfully",
  "project": {
    "projectId": "proj_abc123",
    "title": "Updated E-commerce Website",
    "description": "An enhanced full-stack e-commerce application",
    "tech": ["React", "Node.js", "MongoDB", "Express", "Stripe"],
    "github": "https://github.com/username/ecommerce-v2",
    "live": "https://ecommerce-v2-demo.com",
    "imageUrl": "https://supabase-storage.com/updated-project-image.jpg",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T15:45:00.000Z"
  }
}
```

---

### Delete Project
**DELETE** `/projects/:projectId`

Deletes a project. Requires authentication.

**Headers:**
```
x-auth-token: <jwt_token>
```

**Response:**
```json
{
  "msg": "Project deleted successfully"
}
```

**Error Response:**
```json
{
  "msg": "Project not found"
}
```

---

## 💼 Experience APIs

### Create Experience
**POST** `/experience`

Creates a new work experience entry. Requires authentication.

**Headers:**
```
x-auth-token: <jwt_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "company": "Tech Corp",
  "role": "Senior Software Engineer",
  "duration": "2022 - Present",
  "description": "Led development of microservices architecture and mentored junior developers"
}
```

**Response:**
```json
{
  "msg": "Experience added successfully",
  "experience": {
    "experienceId": "exp_xyz789",
    "company": "Tech Corp",
    "role": "Senior Software Engineer",
    "duration": "2022 - Present",
    "description": "Led development of microservices architecture and mentored junior developers",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

---

### Get All Experiences
**GET** `/experience`

Retrieves all work experiences (public endpoint).

**Response:**
```json
[
  {
    "experienceId": "exp_xyz789",
    "company": "Tech Corp",
    "role": "Senior Software Engineer",
    "duration": "2022 - Present",
    "description": "Led development of microservices architecture and mentored junior developers",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  },
  {
    "experienceId": "exp_abc123",
    "company": "StartupXYZ",
    "role": "Full Stack Developer",
    "duration": "2020 - 2022",
    "description": "Developed web applications using React and Node.js",
    "createdAt": "2024-01-10T14:20:00.000Z",
    "updatedAt": "2024-01-10T14:20:00.000Z"
  }
]
```

---

### Get Single Experience
**GET** `/experience/:experienceId`

Retrieves a specific experience by ID.

**Response:**
```json
{
  "experienceId": "exp_xyz789",
  "company": "Tech Corp",
  "role": "Senior Software Engineer",
  "duration": "2022 - Present",
  "description": "Led development of microservices architecture and mentored junior developers",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

---

### Update Experience
**PUT** `/experience/:experienceId`

Updates an existing experience. Requires authentication.

**Headers:**
```
x-auth-token: <jwt_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "company": "Tech Corp Inc",
  "role": "Lead Software Engineer",
  "duration": "2022 - Present",
  "description": "Led development of microservices architecture, mentored junior developers, and implemented CI/CD pipelines"
}
```

**Response:**
```json
{
  "msg": "Experience updated successfully",
  "experience": {
    "experienceId": "exp_xyz789",
    "company": "Tech Corp Inc",
    "role": "Lead Software Engineer",
    "duration": "2022 - Present",
    "description": "Led development of microservices architecture, mentored junior developers, and implemented CI/CD pipelines",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T16:20:00.000Z"
  }
}
```

---

### Delete Experience
**DELETE** `/experience/:experienceId`

Deletes an experience. Requires authentication.

**Headers:**
```
x-auth-token: <jwt_token>
```

**Response:**
```json
{
  "msg": "Experience deleted successfully"
}
```

---

## 🎓 Education APIs

### Create Education
**POST** `/education`

Creates a new education entry. Requires authentication.

**Headers:**
```
x-auth-token: <jwt_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "institution": "University of Technology",
  "degree": "Bachelor of Computer Science",
  "duration": "2018 - 2022",
  "achievements": ["Dean's List", "Summa Cum Laude", "President of CS Club"]
}
```

**Response:**
```json
{
  "msg": "Education added successfully",
  "education": {
    "educationId": "edu_def456",
    "institution": "University of Technology",
    "degree": "Bachelor of Computer Science",
    "duration": "2018 - 2022",
    "achievements": ["Dean's List", "Summa Cum Laude", "President of CS Club"],
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

---

### Get All Educations
**GET** `/education`

Retrieves all education entries (public endpoint).

**Response:**
```json
[
  {
    "educationId": "edu_def456",
    "institution": "University of Technology",
    "degree": "Bachelor of Computer Science",
    "duration": "2018 - 2022",
    "achievements": ["Dean's List", "Summa Cum Laude", "President of CS Club"],
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  },
  {
    "educationId": "edu_ghi789",
    "institution": "Tech Bootcamp",
    "degree": "Full Stack Development Certificate",
    "duration": "2020",
    "achievements": ["Top 10% of cohort", "Final project award"],
    "createdAt": "2024-01-10T14:20:00.000Z",
    "updatedAt": "2024-01-10T14:20:00.000Z"
  }
]
```

---

### Get Single Education
**GET** `/education/:educationId`

Retrieves a specific education entry by ID.

**Response:**
```json
{
  "educationId": "edu_def456",
  "institution": "University of Technology",
  "degree": "Bachelor of Computer Science",
  "duration": "2018 - 2022",
  "achievements": ["Dean's List", "Summa Cum Laude", "President of CS Club"],
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

---

### Update Education
**PUT** `/education/:educationId`

Updates an existing education entry. Requires authentication.

**Headers:**
```
x-auth-token: <jwt_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "institution": "University of Technology",
  "degree": "Bachelor of Computer Science with Honors",
  "duration": "2018 - 2022",
  "achievements": ["Dean's List", "Summa Cum Laude", "President of CS Club", "Research Assistant"]
}
```

**Response:**
```json
{
  "msg": "Education updated successfully",
  "education": {
    "educationId": "edu_def456",
    "institution": "University of Technology",
    "degree": "Bachelor of Computer Science with Honors",
    "duration": "2018 - 2022",
    "achievements": ["Dean's List", "Summa Cum Laude", "President of CS Club", "Research Assistant"],
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T16:20:00.000Z"
  }
}
```

---

### Delete Education
**DELETE** `/education/:educationId`

Deletes an education entry. Requires authentication.

**Headers:**
```
x-auth-token: <jwt_token>
```

**Response:**
```json
{
  "msg": "Education deleted successfully"
}
```

---

## 💬 Testimonials APIs

### Create Testimonial
**POST** `/testimonials`

Creates a new testimonial. Requires authentication.

**Headers:**
```
x-auth-token: <jwt_token>
Content-Type: multipart/form-data
```

**Request Body (Form Data):**
```
name: "Sarah Johnson"
company: "Tech Solutions Inc"
role: "Project Manager"
feedback: "Outstanding work! The project was delivered on time and exceeded our expectations."
avatar: <file_upload>
```

**Response:**
```json
{
  "msg": "Testimonial added successfully",
  "testimonial": {
    "testimonialId": "test_jkl012",
    "name": "Sarah Johnson",
    "company": "Tech Solutions Inc",
    "role": "Project Manager",
    "feedback": "Outstanding work! The project was delivered on time and exceeded our expectations.",
    "avatarUrl": "https://supabase-storage.com/avatar-sarah.jpg",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

---

### Get All Testimonials
**GET** `/testimonials`

Retrieves all testimonials (public endpoint).

**Response:**
```json
[
  {
    "testimonialId": "test_jkl012",
    "name": "Sarah Johnson",
    "company": "Tech Solutions Inc",
    "role": "Project Manager",
    "feedback": "Outstanding work! The project was delivered on time and exceeded our expectations.",
    "avatarUrl": "https://supabase-storage.com/avatar-sarah.jpg",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  },
  {
    "testimonialId": "test_mno345",
    "name": "Michael Chen",
    "company": "StartupXYZ",
    "role": "CTO",
    "feedback": "Excellent technical skills and great communication. Highly recommended!",
    "avatarUrl": "https://supabase-storage.com/avatar-michael.jpg",
    "createdAt": "2024-01-10T14:20:00.000Z",
    "updatedAt": "2024-01-10T14:20:00.000Z"
  }
]
```

---

### Get Single Testimonial
**GET** `/testimonials/:testimonialId`

Retrieves a specific testimonial by ID.

**Response:**
```json
{
  "testimonialId": "test_jkl012",
  "name": "Sarah Johnson",
  "company": "Tech Solutions Inc",
  "role": "Project Manager",
  "feedback": "Outstanding work! The project was delivered on time and exceeded our expectations.",
  "avatarUrl": "https://supabase-storage.com/avatar-sarah.jpg",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

---

### Update Testimonial
**PUT** `/testimonials/:testimonialId`

Updates an existing testimonial. Requires authentication.

**Headers:**
```
x-auth-token: <jwt_token>
Content-Type: multipart/form-data
```

**Request Body (Form Data):**
```
name: "Sarah Johnson"
company: "Tech Solutions Inc"
role: "Senior Project Manager"
feedback: "Outstanding work! The project was delivered on time, exceeded our expectations, and the team was a pleasure to work with."
avatar: <file_upload>
```

**Response:**
```json
{
  "msg": "Testimonial updated successfully",
  "testimonial": {
    "testimonialId": "test_jkl012",
    "name": "Sarah Johnson",
    "company": "Tech Solutions Inc",
    "role": "Senior Project Manager",
    "feedback": "Outstanding work! The project was delivered on time, exceeded our expectations, and the team was a pleasure to work with.",
    "avatarUrl": "https://supabase-storage.com/updated-avatar-sarah.jpg",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T16:20:00.000Z"
  }
}
```

---

### Delete Testimonial
**DELETE** `/testimonials/:testimonialId`

Deletes a testimonial. Requires authentication.

**Headers:**
```
x-auth-token: <jwt_token>
```

**Response:**
```json
{
  "msg": "Testimonial deleted successfully"
}
```

---

## 🔧 Error Responses

### Common Error Responses

**400 Bad Request:**
```json
{
  "msg": "User already exists"
}
```

**401 Unauthorized:**
```json
{
  "msg": "No token, access denied"
}
```

**404 Not Found:**
```json
{
  "msg": "Project not found"
}
```

**500 Internal Server Error:**
```json
{
  "error": "Database connection failed"
}
```

---

## 📝 Data Models

### User Model
```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (required),
  createdAt: Date,
  updatedAt: Date
}
```

### Project Model
```javascript
{
  projectId: String (required, unique),
  title: String (required),
  description: String,
  tech: [String],
  github: String,
  live: String,
  imageUrl: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Experience Model
```javascript
{
  experienceId: String (required, unique),
  company: String (required),
  role: String (required),
  duration: String,
  description: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Education Model
```javascript
{
  educationId: String (required, unique),
  institution: String (required),
  degree: String (required),
  duration: String,
  achievements: [String],
  createdAt: Date,
  updatedAt: Date
}
```

### Testimonial Model
```javascript
{
  testimonialId: String (required, unique),
  name: String (required),
  company: String (required),
  role: String (required),
  feedback: String (required),
  avatarUrl: String,
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🚀 Getting Started

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Environment Variables:**
   Create a `.env` file with:
   ```
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   SUPABASE_URL=your_supabase_url
   SUPABASE_KEY=your_supabase_key
   SUPABASE_BUCKET=your_supabase_bucket_name
   PORT=5000
   ```

3. **Start the Server:**
   ```bash
   npm start
   ```

4. **Test the API:**
   Use tools like Postman, Insomnia, or curl to test the endpoints.

---

## 📋 Authentication Flow

1. **Register:** `POST /auth/register`
2. **Login:** `POST /auth/login` (receive JWT token)
3. **Use Token:** Include `x-auth-token` header in protected routes
4. **Verify:** `GET /auth/verify` to check token validity

---

## 🔒 Protected Routes

All routes except the following require authentication:
- `POST /auth/register`
- `POST /auth/login`
- `GET /auth/verify`
- `GET /projects`
- `GET /projects/:projectId`
- `GET /experience`
- `GET /experience/:experienceId`
- `GET /education`
- `GET /education/:educationId`
- `GET /testimonials`
- `GET /testimonials/:testimonialId`

---

## 📁 File Uploads

The API supports file uploads for:
- **Projects:** Image uploads via `image` field
- **Testimonials:** Avatar uploads via `avatar` field

Files are stored in Supabase Storage and public URLs are returned.

---
