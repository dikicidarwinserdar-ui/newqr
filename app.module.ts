import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from './prisma.service';
import { LabelsController } from './labels.controller';
import { LotsController } from './lots.controller';
import { VerificationController } from './verification.controller';
import { LabelsService } from './labels.service';
import { FilesService } from './files.service';
import { CdpService } from './cdp.service';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true })],
  controllers: [LabelsController, LotsController, VerificationController],
  providers: [PrismaService, LabelsService, FilesService, CdpService],
})
export class AppModule {}
