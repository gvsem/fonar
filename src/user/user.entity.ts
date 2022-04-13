import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Replique } from '../replique/replique.entity';
import { Reponse } from '../reponse/reponse.entity';
import { Exclude } from "class-transformer";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, default: 'null' })
  login: string;

  @Column({ nullable: false, default: 'null' })
  authorAlias: string;

  @Column({ nullable: false, default: 'null' })
  pageURL: string;

  @Column({ nullable: false, default: 'null' })
  email: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: false })
  isPrivate: boolean;

  @OneToMany(() => Replique, (publication) => publication.creator)
  repliques: Replique[];

  @OneToMany(() => Reponse, (publication) => publication.creator)
  reponses: Reponse[];

  @Exclude()
  @Column({ select: false })
  password: string;
}
