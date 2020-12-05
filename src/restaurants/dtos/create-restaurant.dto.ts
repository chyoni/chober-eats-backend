import { InputType, ObjectType, OmitType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { Restaurant } from '../entities/restaurant.entity';

// InputType은 하나의 Object로 표현되지만 ArgumentType은 각각의 프로퍼티를 사용하게끔 할 수 있다.
// 예를 들어, Mutation을 실행할 때, InputType이라면 createRestaurantInput: {name: "", ownerName: ""~}
// 이렇게 작성해야 하지만 ArgumentType은 각각 그냥 따로따로 써도 된다는 말
//@ArgsType()

//이 부분은 #3.5강의를 보면서 이해해야 좋으니 이해가 안된다면 다시 노마드코더 강의를 볼 것
//일단, OmitType은 특정 Entity에서 Type을 매핑할 때, 어떤 특정 Property만 제외하고 그대로 가져온다는 것
//근데 그 OmitType()의 args를 보면 젤 마지막에 InputType이란게 있음
//그 InputType이 의미하는 것은 Entity는 ObjectType이라 반드시 해당 클래스가 어떤 필드를 가지는지
//명시를 해줘야함 하지만 우리가 원하는건 필드 명시가 아니라 단지 InputDto에 대한것들만 정의하면됨
//그래서 Parent와 Child의 Type이 이처럼, InputType ObjectType으로 다를 때,
//리턴하는 타입을 명시해줄 수 있음 그래서 3번째 args로 InputType을 넣은것
@InputType()
export class CreateRestaurantInput extends OmitType(
  Restaurant,
  ['id', 'owner', 'category'],
  InputType,
) {}

@ObjectType()
export class CreateRestaurantOutput extends CoreOutput {}
