import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ModelName, UserDocument } from '@starter/backend-mongo-database';
import { UserEntity } from '@starter/global-data';
import { Model } from 'mongoose';
import { UserAggregate } from '../../aggregates/user.aggregate';
import { UserRepository } from '../user-repository';

@Injectable()
export class UserRepositoryImpl implements UserRepository {
  constructor(
    @InjectModel(ModelName.USER) private _userModel: Model<UserDocument>
  ) {}

  async create(user: UserAggregate): Promise<void> {
    await this._userModel.create(user);
  }

  async findById(id: string): Promise<UserAggregate | null> {
    const document = await this._userModel.findById(id).lean();
    if (!document) {
      return null;
    }
    return new UserAggregate(document);
  }

  async findOne(filter: Partial<UserEntity>): Promise<UserAggregate | null> {
    const document = await this._userModel.findOne(filter).lean();
    if (!document) {
      return null;
    }
    return new UserAggregate(document);
  }

  async updateOne(filter: Partial<UserEntity>, $set: Partial<UserAggregate>): Promise<void> {
    await this._userModel.updateOne(filter, { $set });
  }
}
