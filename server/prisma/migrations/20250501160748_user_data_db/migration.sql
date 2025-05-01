/*
  Warnings:

  - Added the required column `upDateAt` to the `userData` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_userData" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "Rotation" INTEGER NOT NULL,
    "upDateAt" BIGINT NOT NULL
);
INSERT INTO "new_userData" ("Rotation", "id") SELECT "Rotation", "id" FROM "userData";
DROP TABLE "userData";
ALTER TABLE "new_userData" RENAME TO "userData";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
