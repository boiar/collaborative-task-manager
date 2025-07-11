import { IUserRepositoryInterface } from '../../../interfaces/user-repository.interface';
import { UserEntity } from '../../../user.entity';
import { FindOneOptions, FindOptionsWhere } from 'typeorm';

let mockUsers: UserEntity[] = [
  {
    user_id: 1,
    email: 'existing@example.com',
    name: 'Test User',
    password: '$2b$10$fakehashedpassword',
    boards: [],
    notifications: [],
  },
];

export class UserRepositoryStub implements IUserRepositoryInterface {
  async findAll(): Promise<UserEntity[]> {
    return mockUsers;
  }

  async findById(id: number): Promise<UserEntity | null> {
    return mockUsers.find((u) => u.user_id === id) || null;
  }

  async findOne(
    options: FindOneOptions<UserEntity>,
  ): Promise<UserEntity | null> {
    const where = options.where as FindOptionsWhere<UserEntity>;
    return mockUsers.find((u) => u.email === where.email) || null;
  }

  async findOneBy(
    where: FindOptionsWhere<UserEntity> | FindOptionsWhere<UserEntity>[],
  ): Promise<UserEntity | null> {
    if (Array.isArray(where)) {
      return (
        mockUsers.find((u) =>
          where.some((w) => {
            return Object.entries(w).every(([key, value]) => u[key] === value);
          }),
        ) || null
      );
    } else {
      return (
        mockUsers.find((u) => {
          return Object.entries(where).every(
            ([key, value]) => u[key] === value,
          );
        }) || null
      );
    }
  }

  async create(data: Partial<UserEntity>): Promise<UserEntity> {
    const newUser: UserEntity = {
      user_id: mockUsers.length + 1,
      boards: [],
      notifications: [],
      ...data,
    } as UserEntity;
    mockUsers.push(newUser);
    return newUser;
  }

  async save(data: UserEntity): Promise<UserEntity> {
    const index = mockUsers.findIndex((u) => u.user_id === data.user_id);
    if (index > -1) {
      mockUsers[index] = data;
    } else {
      mockUsers.push(data);
    }
    return data;
  }

  async update(id: number, data: Partial<UserEntity>): Promise<UserEntity> {
    const user = await this.findById(id);
    if (!user) throw new Error('User not found');
    const updatedUser = { ...user, ...data };
    await this.save(updatedUser);
    return updatedUser as UserEntity;
  }

  async delete(id: number): Promise<void> {
    mockUsers = mockUsers.filter((u) => u.user_id !== id);
  }
}
