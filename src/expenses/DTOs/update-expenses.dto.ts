import { PartialType } from '@nestjs/swagger';
import { CreateExpense } from './create-expenses.dto';

export class UpdateExpense extends PartialType(CreateExpense) {}
