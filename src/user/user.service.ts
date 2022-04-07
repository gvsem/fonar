import { forwardRef, Injectable, NotImplementedException } from "@nestjs/common";
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from "./user.entity";
import { CreateUserDto } from "./dto/create.user.dto";
import { UpdateUserDto } from "./dto/update.user.dto";

@Injectable()
export class UserService {
  @InjectRepository(User)
  private userRepository: Repository<User>;

  getUser(userId: number, username: string): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { login: username } } );
  }

  updateUser(userId: number, userDto: UpdateUserDto ) :  Promise<User | undefined> {
    throw new NotImplementedException();
  }

  createUser(userDto: CreateUserDto ) :  Promise<User | undefined> {
    throw new NotImplementedException();
  }

}

