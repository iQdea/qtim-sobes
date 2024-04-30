import { Controller, Get, Res, UseGuards } from '@nestjs/common';
import { GoogleOauthGuard } from './google-oauth.guard';
import { googleOauthConfig } from './google-oauth.config';

@Controller('google-oauth')
export class GoogleOauthController {
  @Get()
  @UseGuards(GoogleOauthGuard)
  async oauth() {}

  @Get('callback')
  @UseGuards(GoogleOauthGuard)
  async authRedirect(@Res() res) {
    // TODO: move config to constructor
    res.redirect(googleOauthConfig().webUrl);
  }
}
