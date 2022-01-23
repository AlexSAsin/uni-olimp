import { Table, Column, Model, DataType, ForeignKey, PrimaryKey, AutoIncrement, BelongsTo } from 'sequelize-typescript';

import Users from './Users.model';
import Posts from './Posts.model';

@Table({
  paranoid: false,
  timestamps: false,
  createdAt: false,
  updatedAt: false,
})
export default class PostsLikes extends Model {
  @AutoIncrement
  @PrimaryKey
  @Column(DataType.INTEGER)
  id: number;

  @ForeignKey(() => Posts)
  @Column(DataType.INTEGER)
  postId: number;

  @BelongsTo(() => Posts)
  post: Posts;

  @ForeignKey(() => Users)
  @Column(DataType.INTEGER)
  userId: number;

  @Column(DataType.INTEGER)
  value: number;
}
