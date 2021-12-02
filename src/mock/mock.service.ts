import { Injectable } from '@nestjs/common';
import * as faker from 'faker/locale/ko';
import { CreateUserDto } from 'src/api/user/dtos/create-user.dto';
import { UserService } from 'src/api/user/user.service';

@Injectable()
export class MockService {
  constructor(private readonly userService: UserService) {}

  async dummy(count: number): Promise<void> {
    let users: CreateUserDto[] = [];

    users = Array.from({ length: count }, () => {
      return {
        email: faker.internet.email(),
        name: faker.name.lastName() + faker.name.firstName(),
        password: '123',
        tel: faker.phone.phoneNumber('010-####-####'),
        role: 0,
        employeeId: faker.finance.routingNumber(),
        department: faker.name.jobArea(),
        position: faker.name.jobTitle(),
      };
    });

    try {
      await Promise.all(
        users.map(async user => await this.userService.createOne(user)),
      );
    } catch (error) {
      console.log(`error: ${error}`);
    }

    return;
  }
}
