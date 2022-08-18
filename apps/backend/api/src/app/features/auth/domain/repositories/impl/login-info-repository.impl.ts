import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { LoginInfoDocument, ModelName } from '@starter/backend-mongo-database';
import { Model } from 'mongoose';
import { LoginInfoAggregate } from '../../aggregates';
import { LoginInfoRepository } from '../interfaces/login-info-repository';

@Injectable()
export class LoginInfoRepositoryImpl implements LoginInfoRepository {
  constructor(
    @InjectModel(ModelName.LOGIN_INFO) private _loginInfoModel: Model<LoginInfoDocument>
  ) {
  }

  async create(loginInfo: LoginInfoAggregate): Promise<void> {
    await this._loginInfoModel.create(loginInfo);
  }

  async findOne(refreshToken: string): Promise<LoginInfoAggregate | null> {
    const document = await this._loginInfoModel.findOne({ refreshToken });
    if (!document) return null;
    return new LoginInfoAggregate(document);
  }

  async patchRefreshToken(oldRefreshToken: string, newRefreshToken: string): Promise<void> {
    const document = await this._loginInfoModel
      .findOneAndDelete({ refreshToken: oldRefreshToken })
      .lean();

    if (!document) return;

    delete document._id;
    delete document.createdAt;

    const loginInfo = new LoginInfoAggregate({ ...document, refreshToken: newRefreshToken });
    await this._loginInfoModel.create(loginInfo);
  }
}
