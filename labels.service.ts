import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { CdpService } from './cdp.service';
import { FilesService } from './files.service';
import { CreateLabelDto } from './dto';

@Injectable()
export class LabelsService {
  constructor(private prisma: PrismaService, private cdp: CdpService, private files: FilesService) {}

  async createOrGet(dto: CreateLabelDto) {
    const labelHash = this.cdp.hashInput(dto.profileNo, dto.alloy, dto.surfaceColor);
    const existing = await this.prisma.productLabel.findUnique({ where: { labelHash }});
    if (existing) {
      const lot = await this.createLot(existing.id);
      return { reused: true, label: existing, lot };
    }

    const label = await this.prisma.productLabel.create({ data: { ...dto, labelHash }});
    const baseUrl = process.env.PUBLIC_BASE_URL || 'http://localhost:3000';
    const cdpPath = this.files.save(await this.cdp.generateCdpPng(label.id + labelHash), 'cdp');
    const lot = await this.createLot(label.id);
    const qrPath = this.files.save(await this.cdp.generateQrPng(`${baseUrl}/v/${lot.id}`), 'qr');
    const updated = await this.prisma.productLabel.update({ where: { id: label.id }, data: { cdpPath, qrPath }});
    return { reused: false, label: updated, lot };
  }

  async createLot(labelId: string) {
    const lotCode = `LOT-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
    return this.prisma.lot.create({ data: { labelId, lotCode }});
  }
}
