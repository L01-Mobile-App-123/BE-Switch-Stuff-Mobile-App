import { Injectable, UnauthorizedException } from '@nestjs/common';
import { admin } from '../firebase/firebase-admin';
import { UserService } from '@users/user.service';

@Injectable()
export class AuthService {
  constructor(private userService: UserService) {}

  /**
   * Verify token và tự động tạo user mới nếu chưa có
   */
  async verifyToken(idToken: string) {
    try {
      const decoded = await admin.auth().verifyIdToken(idToken);
      const firebaseUser = await admin.auth().getUser(decoded.uid);
      const user = await this.userService.findOrCreateUser(firebaseUser);
      return user;
    } catch (err) {
      throw new UnauthorizedException('Invalid or expired Firebase token');
    }
  }

  /**
   * Signup - tạo user trên Firebase và trong DB
   */
  async signup(email: string, password: string) {
    const fbUser = await admin.auth().createUser({
      email,
      password,
    });
    return this.userService.createUser({
      uid: fbUser.uid,
      email: fbUser.email,
    });
  }

  /**
   * Logout - chỉ xoá token hiện tại (client cần logout)
   */
  async logout(uid: string) {
    await admin.auth().revokeRefreshTokens(uid);
    return { message: 'User logged out successfully' };
  }
}
