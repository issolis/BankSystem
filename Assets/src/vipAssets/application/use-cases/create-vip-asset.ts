import { AppError } from "../../../shared/errors/app.error.js";
import type { VIPAssetRepository } from "../../domain/repositories/vip-asset.repository.js";
import { VIPAsset } from "../../domain/entities/vip-asset.entity.js";
import { AssetName } from "../../domain/value-objects/asset-name.vo.js";
import { AssetValue } from "../../domain/value-objects/asset-value.vo.js";
import type { VIPAsset as VIPAssetType } from "../../domain/entities/vip-asset.entity.js";

export class CreateVIPAssetUseCase {
    constructor(
        private readonly vipAssetRepository: VIPAssetRepository
    ) {}

    async execute(name: string, value: number): Promise<VIPAssetType> {
        const assetName = new AssetName(name);
        const assetValue = AssetValue.from(value);
        const vipAsset = VIPAsset.create(assetName, assetValue);

        return await this.vipAssetRepository.create(vipAsset);
    }
}