import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Contact, ContactDocument } from './schemas/contact.schema';
import { CreateContactDto, UpdateContactDto } from './dto/contact.dto';

@Injectable()
export class ContactService {
  constructor(
    @InjectModel(Contact.name) private contactModel: Model<ContactDocument>,
  ) {}

  async findAll() {
    const reviews = await this.contactModel.find().sort({ createdAt: -1 });
    return { success: true, data: reviews };
  }

  async create(dto: CreateContactDto) {
    const review = await this.contactModel.create(dto);
    return { success: true, data: review };
  }

  async update(id: string, dto: UpdateContactDto) {
    const review = await this.contactModel.findByIdAndUpdate(id, dto, {
      new: true,
    });
    if (!review) {
      throw new NotFoundException({
        success: false,
        message: 'Отзыв не найден',
      });
    }
    return { success: true, data: review };
  }

  async remove(id: string) {
    const review = await this.contactModel.findByIdAndDelete(id);
    if (!review) {
      throw new NotFoundException({
        success: false,
        message: 'Отзыв не найден',
      });
    }
    return { success: true };
  }
}
