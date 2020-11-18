import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRestaurantDto } from '../dtos/create-restaurant.dto';
import { UpdateRestaurantDto } from '../dtos/update-restaurant.dto';
import { Restaurant } from './restaurant.entity';

@Injectable()
export class RestaurantService {
  constructor(
    @InjectRepository(Restaurant) //@InjectRepository()를 사용하여 TypeORM Entity를 Repository로 사용할 수 있다.
    private readonly restaurants: Repository<Restaurant>,
  ) {}

  getAll(): Promise<Restaurant[]> {
    return this.restaurants.find();
  }

  createRestaurant(
    createRestaurantDto: CreateRestaurantDto,
  ): Promise<Restaurant> {
    //Repository의 create 함수는 DB는 전혀 건들지 않는다 단지, 새로운 instance를 생성한다.
    //대신, 사용이 간단하다.
    const newRestaurant = this.restaurants.create(createRestaurantDto);
    //save() 가 return type이 Promise이기 때문에 createRestaurant method의 리턴 타입도 Promise
    return this.restaurants.save(newRestaurant);
  }

  updateRestaurant({ id, data }: UpdateRestaurantDto): Promise<any> {
    //update()의 첫 번째 인자: 업데이트 치고자 하는 놈을 찾는다. id=ObejctID
    //update()의 두 번째 인자: 업데이트 칠 데이터를 넣는다.
    //또 하나 중요한건 update가 Promise로 리턴하는데 일단 이 update()는
    //DB에 저 id를 가지고 있는 레코드가 있는지 없는지 신경을 안쓴다. 확인을 안한다.
    return this.restaurants.update(id, { ...data });
  }
}
