/*
  Warnings:

  - You are about to drop the column `videoUrl` on the `User` table. All the data in the column will be lost.
  - Added the required column `videoUrl` to the `Script` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Script" ADD COLUMN     "videoUrl" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "videoUrl";
