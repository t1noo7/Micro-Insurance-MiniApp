/*
  Warnings:

  - You are about to drop the column `isRevoked` on the `RefreshToken` table. All the data in the column will be lost.
  - You are about to drop the column `provider` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `providerId` on the `users` table. All the data in the column will be lost.

*/
-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "AuthProvider" ADD VALUE 'FACEBOOK';
ALTER TYPE "AuthProvider" ADD VALUE 'GITHUB';

-- DropForeignKey
ALTER TABLE "RefreshToken" DROP CONSTRAINT "RefreshToken_userId_fkey";

-- AlterTable
ALTER TABLE "RefreshToken" DROP COLUMN "isRevoked",
ADD COLUMN     "device" TEXT,
ADD COLUMN     "ip" TEXT,
ADD COLUMN     "revokedAt" TIMESTAMP(3),
ADD COLUMN     "userAgent" TEXT;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "provider",
DROP COLUMN "providerId";

-- CreateTable
CREATE TABLE "UserProvider" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "provider" "AuthProvider" NOT NULL,
    "providerId" TEXT NOT NULL,

    CONSTRAINT "UserProvider_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "UserProvider_userId_idx" ON "UserProvider"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "UserProvider_provider_providerId_key" ON "UserProvider"("provider", "providerId");

-- AddForeignKey
ALTER TABLE "RefreshToken" ADD CONSTRAINT "RefreshToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserProvider" ADD CONSTRAINT "UserProvider_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
