import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ExpensesModule } from './expenses/expenses.module';
import { ProductsModule } from './products/products.module';
import { PostModule } from './post/post.module';

@Module({
  imports: [ExpensesModule, UsersModule, ProductsModule, PostModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
