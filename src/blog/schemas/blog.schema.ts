import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type BlogDocument = Blog & Document;

@Schema({ timestamps: true })
export class Blog {
  @Prop({ required: true, trim: true })
  title: string;

  // Frontend bu yerga JSON.stringify({image, date}) qilib yuboradi,
  // shuning uchun string sifatida saqlaymiz va o'shandayligicha qaytaramiz.
  @Prop({ required: true })
  body: string;
}

export const BlogSchema = SchemaFactory.createForClass(Blog);
