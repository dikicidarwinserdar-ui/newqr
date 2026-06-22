import { Controller, Param, Post, UploadedFile, UseInterceptors, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { PrismaService } from './prisma.service';
import { FilesService } from './files.service';

@Controller('lots')
export class LotsController {
  constructor(private prisma: PrismaService, private files: FilesService) {}
  @Post(':lotId/reference')
  @UseInterceptors(FileInterceptor('image'))
  async reference(@Param('lotId') lotId: string, @UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException('image file required');
    const path = this.files.save(file.buffer, 'references', 'jpg');
    return this.prisma.lot.update({ where: { id: lotId }, data: { referenceImagePath: path, referenceCapturedAt: new Date() }});
  }
}
