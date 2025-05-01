-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_userData" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "Rotation" INTEGER NOT NULL,
    "upDateAt" TEXT NOT NULL
);
INSERT INTO "new_userData" ("Rotation", "id", "upDateAt") SELECT "Rotation", "id", "upDateAt" FROM "userData";
DROP TABLE "userData";
ALTER TABLE "new_userData" RENAME TO "userData";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
