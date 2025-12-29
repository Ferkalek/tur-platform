// ============================================
// СТРУКТУРА ПРОЕКТУ
// ============================================

/*
news-portal-api/
├── src/
│   ├── common/
│   │   ├── decorators/
│   │   │   ├── current-user.decorator.ts
│   │   │   └── public.decorator.ts
│   │   ├── filters/
│   │   │   └── http-exception.filter.ts
│   │   ├── guards/
│   │   │   └── jwt-auth.guard.ts
│   │   ├── interceptors/
│   │   │   └── transform.interceptor.ts
│   │   └── pipes/
│   │       └── validation.pipe.ts
│   ├── config/
│   │   ├── database.config.ts
│   │   └── jwt.config.ts
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── dto/
│   │   │   │   ├── login.dto.ts
│   │   │   │   └── register.dto.ts
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── auth.module.ts
│   │   │   └── jwt.strategy.ts
│   │   ├── users/
│   │   │   ├── dto/
│   │   │   │   ├── create-user.dto.ts
│   │   │   │   └── update-user.dto.ts
│   │   │   ├── entities/
│   │   │   │   └── user.entity.ts
│   │   │   ├── users.controller.ts
│   │   │   ├── users.service.ts
│   │   │   └── users.module.ts
│   │   └── news/
│   │       ├── dto/
│   │       │   ├── create-news.dto.ts
│   │       │   ├── update-news.dto.ts
│   │       │   └── query-news.dto.ts
│   │       ├── entities/
│   │       │   └── news.entity.ts
│   │       ├── news.controller.ts
│   │       ├── news.service.ts
│   │       └── news.module.ts
│   ├── app.module.ts
│   └── main.ts
├── .env
├── .env.example
├── package.json
└── tsconfig.json
*/

