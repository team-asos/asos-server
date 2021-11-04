import { EntityRepository, Repository } from 'typeorm';

import { SearchUserDto } from './dtos/search-user.dto';
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

  async search(search: SearchUserDto): Promise<User[]> {
    const { email, name, employeeId, department, position } = search;

    const users = await this.createQueryBuilder('user')
      .where(email ? 'user.email LIKE (:email)' : '1=1', {
        email: `%${email}%`,
      })
      .andWhere(name ? 'user.name LIKE (:name)' : '1=1', { name: `%${name}%` })
      .andWhere(employeeId ? 'user.employeeId LIKE (:employeeId)' : '1=1', {
        employeeId: `%${employeeId}%`,
      })
      .andWhere(department ? 'user.department LIKE (:department)' : '1=1', {
        department: `%${department}%`,
      })
      .andWhere(position ? 'user.position LIKE (:position)' : '1=1', {
        position: `%${position}%`,
      })
      .getMany();

    return users;
  }

  async deleteOneById(userId: number): Promise<void> {
    await this.createQueryBuilder()
      .softDelete()
      .where('id = (:userId)', { userId })
      .execute();
  }
}
