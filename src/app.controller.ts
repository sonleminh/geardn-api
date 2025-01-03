import { Controller, Get, Param, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { QueryParamDto } from './app/dtos/query-params.dto';
import { Types } from 'mongoose';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get(':slug.:id')
  getResourceByParams(
    @Param('slug') slug: string,
    @Param('id') id: Types.ObjectId,
    @Query() queryParam: QueryParamDto,
  ) {
    return this.appService.getResourceByParams(slug, id, queryParam);
  }
}
