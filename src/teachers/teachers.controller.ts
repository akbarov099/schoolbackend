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
import { TeachersService } from './teachers.service';
import { CreateTeacherDto } from './dto/create-teacher.dto';

@Controller('teachers')
export class TeachersController {
  constructor(private readonly teachersService: TeachersService) {}

  // GET /api/teachers -> hamma ko'ra oladi (frontend sayti uchun ham kerak bo'lishi mumkin)
  @Get()
  findAll() {
    return this.teachersService.findAll();
  }

  // POST /api/teachers/create -> faqat admin (JWT bilan)
  @UseGuards(JwtAuthGuard)
  @Post('create')
  create(@Body() dto: CreateTeacherDto) {
    return this.teachersService.create(dto);
  }

  // DELETE /api/teachers/delete/:id -> faqat admin
  @UseGuards(JwtAuthGuard)
  @Delete('delete/:id')
  remove(@Param('id') id: string) {
    return this.teachersService.remove(id);
  }
}
