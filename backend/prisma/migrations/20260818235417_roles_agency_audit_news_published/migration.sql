/*
  Warnings:

  - You are about to drop the column `district` on the `Agency` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `Agency` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "AdminRole" AS ENUM ('SUPER_ADMIN', 'EDITOR');

-- AlterTable
ALTER TABLE "AdminUser" ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "role" "AdminRole" NOT NULL DEFAULT 'EDITOR';

-- AlterTable
ALTER TABLE "Agency" DROP COLUMN "district",
DROP COLUMN "phone",
ADD COLUMN     "country" TEXT NOT NULL DEFAULT 'Togo',
ADD COLUMN     "countryCode" TEXT NOT NULL DEFAULT '+228',
ADD COLUMN     "email" TEXT,
ADD COLUMN     "parcelPhones" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "ticketPhones" TEXT[] DEFAULT ARRAY[]::TEXT[],
ALTER COLUMN "address" SET DEFAULT '';

-- AlterTable
ALTER TABLE "News" ADD COLUMN     "published" BOOLEAN NOT NULL DEFAULT true;

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "adminId" TEXT,
    "adminEmail" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "resourceType" TEXT NOT NULL,
    "resourceId" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);
