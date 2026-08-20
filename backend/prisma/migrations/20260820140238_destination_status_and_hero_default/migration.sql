-- CreateEnum
CREATE TYPE "DestinationStatus" AS ENUM ('ACTIVE', 'COMING_SOON');

-- AlterTable
ALTER TABLE "Destination" ADD COLUMN     "status" "DestinationStatus" NOT NULL DEFAULT 'ACTIVE';

-- AlterTable
ALTER TABLE "SiteSettings" ALTER COLUMN "heroUsersLabel" SET DEFAULT '';

-- DataMigration: clear the old placeholder value on existing rows so the
-- hero falls back to a real, computed stat instead of a fabricated number.
UPDATE "SiteSettings" SET "heroUsersLabel" = '' WHERE "heroUsersLabel" = '+50,000';
