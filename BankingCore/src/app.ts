import express from "express";
import { bankAccountRouter } from "./BankAccount/presentation/bankAccount.routes.js";
import { transactionRouter } from "./Transactions/presentation/transaction.routes.js";



const app = express();

app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

app.get('/', (req, res) => {
    res.send('BankingCore Service running');
});
app.use("/transactions", transactionRouter);
app.use("/bank-accounts", bankAccountRouter);

export default app;