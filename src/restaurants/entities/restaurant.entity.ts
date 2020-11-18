import { Field, ObjectType } from '@nestjs/graphql';
import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
@Entity()
export class Restaurant {
  @PrimaryGeneratedColumn()
  @Field((type) => Number)
  @IsNumber()
  id: number;

  @Field((type) => String)
  @Column()
  @IsString()
  @Length(5, 10)
  name: string;

  //nullable은 말그대로 null이 가능하냐마냐를 묻는거고,
  //defaultValue는 DTO에 애시당초에 값이 들어감 거기서 변경을 하지 않는이상 이 필드는
  //DTO에 추가되서 데이터베이스에 들어간다.
  @Field((type) => Boolean, { nullable: true, defaultValue: true })
  @Column({ default: true })
  @IsOptional() //해당 필드는 필수가 아닌 옵션
  @IsBoolean()
  isGood?: boolean;

  @Field((type) => String)
  @Column()
  @IsString()
  ownerName: string;
}
