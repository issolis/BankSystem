import dotenv from "dotenv";
dotenv.config();

import express from "express";
import type { Request, Response } from "express";
import { createProxyMiddleware } from "http-proxy-middleware";

const app = express();

app.use("/iam", createProxyMiddleware({
    target: process.env.IAM_URL as string,
    changeOrigin: true,
    pathRewrite: { "^/iam/": "/" },
    on: {
        error: (_err, req, res) => {
            (res as Response).status(404).json({ success: false, error: `Route ${req.method} ${(req as Request).originalUrl} not found` });
        },
        proxyRes: (proxyRes, req, res) => {
            if (proxyRes.statusCode === 404) {
                (res as Response).status(404).json({ success: false, error: `Route ${req.method} ${(req as Request).originalUrl} not found` });
            }
        }
    }
}));

app.use("/banking", createProxyMiddleware({
    target: process.env.BANKING_URL as string,
    changeOrigin: true,
    pathRewrite: { "^/banking/": "/" },
    on: {
        error: (_err, req, res) => {
            (res as Response).status(404).json({ success: false, error: `Route ${req.method} ${(req as Request).originalUrl} not found` });
        },
        proxyRes: (proxyRes, req, res) => {
            if (proxyRes.statusCode === 404) {
                (res as Response).status(404).json({ success: false, error: `Route ${req.method} ${(req as Request).originalUrl} not found` });
            }
        }
    }
}));

app.use("/vip", createProxyMiddleware({
    target: process.env.VIP_URL as string,
    changeOrigin: true,
    pathRewrite: { "^/vip/": "/" },
    on: {
        error: (_err, req, res) => {
            (res as Response).status(404).json({ success: false, error: `Route ${req.method} ${(req as Request).originalUrl} not found` });
        },
        proxyRes: (proxyRes, req, res) => {
            if (proxyRes.statusCode === 404) {
                (res as Response).status(404).json({ success: false, error: `Route ${req.method} ${(req as Request).originalUrl} not found` });
            }
        }
    }
}));

app.use((req: Request, res: Response) => {
    res.status(404).json({ success: false, error: `Route ${req.method} ${req.originalUrl} not found` });
});

export default app;