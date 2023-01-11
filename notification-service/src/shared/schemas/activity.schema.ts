import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

import { User } from './user.schema';

@Schema({ timestamps: true })
export class Activity extends Document {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name, index: true })
  user: User;

  @Prop({ required: true })
  name: string;

  @Prop()
  startTime?: Date;

  @Prop()
  endTime?: Date;
}

const ActivitySchema = SchemaFactory.createForClass(Activity);
export { ActivitySchema };
