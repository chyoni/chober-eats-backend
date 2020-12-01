import { Test } from '@nestjs/testing';
import { CONFIG_OPTIONS } from 'src/common/common.constants';
import { MailService } from './mail.service';
import * as FormData from 'form-data';
import got from 'got';

const mailModuleOptions = {
  apiKey: 'apiKey',
  domain: 'domain',
  fromEmail: 'fromEmail',
};

jest.mock('got');
jest.mock('form-data');

describe('MailService', () => {
  let service: MailService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        MailService,
        {
          provide: CONFIG_OPTIONS,
          useValue: mailModuleOptions,
        },
      ],
    }).compile();
    service = module.get<MailService>(MailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('sendVerificationEmail', () => {
    it('should call sendEmail', () => {
      const sendVerificationEmailArgs = {
        email: 'email@email.com',
        code: 'code',
      };
      jest.spyOn(service, 'sendEmail').mockImplementation(async () => {
        return true;
      });
      service.sendVerificationEmail(
        sendVerificationEmailArgs.email,
        sendVerificationEmailArgs.code,
      );
      expect(service.sendEmail).toHaveBeenCalledTimes(1);
      expect(service.sendEmail).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(String),
      );
    });
  });

  describe('sendEmail', () => {
    it('should send email', async () => {
      const ok = await service.sendEmail('subject', 'content');
      const formSpy = jest.spyOn(FormData.prototype, 'append');
      const gotSpy = jest.spyOn(got, 'post');
      expect(formSpy).toHaveBeenCalledTimes(4);

      expect(gotSpy).toHaveBeenCalledTimes(1);
      expect(gotSpy).toHaveBeenCalledWith(
        `https://api.mailgun.net/v3/${mailModuleOptions.domain}/messages`,
        expect.any(Object),
      );
      expect(ok).toEqual(true);
    });

    it('fail on error', async () => {
      jest.spyOn(got, 'post').mockImplementation(() => {
        throw new Error();
      });
      const ok = await service.sendEmail('subject', 'content');
      expect(ok).toEqual(false);
    });
  });
});
