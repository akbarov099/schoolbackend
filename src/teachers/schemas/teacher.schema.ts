import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TeacherDocument = Teacher & Document;

@Schema({ timestamps: true })
export class Teacher {
  @Prop({ required: true, trim: true })
  full_name: string;

  @Prop({ trim: true })
  subject: string;

  @Prop({ enum: ['Teacher', 'Personal'], default: 'Teacher' })
  type: string;

  @Prop({ default: null })
  image: string;

  @Prop({ default: null })
  resume: string;
}

export const TeacherSchema = SchemaFactory.createForClass(Teacher);
