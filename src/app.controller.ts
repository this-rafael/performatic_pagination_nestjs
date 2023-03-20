import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('list-model-a')
  async getModelsAList() {
    return this.appService.getListOfModelsA();
  }

  @Get('page-model-a')
  async getModelsAListWithPagination() {
    return this.appService.getPageOfModelsA();
  }

  @Get('list-model-b')
  async getModelsBList() {
    return this.appService.getModelsBList();
  }

  @Get('page-model-b')
  async getModelsBListWithPagination() {
    return this.appService.getModelsBListWithPagination();
  }

  @Get('async-list-model-b')
  async getModelsBListAsync() {
    return this.appService.getModelsBListAsync();
  }

  @Get('async-page-model-b')
  async getModelsBListAsyncWithPagination() {
    return this.appService.getModelsBListWithPaginationAsync();
  }
}
