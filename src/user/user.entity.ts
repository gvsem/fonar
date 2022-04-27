import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Replique } from '../replique/replique.entity';
import { Reponse } from '../reponse/reponse.entity';
import { Exclude } from 'class-transformer';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  foreignAuthId: string;

  @Column({ nullable: false })
  login: string;

  @Column({ nullable: true })
  authorAlias: string;

  @Column({ nullable: false })
  pageURL: string;

  @Column({ nullable: false })
  email: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ nullable: true })
  bio: string;

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

  public getPageURL(): string {
    return '/u/' + this.pageURL;
  }
}
