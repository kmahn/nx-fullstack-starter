import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { AuthDocument, ModelName } from '@starter/backend-mongo-database';
import { Model } from 'mongoose';
import { AuthAggregate } from '../../aggregates/auth.aggregate';
import { AuthRepository } from '../interfaces/auth-repository';

@Injectable()
export class AuthRepositoryImpl implements AuthRepository {
  constructor(
    @InjectModel(ModelName.AUTH) private _authModel: Model<AuthDocument>,
  ) {
  }

  async create(auth: AuthAggregate): Promise<void> {
    await this._authModel.create(auth);
  }

  async findById(id: string): Promise<AuthAggregate | null> {
    const document = await this._authModel.findById(id);
    if (!document) return null;
    return new AuthAggregate(document);
  }
}
