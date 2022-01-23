import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  PrimaryKey,
  AutoIncrement,
  BelongsTo,
  DeletedAt,
  UpdatedAt,
  CreatedAt,
  DefaultScope,
  AllowNull,
} from 'sequelize-typescript';

import Users from './Users.model';
import Posts from './Posts.model';
import Comments from './Comments.model';

@Table
export default class Alerts extends Model {
  @AutoIncrement
  @PrimaryKey
  @Column(DataType.INTEGER)
  id: number;

  @Column(DataType.STRING)
  title: string;

  @Column(DataType.STRING)
  level: 'error' | 'success' | 'info';

  @AllowNull
  @Column(DataType.STRING)
  reason: string;

  @AllowNull
  @Column(DataType.BOOLEAN)
  viewed: boolean;

  @ForeignKey(() => Users)
  @Column(DataType.INTEGER)
  userId: number;

  @BelongsTo(() => Users, 'userId')
  user: Users;

  @AllowNull
  @ForeignKey(() => Posts)
  @Column(DataType.INTEGER)
  postId: number;

  @BelongsTo(() => Posts, 'postId')
  post: Posts;

  @AllowNull
  @ForeignKey(() => Comments)
  @Column(DataType.INTEGER)
  comment1Id: number;

  @BelongsTo(() => Comments, 'comment1Id')
  comment1: Comments;

  @AllowNull
  @ForeignKey(() => Comments)
  @Column(DataType.INTEGER)
  comment2Id: number;

  @BelongsTo(() => Comments, 'comment2Id')
  comment2: Comments;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @DeletedAt
  deletedAt: Date;
}
