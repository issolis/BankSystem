import express from "express";
import { vipAssetRouter } from "./vipAssets/presentation/vip-asset.routes.js";

const app = express();

app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

app.get('/', (req, res) => {
    res.send('VIPAssets Service running');
});

app.use("/vip-assets", vipAssetRouter);

export default app;