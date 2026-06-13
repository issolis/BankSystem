import type { VIPAssetRepository } from "../../domain/repositories/vip-asset.repository.js";
import type { VIPAsset } from "../../domain/entities/vip-asset.entity.js";

export class FindAllVIPAssetsUseCase {
    constructor(
        private readonly vipAssetRepository: VIPAssetRepository
    ) {}

    async execute(): Promise<VIPAsset[]> {
        return await this.vipAssetRepository.findAll();
    }
}