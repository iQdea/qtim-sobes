import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { GoogleOauthGuard } from './google-oauth.guard';
import { googleOauthConfig } from './google-oauth.config';
import { AuthService } from '../auth.service';

@Controller('google-oauth')
export class GoogleOauthController {
  constructor(private authService: AuthService) {}

  @Get()
  @UseGuards(GoogleOauthGuard)
  async oauth() {}

  @Get('callback')
  @UseGuards(GoogleOauthGuard)
  async authRedirect(@Req() req, @Res() res) {
    const token = await this.authService.signInUp(req.user);

    res.cookie('access_token', token, {
      // TODO: move to config
      maxAge: 2592000000,
      sameSite: true,
      secure: false,
    });

    res.redirect(googleOauthConfig().webUrl);
  }
}
