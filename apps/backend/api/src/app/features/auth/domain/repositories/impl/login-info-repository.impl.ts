import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { LoginInfoDocument, ModelName } from '@starter/backend-mongo-database';
import { LoginInfoEntity } from '@starter/global-data';
import { Model } from 'mongoose';
import { LoginInfoAggregate } from '../../aggregates';
import { LoginInfoRepository } from '../login-info-repository';

@Injectable()
export class LoginInfoRepositoryImpl implements LoginInfoRepository {
  constructor(
    @InjectModel(ModelName.LOGIN_INFO) private _loginInfoModel: Model<LoginInfoDocument>
  ) {
  }

  async create(loginInfo: LoginInfoAggregate): Promise<void> {
    await this._loginInfoModel.create(loginInfo);
  }

  async findOne(filter: Partial<LoginInfoEntity>): Promise<LoginInfoAggregate | null> {
    const document = await this._loginInfoModel.findOne(filter);
    if (!document) return null;
    return new LoginInfoAggregate(document);
  }

  async updateOne(filter: Partial<LoginInfoEntity>, $set: Partial<LoginInfoEntity>): Promise<void> {
    await this._loginInfoModel.updateOne(filter, { $set });
  }

  async deleteOne(filter: Partial<LoginInfoEntity>): Promise<void> {
    await this._loginInfoModel.deleteOne(filter);
  }
}
