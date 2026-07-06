import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { GalleryService } from './gallery.service';
import { CreateGalleryDto } from './dto/create-gallery.dto';

@Controller('gallery')
export class GalleryController {
  constructor(private readonly galleryService: GalleryService) {}

  // GET /api/gallery
  @Get()
  findAll() {
    return this.galleryService.findAll();
  }

  // POST /api/gallery/create -> faqat admin
  @UseGuards(JwtAuthGuard)
  @Post('create')
  create(@Body() dto: CreateGalleryDto) {
    return this.galleryService.create(dto);
  }

  // DELETE /api/gallery/delete/:id -> faqat admin
  @UseGuards(JwtAuthGuard)
  @Delete('delete/:id')
  remove(@Param('id') id: string) {
    return this.galleryService.remove(id);
  }
}
