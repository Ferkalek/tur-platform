import {
  Controller,
  Get,
  Put,
  Body,
  UseGuards,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
  Delete,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { User } from './entities/user.entity';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ResponseUserDto } from './dto';
import { avatarMulterConfig } from '../config/multer.config';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Отримати свій профіль' })
  @ApiResponse({ status: 200, description: 'Профіль отримано' })
  @ApiResponse({ status: 401, description: 'Не авторизований' })
  async getMyProfile(@CurrentUser() user: User): Promise<ResponseUserDto> {
    return await this.usersService.findById(user.id);
  }

  @Put('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Оновити свій профіль' })
  @ApiResponse({ status: 200, description: 'Профіль оновлено' })
  @ApiResponse({ status: 401, description: 'Не авторизований' })
  async updateMyProfile(
    @CurrentUser() user: User,
    @Body() updateProfileDto: UpdateProfileDto,
  ): Promise<ResponseUserDto> {
    return await this.usersService.updateProfile(user.id, updateProfileDto);
  }

  @Post('me/avatar')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @UseInterceptors(FileInterceptor('avatar', avatarMulterConfig))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Завантажити аватар' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        avatar: {
          type: 'string',
          format: 'binary',
          description: 'Файл аватара (JPEG, PNG, WebP, макс 5MB)',
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Аватар завантажено' })
  @ApiResponse({ status: 400, description: 'Невалідний файл' })
  @ApiResponse({ status: 401, description: 'Не авторизований' })
  async uploadAvatar(
    @CurrentUser() user: User,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<ResponseUserDto> {
    if (!file) {
      throw new BadRequestException('Файл не завантажено');
    }

    const avatarUrl = `/uploads/avatars/${file.filename}`;
    return await this.usersService.updateProfile(
      user.id,
      { avatar: avatarUrl } as UpdateProfileDto,
      true,
    );
  }

  @Delete('me/avatar')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Видалити аватар зображення' })
  @ApiResponse({ status: 200, description: 'Зображення видалено' })
  async deleteAvatar(@CurrentUser() user: User): Promise<ResponseUserDto> {
    return await this.usersService.deleteAvatar(user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Отримати публічний профіль користувача' })
  @ApiParam({ name: 'id', description: 'UUID користувача' })
  @ApiResponse({ status: 200, description: 'Профіль користувача' })
  @ApiResponse({ status: 404, description: 'Користувача не знайдено' })
  async getUserProfile(@Param('id') id: string): Promise<ResponseUserDto> {
    return await this.usersService.findById(id);
  }
}
