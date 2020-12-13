import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { Dish } from '../entities/dish.entity';

@InputType()
export class CreateDishInput extends PickType(Dish, [
  'name',
  'price',
  'description',
  'options',
]) {
  //이놈을 PickType에서 가져오지 않은 이유는 PickType은 Field로 설정된 친구들만 Pick 할 수 있는데
  //entity에서 restaurantId는 Field가 아니라 못 가져오기 때문임
  @Field((type) => Number)
  restaurantId: number;
}

@ObjectType()
export class CreateDishOutput extends CoreOutput {}
