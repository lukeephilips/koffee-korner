import { Injectable, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from 'src/events/entities/event.entity';
import { COFFEE_BRANDS } from './coffees.constants';
import { CoffeesController } from './coffees.controller';
import { CoffeesService } from './coffees.service';
import { Coffee } from './entities/coffee.entity';
import { Flavor } from './entities/flavor.entity';

@Injectable()
export class CoffeeBrandsFactory {
  create() {
    return  ['Transylvania Roasters', 'SF Roasters', 'Big Boi Roasters']
  }
}
@Module({
  imports: [TypeOrmModule.forFeature([Coffee, Flavor, Event]), ConfigModule], 
  controllers: [CoffeesController],
  providers: [
    CoffeesService, 
    CoffeeBrandsFactory,
    {
      provide: COFFEE_BRANDS,
      useFactory: async (coffeeBrandsFactory: CoffeeBrandsFactory) => coffeeBrandsFactory.create(),
      inject: [CoffeeBrandsFactory]
    }
  ],
  exports: [CoffeesService],
})
export class CoffeesModule { }
