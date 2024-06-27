/*
  Warnings:

  - You are about to drop the column `allowCancellation` on the `EventType` table. All the data in the column will be lost.
  - You are about to drop the column `allowRescheduling` on the `EventType` table. All the data in the column will be lost.
  - You are about to drop the column `maxCancellationDays` on the `EventType` table. All the data in the column will be lost.
  - You are about to drop the column `maxCancellationHours` on the `EventType` table. All the data in the column will be lost.
  - You are about to drop the column `maxReschedulingDays` on the `EventType` table. All the data in the column will be lost.
  - You are about to drop the column `maxReschedulingHours` on the `EventType` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "EventType" DROP COLUMN "allowCancellation",
DROP COLUMN "allowRescheduling",
DROP COLUMN "maxCancellationDays",
DROP COLUMN "maxCancellationHours",
DROP COLUMN "maxReschedulingDays",
DROP COLUMN "maxReschedulingHours",
ADD COLUMN     "eventCancelId" INTEGER,
ADD COLUMN     "eventRescheduleId" INTEGER;

-- CreateTable
CREATE TABLE "EventReschedule" (
    "id" SERIAL NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT false,
    "maxHours" INTEGER,
    "maxDays" INTEGER,
    "noLimit" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "EventReschedule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventCancel" (
    "id" SERIAL NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT false,
    "maxHours" INTEGER,
    "maxDays" INTEGER,
    "noLimit" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "EventCancel_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "EventType" ADD CONSTRAINT "EventType_eventCancelId_fkey" FOREIGN KEY ("eventCancelId") REFERENCES "EventCancel"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventType" ADD CONSTRAINT "EventType_eventRescheduleId_fkey" FOREIGN KEY ("eventRescheduleId") REFERENCES "EventReschedule"("id") ON DELETE SET NULL ON UPDATE CASCADE;
