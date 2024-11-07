import { Controller, Module } from '@nestjs/common';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { BookModule } from './book/book.module';
import { LibraryModule } from './library/library.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { BookController } from './book/book.controller';
import { UserController } from './user/user.controller';
import { LibraryController } from './library/library.controller';
import { UserService } from './user/user.service';
import { BookService } from './book/book.service';
import { LibraryService } from './library/library.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'db',
      port: 5432,
      username: 'library',
      password: 'postgres',
      database: 'library_db',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),

    UserModule,
    BookModule,
    LibraryModule,
  ],
})
export class AppModule {}
