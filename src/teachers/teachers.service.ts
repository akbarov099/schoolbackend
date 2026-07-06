import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Teacher, TeacherDocument } from './schemas/teacher.schema';
import { CreateTeacherDto } from './dto/create-teacher.dto';

@Injectable()
export class TeachersService {
  constructor(
    @InjectModel(Teacher.name) private teacherModel: Model<TeacherDocument>,
  ) {}

  async findAll() {
    const teachers = await this.teacherModel.find().sort({ createdAt: -1 });
    return { success: true, data: teachers };
  }

  async create(dto: CreateTeacherDto) {
    const teacher = await this.teacherModel.create(dto);
    return { success: true, data: teacher };
  }

  async remove(id: string) {
    const teacher = await this.teacherModel.findByIdAndDelete(id);
    if (!teacher) {
      throw new NotFoundException({ error: { message: "O'qituvchi topilmadi" } });
    }
    return { success: true };
  }
}
