import {
  Controller,
  Post,
  Body,
  Get,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { FirebaseAuthGuard } from './firebase-auth.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  /**
   * Đăng ký user mới (signup)
   */
  @Post('signUp')
  @ApiOperation({ summary: 'Sign up new user', description: 'Tạo user mới trên Firebase và DB.' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', example: 'user@example.com' },
        password: { type: 'string', example: '123456' },
      },
      required: ['email', 'password'],
    },
  })
  @ApiResponse({ status: 201, description: 'User created successfully' })
  async signup(@Body() body: { email: string; password: string }) {
    return this.authService.signup(body.email, body.password);
  }

  /**
   * Xác thực token Firebase (login hoặc verify)
   */
  @Post('verify')
  @ApiOperation({ summary: 'Verify Firebase ID token', description: 'Xác thực token và trả về thông tin user tương ứng.' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        idToken: { type: 'string', example: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...' },
      },
      required: ['idToken'],
    },
  })
  @ApiResponse({ status: 200, description: 'Token is valid' })
  @ApiResponse({ status: 401, description: 'Invalid or expired token' })
  async verify(@Body() body: { idToken: string }) {
    return this.authService.verifyToken(body.idToken);
  }

  /**
   * Logout user (revoke token)
   */
  @UseGuards(FirebaseAuthGuard)
  @Post('logOut')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Logout user', description: 'Revoke Firebase refresh tokens for the current user.' })
  @ApiResponse({ status: 200, description: 'User logged out successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async logout(@Req() req) {
    return this.authService.logout(req.user.uid);
  }

  /**
   * Test route có bảo vệ (Firebase Guard)
   */
  @UseGuards(FirebaseAuthGuard)
  @Get('getInfo')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user info', description: 'Trả về thông tin user hiện tại từ Firebase token.' })
  @ApiResponse({ status: 200, description: 'User info returned successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async me(@Req() req) {
    return req.user;
  }
}
