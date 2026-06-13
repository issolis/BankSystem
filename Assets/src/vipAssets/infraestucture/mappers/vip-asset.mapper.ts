import { Decimal } from "decimal.js";
import { VIPAsset } from "../../domain/entities/vip-asset.entity.js";
import { AssetId } from "../../domain/value-objects/asset-id.vo.js";
import { AssetName } from "../../domain/value-objects/asset-name.vo.js";
import { AssetValue } from "../../domain/value-objects/asset-value.vo.js";
import type { VIPAssetModel } from "../models/vip-asset.model.js";

export class VIPAssetMapper {
    static toDomain(model: VIPAssetModel): VIPAsset {
        return VIPAsset.fromPersistence(
            new AssetId(model.uuid),
            new AssetName(model.name),
            AssetValue.from(model.value)
        );
    }

    static toPersistence(vipAsset: VIPAsset): VIPAssetModel {
        return {
            uuid: vipAsset.getAssetId().getValue(),
            name: vipAsset.getAssetName().getValue(),
            value: vipAsset.getAssetValue().getValue().toString()
        };
    }
}