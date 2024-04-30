import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { GoogleOauthGuard } from './google-oauth.guard';
import { AuthService } from '../auth.service';
import { ConfigService } from '@nestjs/config';
import { AppConfig } from '../../../config/app.config';

@Controller('google-oauth')
export class GoogleOauthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService<AppConfig, true>
  ) {}

  @Get()
  @UseGuards(GoogleOauthGuard)
  async oauth() {}

  @Get('callback')
  @UseGuards(GoogleOauthGuard)
  async authRedirect(@Req() req, @Res() res) {
    const token = await this.authService.signInUp(req.user);

    res.cookie('access_token', token, this.configService.get('cookie'));

    res.redirect(this.configService.get('webUrl'));
  }
}
