import { Body, Controller, Get, Param, Put, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { User } from './entities/user.entity';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ResponseUserDto } from './dto';

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

  @Get(':id')
  @ApiOperation({ summary: 'Отримати публічний профіль користувача' })
  @ApiParam({ name: 'id', description: 'UUID користувача' })
  @ApiResponse({ status: 200, description: 'Профіль користувача' })
  @ApiResponse({ status: 404, description: 'Користувача не знайдено' })
  async getUserProfile(@Param('id') id: string): Promise<ResponseUserDto> {
    return await this.usersService.findById(id);
  }
}
