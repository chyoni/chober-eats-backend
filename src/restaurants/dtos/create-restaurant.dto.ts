import { ArgsType, Field, InputType } from '@nestjs/graphql';

// InputType은 하나의 Object로 표현되지만 ArgumentType은 각각의 프로퍼티를 사용하게끔 할 수 있다.
// 예를 들어, Mutation을 실행할 때, InputType이라면 createRestaurantInput: {name: "", ownerName: ""~}
// 이렇게 작성해야 하지만 ArgumentType은 각각 그냥 따로따로 써도 된다는 말
//@InputType()
@ArgsType()
export class CreateRestaurantDto {
  @Field((type) => String)
  name: string;
  @Field((type) => String)
  ownerName: string;
  @Field((type) => Boolean, { nullable: true })
  isGood: boolean;
}
