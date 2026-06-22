import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import * as QRCode from 'qrcode';
import sharp from 'sharp';

@Injectable()
export class CdpService {
  hashInput(profileNo: string, alloy: string, surfaceColor: string) {
    return crypto.createHash('sha256').update(`${profileNo}|${alloy}|${surfaceColor}`.toLowerCase().trim()).digest('hex');
  }

  async generateCdpPng(seed: string): Promise<Buffer> {
    const size = 360;
    const hash = crypto.createHash('sha512').update(seed).digest();
    const pixels = Buffer.alloc(size * size * 3);
    for (let i = 0; i < size * size; i++) {
      const b = hash[i % hash.length] ^ ((i * 131) & 255);
      pixels[i*3] = b;
      pixels[i*3+1] = (b * 37 + i) & 255;
      pixels[i*3+2] = (b * 17 + i * 3) & 255;
    }
    return sharp(pixels, { raw: { width: size, height: size, channels: 3 }}).png().toBuffer();
  }

  async generateQrPng(url: string) {
    return QRCode.toBuffer(url, { type: 'png', margin: 1, width: 512, errorCorrectionLevel: 'H' });
  }

  classify(score: number) {
    if (score >= 80) return 'VERIFIED';
    if (score >= 55) return 'SUSPICIOUS';
    return 'COPY';
  }
}
