import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import multer from "multer";
import { fileURLToPath } from "url";
import authRoutes from "./routes/auth.js"
import userroutes from "./routes/users.js"
import { register } from "./controllers/auth.js";
// const crypto = require('crypto')
import crypto from "crypto"


/* CONFIGURATIONS */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
app.use("/assets", express.static(path.join(__dirname, "public/assets")));


const key = crypto.randomBytes(32).toString('hex')
// console.log("keu", key);
/* FILE STORAGE */
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/assets");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });


/* ROUTES WITH FILES */
app.post("/auth/register",  register);

// ROUTES
app.use("/auth", authRoutes)
app.use("/users", userroutes)

/* MONGOOSE SETUP */
const PORT = process.env.PORT || 6001;
console.log("PORT", PORT);
mongoose.set('strictQuery', false);
console.log("URL", process.env.MONGO_URL);
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT, () => console.log(`Server Port: ${PORT}`));

    /* ADD DATA ONE TIME */
    User.insertMany(users);
    Post.insertMany(posts);
  })
  .catch((error) => console.log(`${error} did not connect`));
