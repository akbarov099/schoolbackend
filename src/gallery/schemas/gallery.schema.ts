import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type GalleryDocument = Gallery & Document;

@Schema({ timestamps: true })
export class Gallery {
  @Prop({ required: true })
  image: string;
}

export const GallerySchema = SchemaFactory.createForClass(Gallery);
