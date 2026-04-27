-- CreateEnum
CREATE TYPE "Platform" AS ENUM ('facebook', 'google', 'tiktok', 'instagram');

-- CreateTable
CREATE TABLE "User" (
    "id" BIGSERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "remember_token" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Campaign" (
    "id" BIGSERIAL NOT NULL,
    "user_id" BIGINT NOT NULL,
    "campaign_name" TEXT NOT NULL,
    "platform" "Platform" NOT NULL,
    "impressions" BIGINT NOT NULL,
    "clicks" BIGINT NOT NULL,
    "conversions" BIGINT NOT NULL,
    "total_spend" DECIMAL(15,2) NOT NULL,
    "product_price" DECIMAL(15,2),
    "date_start" DATE NOT NULL,
    "date_end" DATE NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Campaign_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Analysis" (
    "id" BIGSERIAL NOT NULL,
    "user_id" BIGINT NOT NULL,
    "campaign_id" BIGINT NOT NULL,
    "ctr" DECIMAL(8,4) NOT NULL,
    "cpc" DECIMAL(15,2) NOT NULL,
    "cpa" DECIMAL(15,2) NOT NULL,
    "roas" DECIMAL(8,2),
    "ai_analysis" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Analysis_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Campaign" ADD CONSTRAINT "Campaign_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Analysis" ADD CONSTRAINT "Analysis_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Analysis" ADD CONSTRAINT "Analysis_campaign_id_fkey" FOREIGN KEY ("campaign_id") REFERENCES "Campaign"("id") ON DELETE CASCADE ON UPDATE CASCADE;
