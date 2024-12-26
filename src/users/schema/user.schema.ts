import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema({ timestamps: true })
export class User {
  @Prop({ type: String })
  firstName: string;

  @Prop({ type: String })
  lastName: string;

  @Prop({ type: String })
  email: string;

  @Prop({ type: String })
  phoneNumber: string;

  @Prop({ type: String })
  gender: string;

  @Prop({ type: Number })
  age: number;

  @Prop({ type: String, select: false})
  password: string;

  @Prop({
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Expense",
    default: [],
  })
  expenses: mongoose.Schema.Types.ObjectId[];
}

export const UserSchema = SchemaFactory.createForClass(User);
