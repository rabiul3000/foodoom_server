import { config } from "dotenv";
config();

const serviceAccountKey = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);

export default serviceAccountKey;
