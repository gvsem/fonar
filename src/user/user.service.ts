import {
  ConflictException,
  forwardRef,
  Injectable,
  NotFoundException,
  NotImplementedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from './user.entity';
import { CreateUserDto } from './dto/create.user.dto';
import { UpdateUserDto } from './dto/update.user.dto';
import { Replique } from '../replique/replique.entity';

@Injectable()
export class UserService {
  @InjectRepository(User)
  private userRepository: Repository<User>;

  async getUserByAuthId(authId: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { foreignAuthId: authId },
    });
    if (user === undefined) {
      throw new NotFoundException(
        'User with authId "' + authId + '" not found.',
      );
    }
    return user;
  }

  async getUserByURL(pageURL: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { pageURL: pageURL },
    });
    if (user === undefined) {
      throw new NotFoundException(
        'User with pageURL "' + pageURL + '" not found.',
      );
    }
    return user;
  }

  async getUser(userId: number, username?: string): Promise<User> {
    if (username === undefined) {
      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (user === undefined) {
        throw new NotFoundException('User with id "' + userId + '" not found.');
      }
      return user;
    } else {
      const user = await this.userRepository.findOne({
        where: { login: username },
      });
      if (user === undefined) {
        throw new NotFoundException(
          'User with login "' + username + '" not found.',
        );
      }
      return user;
    }
  }

  async checkEmail(email: string): Promise<boolean> {
    const user = await this.userRepository.findOne({ where: { email: email } });
    return user === undefined;
  }

  async checkLogin(login: string): Promise<boolean> {
    const user = await this.userRepository.findOne({ where: { login: login } });
    return user === undefined;
  }

  async updateUser(userId: number, userDto: UpdateUserDto): Promise<User> {
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

  async createUser(
    userDto: CreateUserDto,
    foreignAuthId?: string,
  ): Promise<User> {
    const existingUser = await this.userRepository
      .createQueryBuilder('CheckingLoginEmailDuplicates')
      .where('"login" = :login', { login: userDto.login })
      .orWhere('"email" = :email', { email: userDto.email })
      .getOne();

    if (existingUser !== undefined) {
      if (existingUser.email === userDto.email) {
        throw new ConflictException(
          'User with email "' + userDto.email + '" already exists.',
        );
      }
      if (existingUser.login === userDto.login) {
        throw new ConflictException(
          'User with login "' + userDto.login + '" already exists.',
        );
      }
    }

    const user = {
      authorAlias: userDto.login,
      email: userDto.email,
      firstName: userDto.firstName,
      lastName: userDto.lastName,
      isActive: true,
      isPrivate: false,
      login: userDto.login,
      pageURL: userDto.login,
      password: userDto.password,
      foreignAuthId: foreignAuthId ?? null,
    };

    return await this.userRepository.save(user);
  }
}
