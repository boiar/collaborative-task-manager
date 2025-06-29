import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
} from 'typeorm';
import { UserEntity } from '../user/user.entity';

@EventSubscriber()
export class AuthSubscriber implements EntitySubscriberInterface<UserEntity> {
  constructor() {
    console.log('✅ AuthSubscriber initialized');
  }

  listenTo() {
    return UserEntity;
  }

  beforeInsert() {
    console.log('New User will insert to db :)');
  }

  afterInsert(event: InsertEvent<UserEntity>) {
    console.log('New User inserted:---', event.entity);
  }
}
