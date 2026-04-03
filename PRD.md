# Product Requirements Document (PRD)

## RozgaarSetu - Skills Based Job Application Portal

### 1. Product Overview

**Product Name:** RozgaarSetu  
**Version:** 1.0.0  
**Product Type:** Full Stack Web Application

In the modern era of digitalization, the recruitment process has become
highly competitive and complex. 
Most organizations still depend on manual resume screening, which is
time-consuming, inefficient, and biased. Recruiters receive thousands of
applications for a single job opening, many of which do not match the
required skills or qualifications. 
From a job seeker’s perspective, candidates often apply blindly without
knowing their eligibility, leading to low success rates and loss of
confidence. 
Therefore, there is a strong need for a Skill-Based Job Application Portal
that ensures fair, transparent, and automated recruitment based on skills
and qualifications. 

### 2. Target Users

- **Job Seekers:** Browse and apply for jobs based on their skills and qualifications
- **Recruiters:** Post job openings, screen candidates, and manage the recruitment process
- **Admin Users:** Manage the overall system, including user accounts and system settings

### 3. Core Features

#### 3.1 User Authentication & Authorization

- **User Registration:** Account creation with email verification
- **User Login:** Secure authentication with JWT tokens
- **Password Management:** Change password, forgot/reset password functionality
<!-- - **Email Verification:** Account verification via email tokens -->
- **Token Management:** Access token refresh mechanism
<!-- - **Role-Based Access Control:** Three-tier permission system (Admin, Project Admin, Member) -->

#### 3.2 Profile Management

- **Profile Creation:** Create user profiles with personal information
- **Profile Details:** Access your profile information
- **Profile Updates:** Modify your profile information

#### 3.3 Resume Management

- **Resume Creation:** Allow users to create their resumes
- **Resume Viewing:** View resumes
- **Resume Updates:** Modify resume information
- **Resume Download:** Download uploaded resumes (PDF format)

#### 3.4 Applying for Jobs

- **Job Listing:** View available job openings
<!-- - **Job Details:** Access individual job information -->
- **Job Application:** Submit application for selected jobs

#### 3.5 Demanding Skills

- **Demanding Skills:** View the list of skills in demand for various job roles

#### 3.7 Upload profile picture

- **Upload Profile Picture:** API endpoint for uploading user profile pictures

### 4. Technical Specifications

#### 4.1 API Endpoints Structure

**Web Pages Routes** (`/`)

- `GET /home` - Landing page (before login) & Home page (after login)
- `GET /resume` - Resume page (secured)
- `GET /company` - Company page (secured)
- `GET /skills` - Demanding Skills page (public)
- `GET /allCompany` - All Companies page (public)

**Authentication Routes** (`/users/`)

- `GET /register` - User registration web page
- `POST /register` - User registration
- `GET /login` - User login web page
- `POST /login` - User authentication
- `GET /logout` - User logout (secured)
- `POST /getCurrentUser` - Get current user info (secured)
- `POST /updatePassword` - Change user password (secured)
- `POST /updateDetails` - Update user details (secured)
<!-- - `POST /refresh-token` - Refresh access token    -->
<!-- - `GET /verify-email/:verificationToken` - Email verification -->

**Resume Routes** (`/resume/`)

- `GET /createResume` - Resume creation web page
- `POST /createResume` - Create resume (secured)
- `GET /editResume` - Resume editing web page (secured)
- `POST /editResume` - Update resume (secured)
- `GET /downloadResume` - Download resume (secured)

<!-- #### 4.2 Permission Matrix

| Feature                    | Admin | Project Admin | Member |
| -------------------------- | ----- | ------------- | ------ |
| Create Project             | ✓     | ✗             | ✗      |
| Update/Delete Project      | ✓     | ✗             | ✗      |
| Manage Project Members     | ✓     | ✗             | ✗      |
| Create/Update/Delete Tasks | ✓     | ✓             | ✗      |
| View Tasks                 | ✓     | ✓             | ✓      |
| Update Subtask Status      | ✓     | ✓             | ✓      |
| Create/Delete Subtasks     | ✓     | ✓             | ✗      |
| Create/Update/Delete Notes | ✓     | ✗             | ✗      |
| View Notes                 | ✓     | ✓             | ✓      |

#### 4.3 Data Models

**User Roles:**

- `admin` - Full system access
- `project_admin` - Project-level administrative access
- `member` - Basic project member access -->

### 5. Security Features

- JWT-based authentication with refresh tokens
<!-- - Role-based authorization middleware -->
- Input validation on all endpoints
<!-- - Email verification for account security -->
- Secure password reset functionality
- Profile upload security with Multer middleware
- CORS configuration for cross-origin requests

### 6. Resume Management

- Resume creation and editing with structured data (personal info, education, experience, skills)
- Resume download in PDF format
- File upload handling for profile pictures
- Resume data storage and retrieval from the database
- Resume data validation and error handling

### 7. Success Criteria

- Secure user authentication and authorization system
- Complete hiring lifecycle process implementation
- Robust resume management features
<!-- - Role-based access control implementation -->
- Effective input validation and error handling
<!-- - Email notification system for user verification and password reset -->
- Comprehensive API documentation through endpoint structure
