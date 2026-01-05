import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity('news')
export class News {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 80 })
  title: string;

  @Column({ type: 'text' })
  excerpt: string;

  @Column({ type: 'varchar', length: 255 })
  content: string;

  @Column({ type: 'text' })
  image: string;

  @Column({ type: 'varchar', length: 100 })
  author: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
