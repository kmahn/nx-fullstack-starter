import { Provider } from '@nestjs/common';
import { getModelToken, MongooseModule, MongooseModuleOptions } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { connect, Connection, Document, Model } from 'mongoose';
import { ModelName } from '../enum';
import { models } from '../models';

let mongod: MongoMemoryServer | null = null;
let connection: Connection | null = null;

export async function createMongooseTestingModules(options: MongooseModuleOptions = {}) {
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  connection = (await connect(uri)).connection;

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
  if (!connection) throw new Error('Call createMongooseTestingModules');
  const schema = models.find(model => model.name === modelName)?.schema;
  if (!schema) throw new Error('Schema Not Found');
  return connection.model<T>(modelName, schema);
}

export async function removeAll() {
  if (!connection) throw new Error('Call createMongooseTestingModules');
  const collections = connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({});
  }
}

export async function closeMongooseTestingConnection() {
  await connection.dropDatabase();
  await connection.close();
  await mongod.stop();
}
