import { InternalServerErrorException } from '@nestjs/common';
import {
  Field,
  InputType,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import * as bcrypt from 'bcrypt';
import { IsEmail, IsEnum, IsString } from 'class-validator';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Order } from 'src/orders/entities/order.entity';
import { Payment } from 'src/payments/entities/payment.entity';
import { Restaurant } from 'src/restaurants/entities/restaurant.entity';
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany } from 'typeorm';

export enum UserRole {
  Owner = 'Owner',
  Client = 'Client',
  Delivery = 'Delivery',
}

registerEnumType(UserRole, { name: 'UserRole' });

@InputType('UserInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class User extends CoreEntity {
  @Column({ unique: true })
  @Field((type) => String)
  @IsEmail()
  email: string;

  //여기서 select:false를 하게되면 findOne을 쓰던 뭘 어찌됐던 이 Entity의 record하나를 찾을 때,
  //해당 필드(select:false로 한 필드)는 찾아주지 않는다. 즉, 데이터에 포함시켜주지 않을 것이다.
  @Column({ select: false })
  @Field((type) => String)
  @IsString()
  password: string;

  @Column({ type: 'enum', enum: UserRole })
  @Field((type) => UserRole)
  @IsEnum(UserRole)
  role: UserRole;

  @Column({ default: false })
  @Field((type) => Boolean)
  verified: boolean;

  @Field((type) => [Restaurant], { nullable: true })
  @OneToMany((type) => Restaurant, (restaurant) => restaurant.owner, {
    nullable: true,
  })
  restaurants?: Restaurant[];

  @Field((type) => [Order], { nullable: true })
  @OneToMany((type) => Order, (order) => order.customer, { nullable: true })
  orders?: Order[];

  @Field((type) => [Payment], { nullable: true })
  @OneToMany((type) => Payment, (payment) => payment.user, { nullable: true })
  payments?: Payment[];

  @Field((type) => [Order], { nullable: true })
  @OneToMany((type) => Order, (order) => order.driver, { nullable: true })
  rides?: Order[];

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword(): Promise<void> {
    if (this.password) {
      try {
        this.password = await bcrypt.hash(this.password, 10);
      } catch (e) {
        console.log(e);
        throw new InternalServerErrorException();
      }
    }
  }

  async checkPassword(password: string): Promise<boolean> {
    try {
      const ok = await bcrypt.compare(password, this.password);
      return ok;
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException();
    }
  }
}
