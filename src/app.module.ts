import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { BookModule } from './book/book.module';

@Module({
  imports: [PrismaModule, BookModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
