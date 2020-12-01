import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtService } from 'src/jwt/jwt.service';
import { MailService } from 'src/mail/mail.service';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Verification } from './entities/verification.entity';
import { UsersService } from './users.service';

const mockRepository = () => ({
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
});

const mockJwtService = () => ({
  sign: jest.fn(() => 'token'),
  verify: jest.fn(),
});

const mockMailService = () => ({
  sendVerificationEmail: jest.fn(),
});

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe('UserService', () => {
  let service: UsersService;
  let usersRepository: MockRepository<User>;
  let verificationRepository: MockRepository<Verification>;
  let mailService: MailService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository(),
        },
        {
          provide: getRepositoryToken(Verification),
          useValue: mockRepository(),
        },
        {
          provide: JwtService,
          useValue: mockJwtService(),
        },
        {
          provide: MailService,
          useValue: mockMailService(),
        },
      ],
    }).compile();
    service = module.get<UsersService>(UsersService);
    mailService = module.get<MailService>(MailService);
    jwtService = module.get<JwtService>(JwtService);
    usersRepository = module.get(getRepositoryToken(User));
    verificationRepository = module.get(getRepositoryToken(Verification));
  });

  it('be should defined', () => {
    expect(service).toBeDefined();
  });

  describe('createAccount', () => {
    const createAccountArgs = {
      email: '',
      password: '',
      role: 0,
    };
    it('should fail if user exists', async () => {
      usersRepository.findOne.mockResolvedValue({
        id: 1,
        email: 'mock@email.com',
      });
      const result = await service.createAccount(createAccountArgs);
      expect(result).toMatchObject({
        ok: false,
        error: 'This email is already taken 😫',
      });
    });
    it('should create a new user', async () => {
      //mockResolvedValue는 Promise로 리턴되는 값
      //mockReturnValue는 그냥 리턴되는 값
      usersRepository.findOne.mockResolvedValue(undefined);
      usersRepository.create.mockReturnValue(createAccountArgs);
      usersRepository.save.mockResolvedValue(createAccountArgs);
      verificationRepository.create.mockReturnValue({
        user: createAccountArgs,
        code: 'code',
      });
      verificationRepository.save.mockResolvedValue({
        user: createAccountArgs,
        code: 'code',
      });
      const result = await service.createAccount(createAccountArgs);
      expect(usersRepository.create).toHaveBeenCalledTimes(1);
      expect(usersRepository.create).toHaveBeenCalledWith(createAccountArgs);

      expect(usersRepository.save).toHaveBeenCalledTimes(1);
      expect(usersRepository.save).toHaveBeenCalledWith(createAccountArgs);

      expect(verificationRepository.create).toHaveBeenCalledTimes(1);
      expect(verificationRepository.create).toHaveBeenCalledWith({
        user: createAccountArgs,
      });

      expect(verificationRepository.save).toHaveBeenCalledTimes(1);
      expect(verificationRepository.save).toHaveBeenCalledWith({
        user: createAccountArgs,
        code: 'code',
      });

      expect(mailService.sendVerificationEmail).toHaveBeenCalledTimes(1);
      expect(mailService.sendVerificationEmail).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(String),
      );
      expect(result).toEqual({ ok: true });
    });

    it('should fail on exception', async () => {
      usersRepository.findOne.mockRejectedValue(new Error());
      const result = await service.createAccount(createAccountArgs);
      expect(result).toEqual({
        ok: false,
        error: 'Something wrong with create account 😫',
      });
    });
  });

  describe('login', () => {
    const loginArgs = {
      email: '',
      password: '',
    };
    it('should fail if user does not exist', async () => {
      usersRepository.findOne.mockResolvedValue(null);

      const result = await service.login(loginArgs);
      expect(usersRepository.findOne).toHaveBeenCalledTimes(1);
      expect(usersRepository.findOne).toHaveBeenCalledWith(
        expect.any(Object),
        expect.any(Object),
      );
      expect(result).toEqual({
        ok: false,
        error: 'User not found',
      });
    });

    it('should fail if the password is wrong', async () => {
      const mockedUser = {
        checkPassword: jest.fn(() => Promise.resolve(false)),
      };
      usersRepository.findOne.mockResolvedValue(mockedUser);
      const result = await service.login(loginArgs);
      expect(result).toEqual({
        ok: false,
        error: 'Wrong password',
      });
    });

    it('should return token if password correct', async () => {
      const mockedUser = {
        id: 1,
        checkPassword: jest.fn(() => Promise.resolve(true)),
      };
      usersRepository.findOne.mockResolvedValue(mockedUser);
      const result = await service.login(loginArgs);
      expect(jwtService.sign).toHaveBeenCalledTimes(1);
      expect(jwtService.sign).toHaveBeenCalledWith(mockedUser.id);
      expect(result).toEqual({
        ok: true,
        token: 'token',
      });
    });

    it('should fail on findOne exception', async () => {
      usersRepository.findOne.mockRejectedValue(new Error());
      const result = await service.login(loginArgs);
      expect(result).toEqual({
        ok: false,
        error: expect.anything(),
      });
    });
  });

  describe('findUserById', () => {
    it('should return user if user is found', async () => {
      usersRepository.findOne.mockResolvedValue({ id: 1 });
      const result = await service.findUserById(1);
      expect(result).toEqual({ id: 1 });
    });
  });

  describe('getUserById', () => {
    it('should return user if user is found', async () => {
      usersRepository.findOne.mockResolvedValue({ id: 1 });
      const result = await service.getUserById(1);
      expect(result).toEqual({
        ok: true,
        user: { id: 1 },
      });
    });

    it('should fail if user is not found', async () => {
      usersRepository.findOne.mockResolvedValue(undefined);
      const result = await service.getUserById(1);
      expect(result).toEqual({
        ok: false,
        error: `User doesn't exist with this ID 1`,
      });
    });

    it('should fail if exception occurs.', async () => {
      usersRepository.findOne.mockRejectedValue(new Error());
      const result = await service.getUserById(1);
      expect(result).toEqual({
        ok: false,
        error: expect.anything(),
      });
    });
  });

  describe('editProfile', () => {
    it('should change email', async () => {
      const oldUser = {
        verified: true,
        email: 'old@old.com',
      };
      const editArgs = {
        userId: 1,
        input: {
          email: 'new@new.com',
        },
      };
      const newUser = {
        verified: false,
        email: 'new@new.com',
      };
      const newVerification = {
        code: 'code',
        user: newUser,
      };
      usersRepository.findOne.mockResolvedValue(oldUser);
      verificationRepository.create.mockReturnValue(newVerification);
      verificationRepository.save.mockResolvedValue(newVerification);
      await service.editProfile(editArgs.userId, editArgs.input);

      expect(usersRepository.findOne).toHaveBeenCalledTimes(1);
      expect(usersRepository.findOne).toHaveBeenCalledWith({
        id: editArgs.userId,
      });

      expect(verificationRepository.create).toHaveBeenCalledTimes(1);
      expect(verificationRepository.create).toHaveBeenCalledWith({
        user: newUser,
      });
      expect(verificationRepository.save).toHaveBeenCalledTimes(1);
      expect(verificationRepository.save).toHaveBeenCalledWith(newVerification);

      expect(mailService.sendVerificationEmail).toHaveBeenCalledTimes(1);
      expect(mailService.sendVerificationEmail).toHaveBeenCalledWith(
        newUser.email,
        newVerification.code,
      );
    });

    it('should change password', async () => {
      const oldUser = {
        userId: 1,
        password: 'old password',
      };
      const inputArgs = {
        userId: 1,
        input: {
          password: 'new password',
        },
      };
      const newUser = {
        userId: 1,
        password: 'new password',
      };
      usersRepository.findOne.mockResolvedValue(oldUser);
      usersRepository.save.mockResolvedValue(newUser);
      const result = await service.editProfile(oldUser.userId, inputArgs.input);
      expect(usersRepository.save).toHaveBeenCalledTimes(1);
      expect(usersRepository.save).toHaveBeenCalledWith(newUser);
      expect(result).toEqual({
        ok: true,
      });
    });

    it('should fail on exception', async () => {
      const inputArgs = {
        userId: 1,
        input: {
          email: 'error@email.com',
        },
      };
      usersRepository.findOne.mockRejectedValue(new Error());
      const result = await service.editProfile(
        inputArgs.userId,
        inputArgs.input,
      );
      expect(result).toEqual({
        ok: false,
        error: expect.anything(),
      });
    });
  });

  it.todo('verifyEmail');
});
