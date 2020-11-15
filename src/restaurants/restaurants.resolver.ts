import { Query, Resolver } from '@nestjs/graphql';
import { Restaurant } from './entities/restaurant.entity';

@Resolver()
export class RestaurantResolver {
  @Query((is) => Restaurant)
  myRestaurant(): Restaurant {
    return {
      name: 'Sexy Restaurant',
    };
  }
}
