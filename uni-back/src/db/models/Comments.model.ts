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
  HasMany,
  AllowNull,
  Scopes,
} from 'sequelize-typescript';

import Users from './Users.model';
import Posts from './Posts.model';
import DeletedComments from './DeletedComments.model';

@DefaultScope(() => ({
  attributes: ['id', 'postId', 'parentCommentId', 'content', 'updatedAt'],
  include: {
    model: Users,
    attributes: ['id', 'login'],
  },
}))
@Scopes(() => ({
  alert: {
    attributes: ['id', 'content', 'updatedAt'],
    include: {
      model: Users,
      attributes: ['id', 'login'],
    },
  },
  detail: {
    attributes: ['id', 'postId', 'parentCommentId', 'content', 'updatedAt'],
    include: [
      {
        model: Users,
        attributes: ['id', 'login'],
      },
      {
        model: Comments,
        attributes: ['id'],
      },
    ],
  },
}))
@Table
export default class Comments extends Model {
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
  ownerId: number;

  @BelongsTo(() => Users)
  owner: Users;

  @AllowNull
  @ForeignKey(() => Comments)
  @Column(DataType.INTEGER)
  parentCommentId: number;

  @HasMany(() => Comments)
  childsComments: Comments[];

  @HasMany(() => DeletedComments)
  deletes: DeletedComments[];

  @Column(DataType.INTEGER)
  content: number;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @DeletedAt
  deletedAt: Date;
}
