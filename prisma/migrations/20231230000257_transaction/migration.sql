/*
  Warnings:

  - The `wallet_id` column on the `transactions` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- DropForeignKey
ALTER TABLE "transactions" DROP CONSTRAINT "transactions_wallet_id_fkey";

-- AlterTable
ALTER TABLE "transactions" ADD COLUMN     "reciever_wallet_address" TEXT,
ADD COLUMN     "sender_wallet_address" TEXT,
DROP COLUMN "wallet_id",
ADD COLUMN     "wallet_id" INTEGER;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_wallet_id_fkey" FOREIGN KEY ("wallet_id") REFERENCES "wallets"("id") ON DELETE SET NULL ON UPDATE CASCADE;
