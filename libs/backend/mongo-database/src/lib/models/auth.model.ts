import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AuthEntity, PROVIDERS, ProviderType } from '@starter/global-data';
import { compareSync, hashSync } from 'bcrypt';
import mongoose, { Document } from 'mongoose';
import { CollectionName } from '../enum';

@Schema({ collection: CollectionName.AUTH })
export class AuthDocument extends Document implements Partial<AuthEntity> {
  @Prop({ type: String, enum: PROVIDERS, default: 'local' })
  provider?: ProviderType;

  // provider 가 local 일 경우 User 의 _id
  @Prop({ type: String, required: true })
  providerId: string;

  @Prop({ type: String })
  hashedPassword: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, required: true })
  user: string;

  password?: string;

  validatePassword: (password: string) => boolean;
}

export const AuthSchema = SchemaFactory.createForClass(AuthDocument);

AuthSchema.virtual('password').set(function (password: string) {
  this.hashedPassword = hashSync(password, 12);
});

AuthSchema.methods.validatePassword = function (password: string): boolean {
  return compareSync(password, this.hashedPassword);
};
