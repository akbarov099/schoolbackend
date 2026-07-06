import {
  Injectable,
  OnModuleInit,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import { Admin, AdminDocument } from './schemas/admin.schema';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService implements OnModuleInit {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectModel(Admin.name) private adminModel: Model<AdminDocument>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  // Server birinchi marta ishga tushganda, agar hech qanday admin bo'lmasa,
  // .env dagi ADMIN_LOGIN / ADMIN_PASSWORD asosida standart admin yaratadi.
  async onModuleInit() {
    const count = await this.adminModel.countDocuments();
    if (count === 0) {
      const login = this.configService.get<string>('ADMIN_LOGIN') || 'admin';
      const password =
        this.configService.get<string>('ADMIN_PASSWORD') || 'admin12345';
      const hashed = await bcrypt.hash(password, 10);
      await this.adminModel.create({ login, password: hashed });
      this.logger.log(
        `Standart admin yaratildi -> login: "${login}", parol: "${password}" (buni .env orqali o'zgartiring)`,
      );
    }
  }

  async login(dto: LoginDto) {
    const admin = await this.adminModel.findOne({ login: dto.login });
    if (!admin) {
      throw new UnauthorizedException({
        error: { message: 'Login yoki parol noto\'g\'ri' },
      });
    }

    const isMatch = await bcrypt.compare(dto.password, admin.password);
    if (!isMatch) {
      throw new UnauthorizedException({
        error: { message: 'Login yoki parol noto\'g\'ri' },
      });
    }

    const payload = { sub: admin._id, login: admin.login };
    const accessToken = this.jwtService.sign(payload);

    return { accessToken };
  }
}
