import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true, unique: true, index: true })
  email: string;

  @Prop()
  name: string;

  @Prop({ required: true })
  password: string;
}

const UserSchema = SchemaFactory.createForClass(User);
export { UserSchema };
