-- AlterTable
ALTER TABLE "EventType" ADD COLUMN     "allowCancellation" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "allowRescheduling" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "maxCancellationDays" INTEGER,
ADD COLUMN     "maxCancellationHours" INTEGER,
ADD COLUMN     "maxReschedulingDays" INTEGER,
ADD COLUMN     "maxReschedulingHours" INTEGER;
