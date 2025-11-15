import express from "express";
import { config } from "dotenv";
import mongodbConnect from "./db/mogodbConnect.js";
import bodyParser from "body-parser";
import router from "./routes/routes.js";
import cors from "cors";
import morgan from 'morgan'

config();

const app = express();
app.use(cors({origin: ["http://localhost:5173", "https://foodoom-cba04.firebaseapp.com"]}));
app.use(morgan("dev"))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(router);
mongodbConnect();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`server is running on http://localhost:${PORT}`);
});
