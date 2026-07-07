import {
  BadRequestException,
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuid } from 'uuid';
import * as streamifier from 'streamifier';
import { UploadApiOptions, v2 as cloudinary } from 'cloudinary';
import { ConfigService } from '@nestjs/config';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@Controller('upload')
export class UploadController {
  constructor(private readonly configService: ConfigService) {
    cloudinary.config({
      cloud_name: this.configService.get<string>('CLOUDINARY_CLOUD_NAME'),
      api_key: this.configService.get<string>('CLOUDINARY_API_KEY'),
      api_secret: this.configService.get<string>('CLOUDINARY_API_SECRET'),
    });
  }

  // POST /api/upload  (multipart/form-data, field name: "file")
  // Frontenddagi useImageStore.jsx shu endpointga "file" nomli field bilan yuboradi
  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      // Faylni diskka emas, xotiraga (RAM) olamiz, keyin to'g'ridan-to'g'ri
      // Cloudinary'ga yuboramiz. Bu Render/Vercel kabi "ephemeral disk"
      // (fayllar qayta ishga tushganda o'chib ketadigan) serverlar uchun kerak.
      storage: memoryStorage(),
      limits: { fileSize: 20 * 1024 * 1024 }, // 20MB (rasm + pdf uchun yetarli)
      fileFilter: (req, file, cb) => {
        const allowed = /\.(jpg|jpeg|png|gif|webp|pdf)$/i;
        if (!allowed.test(extname(file.originalname))) {
          return cb(
            new BadRequestException({
              error: {
                message:
                  "Faqat rasm (jpg, png, gif, webp) yoki PDF fayl yuklash mumkin",
              },
            }),
            false,
          );
        }
        cb(null, true);
      },
    }),
  )
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException({ error: { message: 'Fayl topilmadi' } });
    }

    const isPdf = /\.pdf$/i.test(file.originalname);

    const options: UploadApiOptions = {
      folder: 'adminschool',
      public_id: uuid(),
      // Rasmlar uchun "image", PDF kabi boshqa fayllar uchun "raw"
      resource_type: isPdf ? 'raw' : 'image',
    };

    const result = await new Promise<any>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        options,
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        },
      );
      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    }).catch((err) => {
      throw new BadRequestException({
        error: { message: 'Faylni yuklashda xatolik: ' + err.message },
      });
    });

    // Frontend `response.data.file` dan foydalanadi
    return { file: result.secure_url };
  }
}
