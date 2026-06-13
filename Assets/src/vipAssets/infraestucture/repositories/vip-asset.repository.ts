import { Pool } from "pg";
import pool from "../database/postgres.database.js";
import type { VIPAssetRepository } from "../../domain/repositories/vip-asset.repository.js";
import type { VIPAsset } from "../../domain/entities/vip-asset.entity.js";
import type { AssetId } from "../../domain/value-objects/asset-id.vo.js";
import type { VIPAssetModel } from "../models/vip-asset.model.js";
import { VIPAssetMapper } from "../mappers/vip-asset.mapper.js";

export class VIPAssetRepositoryImpl implements VIPAssetRepository {

    constructor(
        private readonly db: Pool = pool
    ) {}

    async findById(assetId: AssetId): Promise<VIPAsset | null> {
        try {
            const result = await this.db.query(
                `SELECT uuid, name, value
                 FROM vip_assets
                 WHERE uuid = $1`,
                [assetId.getValue()]
            );

            if (!result.rows[0]) return null;

            return VIPAssetMapper.toDomain(result.rows[0] as VIPAssetModel);
        } catch (error) {
            throw new Error(`Failed to find VIP asset by id: ${error instanceof Error ? error.message : error}`);
        }
    }

    async findAll(): Promise<VIPAsset[]> {
        try {
            const result = await this.db.query(
                `SELECT uuid, name, value
                 FROM vip_assets`
            );

            return result.rows.map(row => VIPAssetMapper.toDomain(row as VIPAssetModel));
        } catch (error) {
            throw new Error(`Failed to find VIP assets: ${error instanceof Error ? error.message : error}`);
        }
    }

    async create(vipAsset: VIPAsset): Promise<VIPAsset> {
        try {
            const vipAssetDB = VIPAssetMapper.toPersistence(vipAsset);
            const result = await this.db.query(
                `INSERT INTO vip_assets (uuid, name, value)
                 VALUES ($1, $2, $3)
                 RETURNING *`,
                [vipAssetDB.uuid, vipAssetDB.name, vipAssetDB.value]
            );

            return VIPAssetMapper.toDomain(result.rows[0] as VIPAssetModel);
        } catch (error) {
            throw new Error(`Failed to create VIP asset: ${error instanceof Error ? error.message : error}`);
        }
    }
}