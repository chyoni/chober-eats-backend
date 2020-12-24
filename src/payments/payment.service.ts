import { Injectable } from '@nestjs/common';
import { Cron, Interval, SchedulerRegistry, Timeout } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Restaurant } from 'src/restaurants/entities/restaurant.entity';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import {
  CreatePaymentInput,
  CreatePaymentOutput,
} from './dtos/create-payment.dto';
import { GetPaymentsOutput } from './dtos/get-payments.dto';
import { Payment } from './entities/payment.entity';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment) private readonly payments: Repository<Payment>,
    @InjectRepository(Restaurant)
    private readonly restaurants: Repository<Restaurant>,
    private readonly schedulerRegistry: SchedulerRegistry,
  ) {}

  async createPayment(
    owner: User,
    { transactionId, restaurantId }: CreatePaymentInput,
  ): Promise<CreatePaymentOutput> {
    try {
      const restaurant = await this.restaurants.findOne(restaurantId);
      if (!restaurant) {
        return {
          ok: false,
          error: 'Restaurant not found.',
        };
      }
      if (restaurant.ownerId !== owner.id) {
        return {
          ok: false,
          error: 'You are not allowed to do this.',
        };
      }
      await this.payments.save(
        this.payments.create({
          transactionId,
          user: owner,
          restaurant,
        }),
      );
      return {
        ok: true,
      };
    } catch (error) {
      return {
        ok: false,
        error,
      };
    }
  }

  async getPayments(owner: User): Promise<GetPaymentsOutput> {
    try {
      const payments = await this.payments.find({ user: owner });
      return {
        ok: true,
        payments,
      };
    } catch (error) {
      return {
        ok: false,
        error,
      };
    }
  }

  //Cron 은 pattern으로 정해진 시간을 규칙적으로 실행하는 아이
  @Cron('30 * * * * *', {
    name: 'myJob',
  })
  async checkForPayments() {
    console.log('Checking for payments...(cron)');
    const job = this.schedulerRegistry.getCronJob('myJob');
    console.log(job);
  }

  //Interval은 매 5초마다 실행되는 아이
  @Interval(5000)
  async checkForPayments2() {
    console.log('Checking for payments...(interval)');
  }

  //Timeout은 앱이 실행 후 2초가 지나면 딱 1번 실행되는 아이
  @Timeout(2000)
  async checkForPayments3() {
    console.log('Checking for payments...(timeout)');
  }
}
