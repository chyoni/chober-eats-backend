import { Args, Query, Resolver } from '@nestjs/graphql';
import { Restaurant } from './entities/restaurant.entity';

@Resolver()
export class RestaurantResolver {
  @Query((is) => [Restaurant])
  myRestaurant(@Args('veganOnly') veganOnly: boolean): Restaurant[] {
    return [];
  }
}
