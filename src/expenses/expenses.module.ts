import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ExpensesController } from './expenses.controller';
import { ExpensesService } from './expenses.service';
import { UserAgentMiddleware } from 'src/middlewares/user-agent.middleware';
import { PermissionMiddleware } from 'src/middlewares/permission.middleware';
import { TimeMiddleware } from 'src/middlewares/time.middleware';
import { UsersModule } from 'src/users/users.module';
import { Expense, ExpenseSchema } from './schema/expenses.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Expense.name, schema: ExpenseSchema }]),
    UsersModule
  ],
  controllers: [ExpensesController],
  providers: [ExpensesService],
})


export class ExpensesModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // consumer
    //   .apply(UserAgentMiddleware)
    //   .forRoutes({ path: '*', method: RequestMethod.ALL });

    // consumer
    //   .apply(PermissionMiddleware)
    //   .forRoutes({ path: '*', method: RequestMethod.ALL });

    consumer
      .apply(TimeMiddleware)
      .forRoutes({ path: 'expenses', method: RequestMethod.ALL });
  }
}
