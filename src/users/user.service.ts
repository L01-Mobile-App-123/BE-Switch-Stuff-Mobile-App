import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '@entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly repo: Repository<User>,
  ) {}

  async findByUid(uid: string) {
    return this.repo.findOne({ where: { uid } });
  }

  async findOrCreateUser(firebaseUser: any) {
    const uid = firebaseUser.uid;
    let user = await this.findByUid(uid);
    if (user) return user;
    const newUser = this.repo.create({
      uid,
      email: firebaseUser.email,
      displayName: firebaseUser.displayName,
      photoURL: firebaseUser.photoURL,
    });
    return this.repo.save(newUser);
  }

  async createUser(input: { uid: string; email?: string; name?: string }) {
    const u = this.repo.create({
      uid: input.uid,
      email: input.email,
      displayName: input.name,
    });
    return this.repo.save(u);
  }
}
