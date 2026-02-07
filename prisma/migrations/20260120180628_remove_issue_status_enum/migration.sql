/*
  Warnings:

  - You are about to drop the column `status` on the `Issue` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Issue" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "type" TEXT NOT NULL,
    "priority" TEXT NOT NULL,
    "order" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "projectId" INTEGER NOT NULL,
    "boardId" INTEGER NOT NULL,
    "columnId" INTEGER NOT NULL,
    "assigneeId" INTEGER,
    CONSTRAINT "Issue_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Issue_boardId_fkey" FOREIGN KEY ("boardId") REFERENCES "Board" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Issue_columnId_fkey" FOREIGN KEY ("columnId") REFERENCES "Column" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Issue_assigneeId_fkey" FOREIGN KEY ("assigneeId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Issue" ("assigneeId", "boardId", "columnId", "createdAt", "description", "id", "order", "priority", "projectId", "title", "type", "updatedAt") SELECT "assigneeId", "boardId", "columnId", "createdAt", "description", "id", "order", "priority", "projectId", "title", "type", "updatedAt" FROM "Issue";
DROP TABLE "Issue";
ALTER TABLE "new_Issue" RENAME TO "Issue";
CREATE INDEX "Issue_columnId_order_idx" ON "Issue"("columnId", "order");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
