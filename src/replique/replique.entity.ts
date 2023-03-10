import {
  Entity,
  Column,
  ManyToOne,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Publication } from './publication.entity';
import { User } from '../user/user.entity';
import { Reponse } from '../reponse/reponse.entity';

@Entity()
export class Replique extends Publication {
  @Column({ nullable: false })
  title: string;

  @Column({ type: 'text', nullable: true, default: null })
  abstractText: string;

  @Column({ type: 'text', nullable: true, default: null })
  content: string;

  @ManyToOne(() => User, (user) => user.repliques)
  creator: User;

  @ManyToMany(() => Replique)
  @JoinTable()
  discours: Replique[];

  @OneToMany(() => Reponse, (reponse) => reponse.replique)
  reponses: Reponse[];

  public getRepliqueURL(): string {
    if (this.creator !== undefined) {
      return this.creator.getPageURL() + '/' + this.id;
    }
    return '';
  }

  public creationDateTimestamp() : number {
    return this.creationDate?.getTime();
  }

  public publishedDateTimestamp() : number {
    return this.publicationDate?.getTime();
  }

}
