import { BadRequestException, Controller, Get, Param, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { PrismaService } from './prisma.service';
import { FilesService } from './files.service';
import { CdpService } from './cdp.service';
import sharp from 'sharp';

async function simpleSimilarity(aPath: string, bPath: string): Promise<number> {
  const size = 256;
  const a = await sharp(aPath).resize(size, size).greyscale().raw().toBuffer();
  const b = await sharp(bPath).resize(size, size).greyscale().raw().toBuffer();
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff += Math.abs(a[i] - b[i]);
  return Math.max(0, Math.min(100, 100 - (diff / (a.length * 255)) * 100));
}

@Controller()
export class VerificationController {
  constructor(private prisma: PrismaService, private files: FilesService, private cdp: CdpService) {}

  @Post('verification/:lotId/compare')
  @UseInterceptors(FileInterceptor('image'))
  async compare(@Param('lotId') lotId: string, @UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException('image file required');
    const lot = await this.prisma.lot.findUnique({ where: { id: lotId }});
    if (!lot?.referenceImagePath) throw new BadRequestException('reference image not uploaded');
    const capturedImagePath = this.files.save(file.buffer, 'captures', 'jpg');
    const similarityScore = await simpleSimilarity(lot.referenceImagePath, capturedImagePath);
    const result = this.cdp.classify(similarityScore) as any;
    return this.prisma.verificationAttempt.create({ data: { lotId, capturedImagePath, similarityScore, result }});
  }

  @Get('v/:lotId')
  async verifyPage(@Param('lotId') lotId: string) {
    const lot = await this.prisma.lot.findUnique({ where: { id: lotId }, include: { label: true }});
    if (!lot) return { status: 'NOT_FOUND' };
    return { status: 'READY_FOR_CAPTURE', lot };
  }
}
