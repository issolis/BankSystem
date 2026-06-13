export interface TransactionModel {
    uuid: string;
    account_remitter_uuid: string;
    account_receiver_uuid: string;
    amount: string;
    status: string;
    rejection_reason: string | null;
    created_at: Date;
}