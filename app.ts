require("dotenv").config();
import express, { RequestHandler } from "express";
import cookieParser from "cookie-parser";

import mongoose from "mongoose";
import User from "./models/User";
import authRoutes from "./routes/authRoutes";
import { requireAuth, checkUser } from "./middleware/authMiddleware";
const app = express();
// middleware
app.use(express.static("public"));
app.use(express.json());
app.use(cookieParser());
// view enginea
app.set("view engine", "ejs");

// database connection

mongoose
  .connect(process.env.dbURI as string)
  .then(() => console.log("DB Connected"))
  .then((result) =>
    app.listen(3000, () => {
      console.log(`Server listening on port 3000`);
    })
  )
  .catch((err) => console.log(err));

// routes
//Read All Users
/* let newArr = [];
User.find({}, (err, user) => {
  newArr = user;
});
console.log(newArr); */

app.get("*", checkUser);
app.get("/", (req, res) => res.render("home"));
app.get(
  "/dashboard",
  requireAuth,
  async (req: express.Request, res: express.Response) => {
    try {
      const user = await User.find({});
      res.render("dashboard", { user });
    } catch (error) {
      console.log(error);
    }
  }
);
app.use(authRoutes);
