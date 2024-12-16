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

@Module({
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
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
