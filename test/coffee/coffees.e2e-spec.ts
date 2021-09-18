import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { CoffeesModule } from '../../src/coffees/coffees.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as request from 'supertest';
import { HttpExceptionFilter } from '../../src/common/filters/http-exception.filter';
import { WrapResponseInterceptor } from '../../src/common/interceptors/wrap-response.interceptor';
import { TimeoutInterceptor } from '../../src/common/interceptors/timeout.interceptor';
import { CreateCoffeeDto } from 'src/coffees/dto/create-coffee.dto';

describe('[Feature] Coffees - /coffees', () => {
  const coffee = {
    brand: 'SF Roasters',
    name: 'Hobo roast',
    flavors: ['trash', 'cigarettes'],
  };
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        CoffeesModule,
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: 'localhost',
          port: 5433,
          username: 'postgres',
          password: 'pass123',
          database: 'postgres',
          autoLoadEntities: true,
          synchronize: true,
        }),
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: {
          enableImplicitConversion: true,
        },
      }),
    );
    app.useGlobalFilters(new HttpExceptionFilter());
    app.useGlobalInterceptors(
      new WrapResponseInterceptor(),
      new TimeoutInterceptor(),
    );
    await app.init();
  });

  it('/coffees (POST)', () => {
    return request(app.getHttpServer())
      .post('/coffees')
      .send(coffee as CreateCoffeeDto)
      .expect(HttpStatus.CREATED);
  });

  // it('/coffees (GET)', () => {
  //   return request(app.getHttpServer())
  //     .get('/coffees')
  //     .set('Authorization', 'shitberg')
  //     .expect(200)
  //     .expect({ data: [] });
  // });

  // it('/coffees/:id (GET)', () => {
  //   return request(app.getHttpServer())
  //     .get(`/coffees/1`)
  //     .set('Authorization', 'shitberg')
  //     .expect(200)
  //     .expect({ data: coffee });
  // });

  afterAll(async () => {
    await app.close();
  });
});
