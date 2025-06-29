/*
  Warnings:

  - The primary key for the `Transcript` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `endSeconds` on the `Transcript` table. All the data in the column will be lost.
  - You are about to drop the column `startSeconds` on the `Transcript` table. All the data in the column will be lost.
  - The `id` column on the `Transcript` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `words` to the `Transcript` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Transcript" DROP CONSTRAINT "Transcript_pkey",
DROP COLUMN "endSeconds",
DROP COLUMN "startSeconds",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "words" JSONB NOT NULL,
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Transcript_pkey" PRIMARY KEY ("id");
