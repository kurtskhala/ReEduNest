import { PartialType } from '@nestjs/mapped-types';
import { CreateExpense } from './create-expenses.dto';

export class UpdateExpense extends PartialType(CreateExpense) {}
