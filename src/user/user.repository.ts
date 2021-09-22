import { EntityRepository, Repository } from 'typeorm';

import { User } from './user.entity';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async getOneByEmail(email: string): Promise<User | undefined> {
    const user = await this.createQueryBuilder('user')
      .where('user.email = (:email)', { email })
      .addSelect('user.password')
      .getOne();

    return user;
  }

  async deleteOneById(userId: number): Promise<void> {
    await this.createQueryBuilder()
      .softDelete()
      .where('id = (:userId)', { userId })
      .execute();
  }
}
