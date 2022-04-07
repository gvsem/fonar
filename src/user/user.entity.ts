import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Replique } from '../replique/replique.entity';
import { Reponse } from '../reponse/reponse.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  login: string;

  @Column({ nullable: false })
  authorAlias: string;

  @Column({ nullable: false })
  pageURL: string;

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

  @Column({ select: false })
  password: string;
}
