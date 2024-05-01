import { Controller, Req, Res } from '@nestjs/common';
import { GoogleOauthGuard } from './google-oauth.guard';
import { AuthService } from '../auth.service';
import { ConfigService } from '@nestjs/config';
import { AppConfig } from '../../../config/app.config';
import { ApiTags } from '@nestjs/swagger';
import { EmptyEndpointResponse, Endpoint } from '@qdea/swagger-serializer';

@ApiTags('OAuth')
@Controller('google-oauth')
export class GoogleOauthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService<AppConfig, true>
  ) {}

  @Endpoint('get', {
    summary: 'Аутентификация через гугл',
    protect: {
      enabled: true,
      guards: [GoogleOauthGuard]
    }
  })
  async oauth(): EmptyEndpointResponse {}

  @Endpoint('get', {
    path: 'callback',
    summary: 'Возврат для аутентификации через гугл',
    protect: {
      enabled: true,
      guards: [GoogleOauthGuard]
    }
  })
  async authRedirect(@Req() req, @Res() res) {
    const token = await this.authService.signInUp(req.user);

    res.cookie('access_token', token, this.configService.get('cookie'));

    res.redirect(this.configService.get('webUrl'));
  }
}
