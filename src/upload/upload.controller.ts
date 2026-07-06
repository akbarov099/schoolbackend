import {
  BadRequestException,
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuid } from 'uuid';
import { ConfigService } from '@nestjs/config';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@Controller('upload')
export class UploadController {
  constructor(private readonly configService: ConfigService) {}

  // POST /api/upload  (multipart/form-data, field name: "file")
  // Frontenddagi useImageStore.jsx shu endpointga "file" nomli field bilan yuboradi
  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueName = `${uuid()}${extname(file.originalname)}`;
          cb(null, uniqueName);
        },
      }),
      limits: { fileSize: 20 * 1024 * 1024 }, // 20MB (rasm + pdf uchun yetarli)
      fileFilter: (req, file, cb) => {
        const allowed = /\.(jpg|jpeg|png|gif|webp|pdf)$/i;
        if (!allowed.test(extname(file.originalname))) {
          return cb(
            new BadRequestException({
              error: { message: 'Faqat rasm (jpg, png, gif, webp) yoki PDF fayl yuklash mumkin' },
            }),
            false,
          );
        }
        cb(null, true);
      },
    }),
  )
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException({ error: { message: 'Fayl topilmadi' } });
    }
    const baseUrl = this.configService.get<string>('BASE_URL') || 'http://localhost:5000';
    const fileUrl = `${baseUrl}/uploads/${file.filename}`;
    // Frontend `response.data.file` dan foydalanadi
    return { file: fileUrl };
  }
}
