import type { Request, Response } from "express";
import { AppError } from "../../shared/errors/app.error.js";
import { FindVIPAssetByIdUseCase } from "../application/use-cases/find-vip-asset-by-id.js";
import { FindAllVIPAssetsUseCase } from "../application/use-cases/find-all-vip-assets.js";
import { CreateVIPAssetUseCase } from "../application/use-cases/create-vip-asset.js";

export class VIPAssetController {
    constructor(
        private readonly findVIPAssetByIdUseCase: FindVIPAssetByIdUseCase,
        private readonly findAllVIPAssetsUseCase: FindAllVIPAssetsUseCase,
        private readonly createVIPAssetUseCase: CreateVIPAssetUseCase
    ) {
        this.findById = this.findById.bind(this);
        this.findAll = this.findAll.bind(this);
        this.create = this.create.bind(this);
    }

    async findById(req: Request, res: Response): Promise<void> {
        try {
            const vipAsset = await this.findVIPAssetByIdUseCase.execute(req.params.id as string);

            res.status(200).json({
                success: true,
                data: {
                    id: vipAsset.getAssetId().getValue(),
                    name: vipAsset.getAssetName().getValue(),
                    value: vipAsset.getAssetValue().getValue().toString()
                }
            });
        } catch (error) {
            if (error instanceof AppError) {
                res.status(error.status).json({ success: false, error: error.message });
            } if (error instanceof Error) {
                res.status(500).json({ success: false, error: error.message });
            }
        }
    }

    async findAll(req: Request, res: Response): Promise<void> {
        try {
            const vipAssets = await this.findAllVIPAssetsUseCase.execute();

            res.status(200).json({
                success: true,
                data: vipAssets.map(vipAsset => ({
                    id: vipAsset.getAssetId().getValue(),
                    name: vipAsset.getAssetName().getValue(),
                    value: vipAsset.getAssetValue().getValue().toString()
                }))
            });
        } catch (error) {
            if (error instanceof AppError) {
                res.status(error.status).json({ success: false, error: error.message });
            } if (error instanceof Error) {
                res.status(500).json({ success: false, error: error.message });
            }
        }
    }

    async create(req: Request, res: Response): Promise<void> {
        try {
            const vipAsset = await this.createVIPAssetUseCase.execute(
                req.body.name,
                req.body.value
            );

            res.status(201).json({
                success: true,
                data: {
                    id: vipAsset.getAssetId().getValue(),
                    name: vipAsset.getAssetName().getValue(),
                    value: vipAsset.getAssetValue().getValue().toString()
                }
            });
        } catch (error) {
            if (error instanceof AppError) {
                res.status(error.status).json({ success: false, error: error.message });
            } if (error instanceof Error) {
                res.status(500).json({ success: false, error: error.message });
            }
        }
    }
}