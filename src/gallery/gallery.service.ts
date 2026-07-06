import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Gallery, GalleryDocument } from './schemas/gallery.schema';
import { CreateGalleryDto } from './dto/create-gallery.dto';

@Injectable()
export class GalleryService {
  constructor(
    @InjectModel(Gallery.name) private galleryModel: Model<GalleryDocument>,
  ) {}

  async findAll() {
    const items = await this.galleryModel.find().sort({ createdAt: -1 });
    return { success: true, data: items };
  }

  async create(dto: CreateGalleryDto) {
    const item = await this.galleryModel.create(dto);
    return { success: true, data: item };
  }

  async remove(id: string) {
    const item = await this.galleryModel.findByIdAndDelete(id);
    if (!item) {
      throw new NotFoundException({ success: false, message: 'Rasm topilmadi' });
    }
    return { success: true };
  }
}
