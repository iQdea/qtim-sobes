import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { CacheModule } from './modules/cache/cache.module';
import { ArticlesModule } from './modules/articles/articles.module';

@Module({
  imports: [AuthModule, CacheModule, ArticlesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
