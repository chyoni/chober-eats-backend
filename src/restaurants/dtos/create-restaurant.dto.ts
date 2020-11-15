import { ArgsType, Field, InputType } from '@nestjs/graphql';
import { IsBoolean, IsString, Length } from 'class-validator';

// InputType은 하나의 Object로 표현되지만 ArgumentType은 각각의 프로퍼티를 사용하게끔 할 수 있다.
// 예를 들어, Mutation을 실행할 때, InputType이라면 createRestaurantInput: {name: "", ownerName: ""~}
// 이렇게 작성해야 하지만 ArgumentType은 각각 그냥 따로따로 써도 된다는 말
//@InputType()
@ArgsType()
export class CreateRestaurantDto {
  @Field((type) => String)
  @IsString()
  @Length(5, 10)
  name: string;

  @Field((type) => String)
  @IsString()
  ownerName: string;

  @Field((type) => Boolean, { nullable: true })
  @IsBoolean()
  isGood: boolean;
}
