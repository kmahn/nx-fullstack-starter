import { Global, Inject, Module, OnApplicationBootstrap, OnModuleInit } from '@nestjs/common';
import { ConfigModule, ConfigService, ConfigType } from '@nestjs/config';
import { InjectModel, MongooseModule } from '@nestjs/mongoose';
import { adminConfig, ConfigKey } from '@starter/backend/config';
import { Model } from 'mongoose';
import models, { AuthDocument, UserDocument } from './models';
import { ModelName } from './models/constants';

@Global()
@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (service: ConfigService) => {
        const uri = service.get('MONGO_URI');
        return { uri };
      },
      inject: [ConfigService]
    }),
    MongooseModule.forFeature(models)
  ],
  exports: [
    MongooseModule,
  ],
})
export class BackendMongoDatabaseModule implements OnApplicationBootstrap {

  constructor(
    @Inject(adminConfig.KEY) private _adminConfig: ConfigType<typeof adminConfig>,
    @InjectModel(ModelName.AUTH) private authModel: Model<AuthDocument>,
    @InjectModel(ModelName.USER) private userModel: Model<UserDocument>,
  ) {
  }

  onApplicationBootstrap() {
    this._createAdmin();
  }

  private async _createAdmin() {
    const { email, password, name } = this._adminConfig;
    const existed = await this.userModel.findOne({ email });
    if (!existed) {
      const userDocument = await this.userModel.create({ email, name, role: 'admin' });
      const authDocument = await this.authModel.create({
        providerId: String(userDocument._id),
        password,
        user: userDocument._id
      });
      userDocument.auth = authDocument._id;
      await userDocument.save();
    }
  }
}
