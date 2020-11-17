import { Field, ObjectType } from '@nestjs/graphql';
import { IsBoolean, IsNumber, IsString, Length } from 'class-validator';
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

  @Field((type) => Boolean, { nullable: true })
  @Column()
  @IsBoolean()
  isGood?: boolean;

  @Field((type) => String)
  @Column()
  @IsString()
  ownerName: string;
}
