import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import axios from "axios";
import fs from "fs";
import { fileURLToPath } from "url";

import registerRoute from "./routes/user.routes.js";
import resumeRoute from "./routes/resume.routes.js";
import landingRoute from "./routes/landing.routes.js";

import { verifyJWT } from "./middlewares/auth.middlewares.js";
import setUser from "./middlewares/setUser.middlewares.js";
import session from "express-session";
import flash from "connect-flash";
import passport from "passport";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// common config
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  }),
);

app.use(
  session({
    secret: "keyboard cat", // any random string
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60, // 1 hour
    },
  }),
);

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  res.locals.currentPath = req.path;
  next();
});

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());
app.use(flash());

//For Layouts
import engine from "ejs-mate";
import { set } from "mongoose";
// const engine = require("ejs-mate");
app.engine("ejs", engine);

//Setting up Path
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
// app.use(express.static(path.join(__dirname, "public")));

app.use(setUser);

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

app.get("/", (req, res) => {
  res.redirect("/home");
});  

app.use("/", landingRoute);
app.use("/users", registerRoute);
app.use("/resume", resumeRoute);
app.use((req, res) => {
  res.status(404).render("error", {message: "Page not found!"});
})

export default app;
