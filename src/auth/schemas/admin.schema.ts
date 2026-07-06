import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AdminDocument = Admin & Document;

@Schema({ timestamps: true })
export class Admin {
  @Prop({ required: true, unique: true, trim: true })
  login: string;

  @Prop({ required: true })
  password: string; // bcrypt bilan hash qilingan holda saqlanadi
}

export const AdminSchema = SchemaFactory.createForClass(Admin);
