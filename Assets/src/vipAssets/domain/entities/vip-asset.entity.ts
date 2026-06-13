import { AssetId } from "../value-objects/asset-id.vo.js";
import { AssetName } from "../value-objects/asset-name.vo.js";
import { AssetValue } from "../value-objects/asset-value.vo.js";




export class VIPAsset{
    constructor(
        private readonly assetId : AssetId, 
        private readonly assetName : AssetName, 
        private readonly assetValue: AssetValue
    ){}


    static create(
        assetName : AssetName, 
        assetValue : AssetValue
    ) : VIPAsset{
        return new VIPAsset(
            AssetId.create(), 
            assetName, 
            assetValue
        ); 
    }

    static fromPersistence(
        assetId : AssetId, 
        assetName :AssetName, 
        assetValue : AssetValue
    ) : VIPAsset{
        return new VIPAsset(
            assetId, 
            assetName, 
            assetValue
        )
    }

    getAssetId() : AssetId {
        return this.assetId
    }

    getAssetName(): AssetName{
        return this.assetName
    }

    getAssetValue(): AssetValue{
        return this.assetValue
    }
    
}