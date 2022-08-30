import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { AuthDocument, ModelName } from '@starter/backend-mongo-database';
import { AuthEntity } from '@starter/global-data';
import { Model } from 'mongoose';
import { AuthAggregate } from '../../aggregates/auth.aggregate';
import { AuthRepository } from '../auth-repository';

@Injectable()
export class AuthRepositoryImpl implements AuthRepository {
  constructor(
    @InjectModel(ModelName.AUTH) private _authModel: Model<AuthDocument>,
  ) {
  }

  async findOne(filter: Partial<AuthEntity>): Promise<AuthAggregate | null> {
    const document = await this._authModel.findOne(filter);
    if (!document) return null;
    return new AuthAggregate(document);
  }

  async create(auth: AuthAggregate): Promise<void> {
    await this._authModel.create(auth);
  }
}
