# CDP Verification Backend

## Local
```bash
cp .env.example .env
npm install
npx prisma migrate dev --name init
npm run start:dev
```

## Render
1. ZIP'i aç.
2. ZIP içindeki dosyaları GitHub repo köküne yükle. ZIP dosyasını repo'ya koyma.
3. Render > New Blueprint veya New Web Service.
4. PostgreSQL oluştur.
5. Environment:
   - DATABASE_URL
   - PUBLIC_BASE_URL = Render backend URL
   - UPLOAD_DIR = /var/data/uploads
6. Deploy.
