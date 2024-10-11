import { Model, Types } from 'mongoose';
import * as bcrypt from 'bcrypt';
import {
  BadRequestException,
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { AuthCredentialsDto } from 'src/app/modules/auth/dto/auth-credentials.dto';
import { RegisterDTO } from 'src/app/modules/auth/dto/register.dto';
import { User, UserDocument } from './entities/user.entity';
import { LoginDTO } from '../auth/dto/login.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async createUser(registerDTO: RegisterDTO) {
    const checkExistUser = await this.userModel.findOne({
      email: registerDTO.email,
    });
    if (checkExistUser) {
      throw new HttpException(
        'User already exist',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    const { password, ...rest } = registerDTO;
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    const data = { password: hashedPassword, ...rest };
    const user = await this.userModel.create(data);
    const userData = await user.save();
    const { password: userPassword, ...userWithoutPassword } = userData['_doc'];
    return userWithoutPassword;
  }

  async findOneByEmail(email: string) {
    return this.userModel
      .findOne((user) => user.email === email)
      .lean()
      .exec();
  }

  async getUserById(id: Types.ObjectId) {
    try {
      const user = await this.userModel.findById(id);
      if (!user) {
        throw new NotFoundException();
      }
      return user;
    } catch (error) {
      throw error;
    }
  }

  async findAndVerify(authCredentialsDto: { email: string; password: string }) {
    try {
      const { email, password } = authCredentialsDto;
      const user = await this.userModel.findOne({ email });
      if (!user) {
        throw new NotFoundException('User does not exist');
      }
      const compare = await bcrypt.compare(password, user.password);
      if (!compare) {
        throw new BadRequestException('Password is not correct');
      }
      return user;
    } catch (error) {
      throw error;
    }
  }
}
