import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { LabelsService } from './labels.service';
import { PrismaService } from './prisma.service';
import { CreateLabelDto } from './dto';

@Controller()
export class LabelsController {
  constructor(private labels: LabelsService, private prisma: PrismaService) {}
  @Get('health') health() { return { ok: true }; }
  @Post('labels') create(@Body() dto: CreateLabelDto) { return this.labels.createOrGet(dto); }
  @Get('labels/:id') get(@Param('id') id: string) { return this.prisma.productLabel.findUnique({ where: { id }, include: { lots: true }}); }
}
