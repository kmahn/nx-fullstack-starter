import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { UserEntity, USER_ROLES, UserRoleType } from '@starter/global-data';
import mongoose, { Document } from 'mongoose';
import { CollectionName } from '../enum';

@Schema({
  collection: CollectionName.USER,
  timestamps: { createdAt: 'joinedAt', updatedAt: true },
})
export class UserDocument extends Document implements Partial<UserEntity> {
  @Prop({ type: String, enum: USER_ROLES, default: 'member' })
  role?: UserRoleType;

  @Prop({ type: String, unique: true, required: true, lowercase: true })
  email: string;

  @Prop({ type: String, trim: true, index: true, required: true })
  name: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, default: null })
  auth?: string | null;

  @Prop({ type: Date })
  accessDate?: Date;
}

export const UserSchema = SchemaFactory.createForClass(UserDocument);
