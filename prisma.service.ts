generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model ProductLabel {
  id           String   @id @default(uuid())
  profileNo    String
  alloy        String
  surfaceColor String
  labelHash    String   @unique
  cdpPath      String?
  qrPath       String?
  createdAt    DateTime @default(now())

  lots Lot[]

  @@unique([profileNo, alloy, surfaceColor])
}

model Lot {
  id                 String   @id @default(uuid())
  lotCode            String   @unique
  labelId            String
  referenceImagePath String?
  createdAt          DateTime @default(now())

  label        ProductLabel          @relation(fields: [labelId], references: [id])
  verifications VerificationAttempt[]
}

model VerificationAttempt {
  id                String   @id @default(uuid())
  lotId             String
  capturedImagePath String?
  similarityScore   Float
  result            String
  createdAt         DateTime @default(now())

  lot Lot @relation(fields: [lotId], references: [id])
}
