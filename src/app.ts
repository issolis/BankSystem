import express from "express";
import { userRouter } from "./user/presentation/user.routes.js";

const app = express();



app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));


app.get('/', (req, res) => {
  res.send('IAM Service running');
});

app.use("/users", userRouter);

export default app;