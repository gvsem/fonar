import { Entity, Column, ManyToOne } from 'typeorm';
import { Publication } from '../replique/publication.entity';
import { Replique } from '../replique/replique.entity';
import { User } from '../user/user.entity';

@Entity()
export class Reponse extends Publication {
  @ManyToOne(() => Replique, (replique) => replique.reponses)
  replique: Replique;

  @Column({ type: 'text' })
  text: string;

  @ManyToOne(() => User, (user) => user.repliques)
  creator: User;
}