// ============================================
// src/main.ts
// ============================================
/*
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  });

  // Global prefix
  app.setGlobalPrefix('api/v1');

  // Validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Filters & Interceptors
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new TransformInterceptor());

  // Swagger
  const config = new DocumentBuilder()
    .setTitle('News Portal API')
    .setDescription('API для порталу новин')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(process.env.PORT || 3000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();

// ============================================
// src/app.module.ts
// ============================================

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule } from '@nestjs/throttler';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { NewsModule } from './modules/news/news.module';
import databaseConfig from './config/database.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig],
    }),
    TypeOrmModule.forRootAsync({
      useFactory: () => databaseConfig(),
    }),
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 10,
    }]),
    AuthModule,
    UsersModule,
    NewsModule,
  ],
})
export class AppModule {}

// ============================================
// src/config/database.config.ts
// ============================================

import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export default registerAs('database', (): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT, 10) || 5432,
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_DATABASE || 'news_portal',
  entities: [__dirname + '/../2stars/stars.entity{.ts,.js}'],
  synchronize: process.env.NODE_ENV === 'development',
  logging: process.env.NODE_ENV === 'development',
}));

// ============================================
// src/modules/users/entities/user.entity.ts
// ============================================

import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Exclude } from 'class-transformer';
import { News } from '../../news/entities/news.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  @Exclude()
  password: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ nullable: true })
  avatar?: string;

  @Column({ nullable: true })
  bio?: string;

  @Column({ default: true })
  isActive: boolean;

  @OneToMany(() => News, (news) => news.author)
  news: News[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

// ============================================
// src/modules/news/entities/news.entity.ts
// ============================================

import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('news')
export class News {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column('text')
  content: string;

  @Column({ nullable: true })
  coverImage?: string;

  @Column({ default: false })
  isPublished: boolean;

  @Column({ type: 'int', default: 0 })
  views: number;

  @ManyToOne(() => User, (user) => user.news, { eager: true })
  @JoinColumn({ name: 'authorId' })
  author: User;

  @Column()
  authorId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  publishedAt?: Date;
}

// ============================================
// src/modules/auth/auth.module.ts
// ============================================

import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your-secret-key',
      signOptions: { expiresIn: '7d' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}

// ============================================
// src/modules/auth/auth.service.ts
// ============================================

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    const user = await this.usersService.create({
      ...registerDto,
      password: hashedPassword,
    });
    
    return this.generateToken(user);
  }

  async login(loginDto: LoginDto) {
    const user = await this.usersService.findByEmail(loginDto.email);
    
    if (!user || !(await bcrypt.compare(loginDto.password, user.password))) {
      throw new UnauthorizedException('Невірний email або пароль');
    }

    return this.generateToken(user);
  }

  private generateToken(user: any) {
    const payload = { sub: user.id, email: user.email };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    };
  }
}

// ============================================
// src/modules/auth/auth.controller.ts
// ============================================

import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('register')
  @ApiOperation({ summary: 'Реєстрація користувача' })
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Public()
  @Post('login')
  @ApiOperation({ summary: 'Вхід користувача' })
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
}

// ============================================
// src/modules/news/news.service.ts
// ============================================

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { News } from './entities/news.entity';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import { QueryNewsDto } from './dto/query-news.dto';

@Injectable()
export class NewsService {
  constructor(
    @InjectRepository(News)
    private newsRepository: Repository<News>,
  ) {}

  async findAll(query: QueryNewsDto) {
    const { page = 1, limit = 10, search } = query;
    const qb = this.newsRepository
      .createQueryBuilder('news')
      .leftJoinAndSelect('news.author', 'author')
      .where('news.isPublished = :isPublished', { isPublished: true });

    if (search) {
      qb.andWhere(
        '(news.title ILIKE :search OR news.content ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    const [items, total] = await qb
      .orderBy('news.publishedAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return {
      items,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findByUser(userId: string, query: QueryNewsDto) {
    const { page = 1, limit = 10 } = query;
    const [items, total] = await this.newsRepository.findAndCount({
      where: { authorId: userId },
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
      relations: ['author'],
    });

    return {
      items,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const news = await this.newsRepository.findOne({
      where: { id },
      relations: ['author'],
    });

    if (!news) {
      throw new NotFoundException('Новину не знайдено');
    }

    // Increment views
    news.views += 1;
    await this.newsRepository.save(news);

    return news;
  }

  async create(createNewsDto: CreateNewsDto, userId: string) {
    const news = this.newsRepository.create({
      ...createNewsDto,
      authorId: userId,
    });
    return this.newsRepository.save(news);
  }

  async update(id: string, updateNewsDto: UpdateNewsDto, userId: string) {
    const news = await this.findOne(id);

    if (news.authorId !== userId) {
      throw new NotFoundException('Немає прав на редагування');
    }

    Object.assign(news, updateNewsDto);
    return this.newsRepository.save(news);
  }

  async remove(id: string, userId: string) {
    const news = await this.findOne(id);

    if (news.authorId !== userId) {
      throw new NotFoundException('Немає прав на видалення');
    }

    await this.newsRepository.remove(news);
    return { message: 'Новину видалено' };
  }
}

// ============================================
// src/modules/news/news.controller.ts
// ============================================

import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import { NewsService } from './news.service';
import { CreateNewsDto } from './dto/create-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import { QueryNewsDto } from './dto/query-news.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('news')
@Controller('news')
@UseGuards(JwtAuthGuard)
export class NewsController {
  constructor(private newsService: NewsService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Отримати всі опубліковані новини' })
  findAll(@Query() query: QueryNewsDto) {
    return this.newsService.findAll(query);
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Отримати новину за ID' })
  findOne(@Param('id') id: string) {
    return this.newsService.findOne(id);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Отримати новини користувача' })
  findByUser(@Param('userId') userId: string, @Query() query: QueryNewsDto) {
    return this.newsService.findByUser(userId, query);
  }

  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Створити новину' })
  create(@Body() createNewsDto: CreateNewsDto, @CurrentUser() user: any) {
    return this.newsService.create(createNewsDto, user.id);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Оновити новину' })
  update(@Param('id') id: string, @Body() updateNewsDto: UpdateNewsDto, @CurrentUser() user: any) {
    return this.newsService.update(id, updateNewsDto, user.id);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Видалити новину' })
  remove(@Param('id') id: string, @CurrentUser() user: any) {
    return this.newsService.remove(id, user.id);
  }
}

// ============================================
// src/modules/users/users.controller.ts
// ============================================

import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('users')
@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('profile')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Отримати профіль поточного користувача' })
  getProfile(@CurrentUser() user: any) {
    return this.usersService.findOne(user.id);
  }

  @Get(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Отримати профіль користувача за ID' })
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }
}
*/
// ============================================
// package.json - Залежності
// ============================================

/*
{
  "dependencies": {
    "@nestjs/common": "^10.3.0",
    "@nestjs/core": "^10.3.0",
    "@nestjs/config": "^3.1.1",
    "@nestjs/typeorm": "^10.0.1",
    "@nestjs/jwt": "^10.2.0",
    "@nestjs/passport": "^10.0.3",
    "@nestjs/swagger": "^7.1.17",
    "@nestjs/throttler": "^5.1.1",
    "typeorm": "^0.3.19",
    "pg": "^8.11.3",
    "passport": "^0.7.0",
    "passport-jwt": "^4.0.1",
    "bcrypt": "^5.1.1",
    "class-validator": "^0.14.0",
    "class-transformer": "^0.5.1",
    "reflect-metadata": "^0.2.1",
    "rxjs": "^7.8.1"
  }
}
*/