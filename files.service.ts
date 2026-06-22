import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { randomUUID } from 'crypto';
@Injectable()
export class FilesService {
  root = process.env.UPLOAD_DIR || './uploads';
  ensure(dir: string) { const p = path.join(this.root, dir); fs.mkdirSync(p, { recursive: true }); return p; }
  save(buffer: Buffer, dir: string, ext='png') {
    const folder = this.ensure(dir);
    const name = `${randomUUID()}.${ext.replace('.', '')}`;
    const full = path.join(folder, name);
    fs.writeFileSync(full, buffer);
    return full;
  }
}
