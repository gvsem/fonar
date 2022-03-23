import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Publication } from './publication.entity';
import { Replique } from './replique.entity';
import { User } from './user.entity';

@Entity()
export class Reponse extends Publication {

  @ManyToOne(() => Replique, (replique) => replique.reponses)
  replique: Replique;

  @Column({ type: "text" })
  text: string;

  @ManyToOne(() => User, (user) => user.repliques)
  creator: User;

}