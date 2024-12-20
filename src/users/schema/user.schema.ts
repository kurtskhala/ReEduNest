import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

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
}

export const UserSchema = SchemaFactory.createForClass(User);
