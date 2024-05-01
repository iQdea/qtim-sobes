import { Controller, HttpStatus } from '@nestjs/common';
import { AppService } from './app.service';
import { Endpoint } from '@qdea/swagger-serializer';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Endpoint('get', {
    summary: 'default path',
    default_response: {
      status: HttpStatus.OK,
      schema: {
        type: 'string'
      }
    }
  })
  async getHello(): Promise<string> {
    return await this.appService.getHello();
  }
}
