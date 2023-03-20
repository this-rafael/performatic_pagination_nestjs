import { faker } from '@faker-js/faker';
import { Injectable } from '@nestjs/common';
import { PerformaticPaginationModel } from 'performatic_pagination';

export class ModelA {
  id: number;
  uuid: string;
  name: string;
  age: number;
  addressName: string;
  addressStreet: string;
  addressCity: string;
  addressState: string;
  email: string;
  password: string;
  username: string;
  phone: string;
  phone2: string;
  profileUrl: string;

  constructor() {
    this.id = faker.datatype.number();
    this.uuid = faker.datatype.uuid();
    this.name = faker.name.firstName();
    this.age = faker.datatype.number() % 100;
    this.addressName = faker.address.street();
    this.addressStreet = faker.address.streetAddress();
    this.addressCity = faker.address.city();
    this.addressState = faker.address.state();
    this.email = faker.internet.email();
    this.password = faker.internet.password();
    this.username = faker.internet.userName();
    this.phone = faker.phone.number();
    this.phone2 = faker.phone.number();
    this.profileUrl = faker.internet.url();
  }

  static generateMany(count: number): ModelA[] {
    const models: ModelA[] = [];
    for (let i = 0; i < count; i++) {
      models.push(new ModelA());
    }
    return models;
  }
}

export const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

export class ModelB {
  id: number;
  uuid: string;
  name: string;
  age: number;
  addressName: string;
  addressStreet: string;
  addressCity: string;
  addressState: string;
  email: string;
  password: string;
  username: string;
  phone: string;
  phone2: string;
  profileUrl: string;
  gettedAt: Date;

  constructor(modelA: ModelA) {
    this.id = modelA.id;
    this.uuid = modelA.uuid;
    this.name = modelA.name;
    this.age = modelA.age;
    this.addressName = modelA.addressName;
    this.addressStreet = modelA.addressStreet;
    this.addressCity = modelA.addressCity;
    this.addressState = modelA.addressState;
    this.email = modelA.email;
    this.password = modelA.password;
    this.username = modelA.username;
    this.phone = modelA.phone;
    this.phone2 = modelA.phone2;
    this.profileUrl = modelA.profileUrl;
    this.gettedAt = new Date();
  }

  static async mapFromModelA(modelA: ModelA): Promise<ModelB> {
    await delay(1000);
    return new ModelB(modelA);
  }
}

export interface BasicPageResponse<T extends object> {
  data: T[];
  total: number;
  take: number;
  skip: number;
}

@Injectable()
export class AppService {
  public modelsSmallListSize: ModelA[];
  public modelsSmallListSizeLength = 1000;

  public modelsNormalListSize: ModelA[];
  public modelsNormalListSizeLength = 6000;

  public modelsLargeListSize: ModelA[];
  public modelsLargeListSizeLength = 10000;

  public modelsExtraLargeListSize: ModelA[];
  public modelsExtraLargeListSizeLength = 100000;

  constructor() {
    this.modelsSmallListSize = ModelA.generateMany(
      this.modelsSmallListSizeLength,
    ); // 1000 models A
    this.modelsNormalListSize = [
      ...this.modelsSmallListSize,
      ...ModelA.generateMany(
        this.modelsNormalListSizeLength - this.modelsSmallListSizeLength,
      ),
    ]; // 6000 models A
    this.modelsLargeListSize = [
      ...this.modelsNormalListSize,
      ...ModelA.generateMany(
        this.modelsLargeListSizeLength - this.modelsNormalListSizeLength,
      ),
    ]; // 10000 models A

    this.modelsExtraLargeListSize = [
      ...this.modelsLargeListSize,
      ...ModelA.generateMany(
        this.modelsExtraLargeListSizeLength - this.modelsLargeListSizeLength,
      ),
    ]; // 100000 models A
  }

  getHello(): string {
    return 'Hello World!';
  }

  public copyList(list: any[]): any[] {
    return JSON.parse(JSON.stringify(list));
  }

  // GET AN LIST OF MODELS A
  async getListOfModelsA(): Promise<BasicPageResponse<ModelA>> {
    return {
      data: this.modelsLargeListSize,
      skip: 0,
      take: this.modelsLargeListSizeLength,
      total: this.modelsLargeListSizeLength,
    };
  }

  // GET AN PAGE OF MODELS A
  async getPageOfModelsA(): Promise<PerformaticPaginationModel<ModelA>> {
    return PerformaticPaginationModel.fromEntites({
      entries: this.modelsLargeListSize,
      total: this.modelsLargeListSizeLength,
    });
  }

  // GET AN LIST OF MODELS B
  async getModelsBList(): Promise<BasicPageResponse<ModelB>> {
    const take = this.modelsNormalListSizeLength;
    const skip = 0;
    const modelsB: ModelB[] = [];

    for (let i = skip; i < take; i += 1) {
      const elements = this.modelsNormalListSize[i];

      modelsB.push(new ModelB(elements));
    }

    return {
      data: modelsB,
      total: this.modelsNormalListSize.length,
      take,
      skip,
    };
  }

  async getModelsBListWithPagination(): Promise<
    PerformaticPaginationModel<ModelB>
  > {
    const take = 6000;
    const skip = 0;

    return PerformaticPaginationModel.fromSyncFactory({
      data: this.modelsNormalListSize,
      take,
      skip,
      total: this.modelsNormalListSize.length,
      factory: (model) => new ModelB(model),
    });
  }

  async getModelsBListAsync(): Promise<BasicPageResponse<ModelB>> {
    const take = this.modelsExtraLargeListSizeLength;
    const skip = 0;
    const modelsB: Promise<ModelB>[] = [];

    for (let i = skip; i < skip + take; i++) {
      const elements = this.modelsExtraLargeListSize[i];
      modelsB.push(ModelB.mapFromModelA(elements));
    }

    return {
      data: await Promise.all(modelsB),
      total: this.modelsExtraLargeListSizeLength,
      take,
      skip,
    };
  }

  async getModelsBListWithPaginationAsync(): Promise<
    PerformaticPaginationModel<ModelB>
  > {
    const take = 6000;
    const skip = 0;
    return PerformaticPaginationModel.fromAsyncFactory({
      data: this.modelsExtraLargeListSize,
      take,
      skip,
      total: this.modelsExtraLargeListSizeLength,
      asyncFactory: async (model) => ModelB.mapFromModelA(model),
    });
  }
}
