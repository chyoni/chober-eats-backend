import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as jwt from 'jsonwebtoken';
import { CreateAccountInput } from './dtos/create-account.dto';
import { LoginInput } from './dtos/login.dto';
import { User } from './entities/user.entity';
import { ConfigService } from '@nestjs/config';
import { JwtService } from 'src/jwt/jwt.service';
import { EditProfileInput } from './dtos/edit-profile.dto';
import { Verification } from './entities/verification.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
    @InjectRepository(Verification)
    private readonly verifications: Repository<Verification>,
    private readonly config: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async createAccount({
    email,
    password,
    role,
  }: CreateAccountInput): Promise<{ ok: boolean; error?: string }> {
    try {
      const exists = await this.users.findOne({ email });
      if (exists) {
        return { ok: false, error: 'This email is already taken 😫' };
      }
      const newUser = this.users.create({ email, password, role });
      await this.users.save(newUser);
      await this.verifications.save(
        this.verifications.create({
          user: newUser,
        }),
      );
      return { ok: true };
    } catch (e) {
      return { ok: false, error: 'Something wrong with create account 😫' };
    }
  }

  async login({
    email,
    password,
  }: LoginInput): Promise<{ ok: boolean; error?: string; token?: string }> {
    try {
      const user = await this.users.findOne({ email });
      if (!user) {
        return {
          ok: false,
          error: 'User not found',
        };
      }
      const passwordCorrect = await user.checkPassword(password);
      if (!passwordCorrect) {
        return {
          ok: false,
          error: 'Wrong password',
        };
      }
      const token = this.jwtService.sign(user.id);
      return {
        ok: true,
        token,
      };
    } catch (error) {
      return {
        ok: false,
        error,
      };
    }
  }

  findUserById(id: number): Promise<User> {
    return this.users.findOne({ id });
  }

  async editProfile(
    userId: number,
    { email, password }: EditProfileInput,
  ): Promise<User> {
    const user = await this.users.findOne({ id: userId });
    if (email) {
      user.email = email;
      user.verified = false;
      await this.verifications.save(
        this.verifications.create({
          user,
        }),
      );
    }
    if (password) {
      user.password = password;
    }
    //update는 entity에 접근하지 않고 즉, DB에 entity가 있는지 없는지 판단하지 않고 !
    //query만 날리기 때문에 entity없으면 그냥 없고 마는건데 그렇기 때문에
    //password를 변경할 때, hash가 안먹히는 것 @beforeUpdate decorator를 사용하더라도
    //그러면 어떻게 해야하냐 ? save()를 사용하면 된다. 얘는 DB에 직접 접근해서
    //저장하려는 entity가 없으면 insert시켜버리고 있으면 update를 시켜버린다
    //정확히 우리가 원하는 것
    return this.users.save(user);
  }
}
