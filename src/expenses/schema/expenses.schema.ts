import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { User } from '../../users/schema/user.schema';

@Schema({ timestamps: true })
export class Expense {
  @Prop({ Type: String })
  categoty: string;

  @Prop({ Type: String })
  productName: string;

  @Prop({ Type: Number })
  quantity: number;

  @Prop({ Type: Number })
  price: number;

  @Prop({ Type: Number })
  totalPrice: number;

  @Prop({ Type: mongoose.Schema.Types.ObjectId, ref: User.name })
  user: mongoose.Schema.Types.ObjectId;
}

export const ExpenseSchema = SchemaFactory.createForClass(Expense);