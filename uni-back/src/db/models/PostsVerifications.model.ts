import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  DefaultScope,
  PrimaryKey,
  AutoIncrement,
  BelongsTo,
} from 'sequelize-typescript';

import Posts from './Posts.model';
@DefaultScope(() => ({
  attributes: ['id', 'result', 'reason'],
  order: [['id', 'DESC']],
}))
@Table
export default class PostsVerifications extends Model {
  @AutoIncrement
  @PrimaryKey
  @Column(DataType.INTEGER)
  id: number;

  @ForeignKey(() => Posts)
  @Column(DataType.INTEGER)
  postId: number;

  @BelongsTo(() => Posts)
  post: Posts;

  @Column(DataType.BOOLEAN)
  result: boolean;

  @Column(DataType.STRING)
  reason: string | null;
}
