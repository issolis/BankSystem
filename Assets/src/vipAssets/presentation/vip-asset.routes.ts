import { Router } from "express";
import { VIPAssetController } from "./vip-asset.controller.js";
import { VIPAssetValidator } from "./vip-asset.validator.js";
import { VIPAssetRepositoryImpl } from "../infraestucture/repositories/vip-asset.repository.js";
import { FindVIPAssetByIdUseCase } from "../application/use-cases/find-vip-asset-by-id.js";
import { FindAllVIPAssetsUseCase } from "../application/use-cases/find-all-vip-assets.js";
import { CreateVIPAssetUseCase } from "../application/use-cases/create-vip-asset.js";
import { authenticate } from "../../shared/middlewares/authenticate.middleware.js";
import { requirePlatinum } from "../../shared/middlewares/require-platinum.middleware.js";
import { requireAdmin } from "../../shared/middlewares/require-admin.middleware.js";


const vipAssetRepository = new VIPAssetRepositoryImpl();
const findVIPAssetByIdUseCase = new FindVIPAssetByIdUseCase(vipAssetRepository);
const findAllVIPAssetsUseCase = new FindAllVIPAssetsUseCase(vipAssetRepository);
const createVIPAssetUseCase = new CreateVIPAssetUseCase(vipAssetRepository);

const vipAssetController = new VIPAssetController(
    findVIPAssetByIdUseCase,
    findAllVIPAssetsUseCase,
    createVIPAssetUseCase
);

export const vipAssetRouter = Router();

vipAssetRouter.use(authenticate);

vipAssetRouter.get("/", requirePlatinum, vipAssetController.findAll);
vipAssetRouter.get("/:id", requirePlatinum, VIPAssetValidator.validateFindById, vipAssetController.findById);
vipAssetRouter.post("/", requireAdmin, VIPAssetValidator.validateCreate, vipAssetController.create);