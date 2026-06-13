import { AppError } from "../../../shared/errors/app.error.js";
import type { VIPAssetRepository } from "../../domain/repositories/vip-asset.repository.js";
import { AssetId } from "../../domain/value-objects/asset-id.vo.js";
import type { VIPAsset } from "../../domain/entities/vip-asset.entity.js";

export class FindVIPAssetByIdUseCase {
    constructor(
        private readonly vipAssetRepository: VIPAssetRepository
    ) {}

    async execute(uuid: string): Promise<VIPAsset> {
        const assetId = new AssetId(uuid);
        const vipAsset = await this.vipAssetRepository.findById(assetId);

        if (!vipAsset) {
            throw new AppError(`VIP asset with id ${uuid} not found`, 404);
        }

        return vipAsset;
    }
}