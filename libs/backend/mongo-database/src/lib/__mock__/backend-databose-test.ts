import { DynamicModule, Provider } from '@nestjs/common';
import { getModelToken, MongooseModule, MongooseModuleOptions } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose, { Document, Model } from 'mongoose';
import { ModelName } from '../enum';
import { models } from '../models';

let mongod: MongoMemoryServer | null = null;

export async function startMongooseTestingServer() {
  mongod = await MongoMemoryServer.create();
}

export function createMongooseTestingModules(options: MongooseModuleOptions = {}): DynamicModule[] {
  const uri = mongod.getUri();

  return [
    MongooseModule.forRootAsync({
      useFactory: async () => {
        return { uri, ...options };
      },
    }),
    MongooseModule.forFeature(models)
  ]
}

export function getProvider(...modelNames: ModelName[]): Provider[] {
  return modelNames.map(name => {
    return { provide: getModelToken(name), useValue: getModel(name) };
  });
}

export function getModel<T extends Document>(modelName: ModelName): Model<T> {
  const schema = models.find(model => model.name === modelName)?.schema;
  return mongoose.model<T>(modelName, schema);
}

export async function removeAll() {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({});
  }
}

export async function closeMongooseTestingServer() {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongod.stop();
}
