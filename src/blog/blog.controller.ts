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
import { BlogService } from './blog.service';
import { CreateBlogDto } from './dto/create-blog.dto';

@Controller('blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  // GET /api/blog
  @Get()
  findAll() {
    return this.blogService.findAll();
  }

  // POST /api/blog/create -> faqat admin
  @UseGuards(JwtAuthGuard)
  @Post('create')
  create(@Body() dto: CreateBlogDto) {
    return this.blogService.create(dto);
  }

  // DELETE /api/blog/delete/:id -> faqat admin
  @UseGuards(JwtAuthGuard)
  @Delete('delete/:id')
  remove(@Param('id') id: string) {
    return this.blogService.remove(id);
  }
}
