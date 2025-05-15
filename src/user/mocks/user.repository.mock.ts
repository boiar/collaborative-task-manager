import { IUserRepositoryInterface } from '../interfaces/user-repository.interface';
import { UserEntity } from '../user.entity';
import { mockUserData } from './mock-user-data'; // Adjust the path if needed

export class MockUserRepository implements IUserRepositoryInterface {
  private users: UserEntity[] = [mockUserData];

  findAll(): Promise<UserEntity[]> {
    return Promise.resolve(this.users);
  }

  findById(id: number): Promise<UserEntity | null> {
    const user = this.users.find((u) => u.user_id === id) || null;
    return Promise.resolve(user);
  }

  findOne(options: any): Promise<UserEntity | null> {
    const user =
      this.users.find((u) => u.user_id === options?.where?.user_id) || null;
    return Promise.resolve(user);
  }

  findOneBy(where: any): Promise<UserEntity | null> {
    if (Array.isArray(where)) {
      for (const w of where) {
        const match = this.users.find((u) => u.user_id === w.user_id);
        if (match) return Promise.resolve(match);
      }
      return Promise.resolve(null);
    }

    const user = this.users.find((u) => u.user_id === where.user_id) || null;
    return Promise.resolve(user);
  }

  create(data: Partial<UserEntity>): Promise<UserEntity> {
    const newUser = { ...new UserEntity(), ...data } as UserEntity;
    newUser.user_id = this.users.length + 1;
    this.users.push(newUser);
    return Promise.resolve(newUser);
  }

  async delete(id: number): Promise<void> {
    this.users = this.users.filter((u) => u.user_id !== id);
  }

  async update(id: number, data: Partial<UserEntity>): Promise<UserEntity> {
    const index = this.users.findIndex((u) => u.user_id === id);
    if (index === -1) throw new Error('User not found');
    this.users[index] = { ...this.users[index], ...data };
    return this.users[index];
  }

  save(data: UserEntity): Promise<UserEntity> {
    const index = this.users.findIndex((u) => u.user_id === data.user_id);
    if (index !== -1) {
      this.users[index] = data;
    } else {
      this.users.push(data);
    }
    return Promise.resolve(data);
  }
}
