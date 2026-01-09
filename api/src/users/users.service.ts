import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UpdateProfileDto, ResponseUserDto } from './dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(
    email: string,
    password: string,
    firstName: string,
    lastName: string,
  ): Promise<User> {
    const existingUser = await this.findByEmail(email);

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const user = this.usersRepository.create({
      email,
      password,
      firstName,
      lastName,
    });

    return await this.usersRepository.save(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.usersRepository.findOne({ where: { email } });
  }

  async findById(id: string): Promise<ResponseUserDto> {
    const user = await this.usersRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return this.mapResponseDto(user);
  }

  async updateProfile(
    userId: string,
    updateProfileData: UpdateProfileDto,
  ): Promise<ResponseUserDto> {
    const user = await this.findById(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // update only provided fields
    Object.assign(user, updateProfileData);

    const userRes = await this.usersRepository.save(user);

    return this.mapResponseDto(userRes);
  }

  private mapResponseDto(user: User): ResponseUserDto {
    const {
      id,
      email,
      firstName,
      lastName,
      phone = '',
      bio = '',
      socialLink = '',
      avatar = '',
      createdAt,
      updatedAt,
    } = user;

    return {
      id,
      email,
      firstName,
      lastName,
      phone,
      bio,
      socialLink,
      avatar,
      createdAt,
      updatedAt,
    };
  }
}
