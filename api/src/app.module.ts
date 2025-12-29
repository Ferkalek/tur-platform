import { Module } from '@nestjs/common';
// import { AppController } from './app.controller';
import { NewsModule } from './news/news.module';
// import { AppService } from './app.service';
// import { UsersModule } from './users/users.module';

@Module({
  imports: [NewsModule],
  // controllers: [AppController],
  // providers: [AppService],
})
export class AppModule {}
