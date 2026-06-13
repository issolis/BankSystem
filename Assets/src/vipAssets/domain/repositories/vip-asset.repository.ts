import type { VIPAsset } from "../entities/vip-asset.entity.js";
import type { AssetId } from "../value-objects/asset-id.vo.js";

export interface VIPAssetRepository {
    findById(assetId: AssetId): Promise<VIPAsset | null>;
    findAll(): Promise<VIPAsset[]>;
    create(vipAsset: VIPAsset): Promise<VIPAsset>;
}