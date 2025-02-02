import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schema/user.schema';
import { JwtModule } from '@nestjs/jwt';
import { Post, PostSchema } from '../post/schema/post.schema';
import { Expense, ExpenseSchema } from '../expenses/schema/expenses.schema';
import { AwsS3Module } from 'src/aws-s3/aws-s3.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Post.name, schema: PostSchema },
      { name: Expense.name, schema: ExpenseSchema },
    ]),
    AwsS3Module,
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
