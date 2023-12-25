/*
  Warnings:

  - You are about to drop the column `uid` on the `wallets` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[wallet_address]` on the table `wallets` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "CURRENCY" AS ENUM ('NGN', 'USD', 'EUR', 'GBP');

-- CreateEnum
CREATE TYPE "STATUS" AS ENUM ('PENDING', 'FAILED', 'SUCCESSFUL');

-- DropIndex
DROP INDEX "wallets_uid_key";

-- AlterTable
ALTER TABLE "wallets" DROP COLUMN "uid",
ADD COLUMN     "currency" "CURRENCY" NOT NULL DEFAULT 'NGN',
ADD COLUMN     "wallet_address" TEXT;

-- CreateTable
CREATE TABLE "transactions" (
    "id" SERIAL NOT NULL,
    "uid" TEXT NOT NULL,
    "user_id" INTEGER NOT NULL,
    "recipient_id" TEXT,
    "wallet_id" TEXT,
    "summary" TEXT NOT NULL,
    "status" "STATUS" NOT NULL DEFAULT 'PENDING',
    "amount" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "transactions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "transactions_uid_key" ON "transactions"("uid");

-- CreateIndex
CREATE UNIQUE INDEX "wallets_wallet_address_key" ON "wallets"("wallet_address");

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_wallet_id_fkey" FOREIGN KEY ("wallet_id") REFERENCES "wallets"("wallet_address") ON DELETE SET NULL ON UPDATE CASCADE;
