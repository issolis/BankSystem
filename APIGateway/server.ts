import dotenv from "dotenv";
import app from "./src/api.gateway.js";

dotenv.config();

const PORT = process.env.PORT ?? 3003;

app.listen(PORT, () => {
    console.log(`[SERVER] Running on port ${PORT}`);
});