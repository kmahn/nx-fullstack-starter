import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ModelName, UserDocument } from '@starter/backend-mongo-database';
import { Model } from 'mongoose';
import { UserAggregate } from '../../aggregates/user.aggregate';
import { UserRepository } from '../interfaces/user-repository';

@Injectable()
export class UserRepositoryImpl implements UserRepository {
  constructor(
    @InjectModel(ModelName.USER) private userModel: Model<UserDocument>
  ) {}

  async create(user: UserAggregate): Promise<void> {
    await this.userModel.create(user);
  }

  async findById(id: string): Promise<UserAggregate | null> {
    const document = await this.userModel.findById(id).lean();
    if (!document) {
      return null;
    }
    return new UserAggregate(document);
  }

  async findOne(filter: any): Promise<UserAggregate | null> {
    const document = await this.userModel.findOne(filter).lean();
    if (!document) {
      return null;
    }
    return new UserAggregate(document);
  }

  async updateOne(id: string, $set: Partial<UserAggregate>): Promise<void> {
    await this.userModel.updateOne({ _id: id }, { $set });
  }
}
