import { forwardRef, Injectable, NotImplementedException } from "@nestjs/common";
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from "./user.entity";
import { CreateUserDto } from "./dto/create.user.dto";
import { UpdateUserDto } from "./dto/update.user.dto";
import { Replique } from "../replique/replique.entity";

@Injectable()
export class UserService {
  @InjectRepository(User)
  private userRepository: Repository<User>;

  async getUser(userId: number, username?: string): Promise<User> {
    if (username === undefined) {
      const user = await this.userRepository.findOne({ where: { id: userId } } );
      if (user === undefined) {
        throw new Error('User with id "' + userId + '" not found.');
      }
      return user;
    } else {
      const user = await this.userRepository.findOne({ where: { login: username } } );
      if (user === undefined) {
        throw new Error('User with login "' + username + '" not found.');
      }
      return user;
    }
  }

  async updateUser(userId: number, userDto: UpdateUserDto ) :  Promise<User> {
    const user = await this.getUser(userId);
    if (userDto.firstName !== undefined) {
      user.firstName = userDto.firstName;
    }
    if (userDto.lastName !== undefined) {
      user.lastName = userDto.lastName;
    }
    if (userDto.authorAlias !== undefined) {
      user.authorAlias = userDto.authorAlias;
    }
    if (userDto.isPrivate !== undefined) {
      user.isPrivate = userDto.isPrivate;
    }
    return await this.userRepository.save(user);
  }

  async createUser(userDto: CreateUserDto) :  Promise<User> {
    const user = new User();
    user.login = userDto.login;
    user.email = userDto.email;
    user.firstName = userDto.firstName;
    user.lastName = userDto.lastName;
    user.password = userDto.password;
    user.authorAlias = user.login;
    user.pageURL = user.login;
    user.isActive = true;
    user.isPrivate = false;
    return await this.userRepository.save(user);
  }

}

