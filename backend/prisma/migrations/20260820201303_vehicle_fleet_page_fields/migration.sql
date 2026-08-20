/*
  Warnings:

  - You are about to drop the column `imageUrl` on the `Vehicle` table. All the data in the column will be lost.

*/
-- AlterEnum
ALTER TYPE "VehicleCategory" ADD VALUE 'CARGO';

-- AlterTable
ALTER TABLE "Vehicle" DROP COLUMN "imageUrl",
ADD COLUMN     "cargoCapacityLabel" TEXT,
ADD COLUMN     "images" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "seatPlanKey" TEXT,
ADD COLUMN     "unitCount" INTEGER,
ALTER COLUMN "capacity" DROP NOT NULL,
ALTER COLUMN "capacity" DROP DEFAULT;
