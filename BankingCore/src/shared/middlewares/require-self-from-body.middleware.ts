import type { Request, Response, NextFunction } from "express";
import { BankAccountRepositoryImpl } from "../../BankAccount/infraestucture/repositories/bank-account.repository.impl.js";
import { AccountId } from "../../BankAccount/domain/value-objects/account-id.vos.js";
const bankAccountRepository = new BankAccountRepositoryImpl();

export async function requireSelfFromBody(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const remitterAccountId = new AccountId(req.body.remitter_account_uuid);
        const bankAccount = await bankAccountRepository.findById(remitterAccountId);

        if (!bankAccount) {
            res.status(404).json({ success: false, error: "Remitter account not found" });
            return;
        }

        if (bankAccount.getOwnerId().getValue() !== req.user!.sub) {
            res.status(403).json({ success: false, error: "You are not the owner of this account" });
            return;
        }

        next();
    } catch (error) {
        res.status(500).json({ success: false, error: "Authorization error" });
    }
}