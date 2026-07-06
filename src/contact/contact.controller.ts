import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { ContactService } from './contact.service';
import { CreateContactDto, UpdateContactDto } from './dto/contact.dto';

@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  // GET /api/contact
  @Get()
  findAll() {
    return this.contactService.findAll();
  }

  // POST /api/contact/create -> saytdagi tashrif buyuruvchilar ham fikr qoldira olishi uchun ochiq
  @Post('create')
  create(@Body() dto: CreateContactDto) {
    return this.contactService.create(dto);
  }

  // PUT /api/contact/update/:id -> faqat admin
  @UseGuards(JwtAuthGuard)
  @Put('update/:id')
  update(@Param('id') id: string, @Body() dto: UpdateContactDto) {
    return this.contactService.update(id, dto);
  }

  // DELETE /api/contact/delete/:id -> faqat admin
  @UseGuards(JwtAuthGuard)
  @Delete('delete/:id')
  remove(@Param('id') id: string) {
    return this.contactService.remove(id);
  }
}
