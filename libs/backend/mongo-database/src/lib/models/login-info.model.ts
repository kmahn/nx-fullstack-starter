import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { LoginInfoEntity } from '@starter/global-data';
import mongoose, { Document } from 'mongoose';
import { CollectionName } from './constants';

@Schema({ collection: CollectionName.LOGIN_INFO })
export class LoginInfoDocument extends Document implements Partial<LoginInfoEntity> {
  static updateRefreshToken: (refreshToken: string) => Promise<string>;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'UserDocument' })
  user: string;

  @Prop({ type: String, required: true, unique: true })
  refreshToken: string;

  // todo: 여기에 로그인 시 필요한 정보 추가(예: 접속한 IP, 기기 정보, Push Notification 토큰 정보 등)

  @Prop({ type: Date, expires: '30d', default: Date.now })
  createdAt?: Date;
}

export const LoginInfoSchema = SchemaFactory.createForClass(LoginInfoDocument);
