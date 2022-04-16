import { Column, PrimaryGeneratedColumn } from 'typeorm';

export abstract class Publication {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'timestamptz',
  })
  creationDate: Date;

  @Column({
    type: 'timestamptz',
    nullable: true,
  })
  publicationDate: Date;

  @Column()
  isActive: boolean;

  @Column()
  isPublished: boolean;
}
