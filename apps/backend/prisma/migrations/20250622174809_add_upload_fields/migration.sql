-- AlterTable
ALTER TABLE "Video" ADD COLUMN     "storageKey" TEXT,
ADD COLUMN     "uploadProgress" INTEGER NOT NULL DEFAULT 0;
