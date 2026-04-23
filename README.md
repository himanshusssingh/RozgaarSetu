# RozgaarSetu

RozgaarSetu is a Node.js job-matching web application that helps users create resumes, manage skills, and view recommended companies based on their profile.

## Features

- User registration, login, and authentication
- Resume creation and editing with skill matching
- Company recommendations based on user skills
- Demanding skills and job market insights
- PDF resume generation and download
- Cloudinary image upload support for profile or resume assets
- Email notifications using Nodemailer and Mailgen

## Technology Stack

- Node.js
- Express
- EJS templates
- MongoDB with Mongoose
- Passport.js authentication
- Cloudinary media uploads
- JWT-based token management

## Getting Started

### Prerequisites

- Node.js 18+ installed
- MongoDB database (local or hosted)
- Cloudinary account for file uploads

### Install dependencies

```bash
npm install
```

### Environment Variables

Create a `.env` file at the project root with the following values:

```env
PORT=3000
CORS_ORIGIN=http://localhost:3000
MONGODB_URI=mongodb://localhost:27017/rozgaarsetu

ACCESS_TOKEN_SECRET=your_access_token_secret
ACCESS_TOKEN_EXPIRY=15m
REFRESH_TOKEN_SECRET=your_refresh_token_secret
REFRESH_TOKEN_EXPIRY=7d

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```


### Run the app

```bash
npm run dev
```

Then open `http://localhost:3000` in your browser.

## Project Structure

- `src/index.js` - app entry point
- `src/app.js` - express app setup
- `src/routes/` - route definitions
- `src/controllers/` - controller logic
- `src/models/` - Mongoose models
- `src/middlewares/` - authentication and file upload middleware
- `src/utils/` - helper utilities
- `src/views/` - EJS views and layouts
- `public/` - static assets (CSS, JS, images)

## Scripts

- `npm run dev` - start development server with nodemon
- `npm start` - start server with Node.js

## Notes

- Ensure MongoDB is running before starting the app.
- Configure Cloudinary correctly to enable image upload features.

## License

This project is released under the ISC License.

## Author
[Himanshu Singh](https://github.com/himanshusssingh.io)