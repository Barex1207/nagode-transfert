-- CreateEnum
CREATE TYPE "VehicleCategory" AS ENUM ('STANDARD', 'VIP', 'PRESTIGE');

-- AlterTable
ALTER TABLE "Vehicle" ADD COLUMN     "amenities" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "category" "VehicleCategory" NOT NULL DEFAULT 'STANDARD',
ADD COLUMN     "routes" TEXT[] DEFAULT ARRAY[]::TEXT[];
