import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne } from 'typeorm';
import { Replique } from './replique.entity';
import { Reponse } from './reponse.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  login: string;

  @Column()
  authorAlias: string;

  @Column()
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

}