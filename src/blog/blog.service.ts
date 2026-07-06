import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Blog, BlogDocument } from './schemas/blog.schema';
import { CreateBlogDto } from './dto/create-blog.dto';

@Injectable()
export class BlogService {
  constructor(@InjectModel(Blog.name) private blogModel: Model<BlogDocument>) {}

  async findAll() {
    const blogs = await this.blogModel.find().sort({ createdAt: -1 });
    return { success: true, data: blogs };
  }

  async create(dto: CreateBlogDto) {
    const blog = await this.blogModel.create(dto);
    return { success: true, data: blog };
  }

  async remove(id: string) {
    const blog = await this.blogModel.findByIdAndDelete(id);
    if (!blog) {
      throw new NotFoundException({ success: false, message: 'Voqea topilmadi' });
    }
    return { success: true };
  }
}
