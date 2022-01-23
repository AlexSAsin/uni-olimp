// тут мега кривой и костыльный момент с последней валидацией

import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  CreatedAt,
  UpdatedAt,
  DeletedAt,
  Scopes,
  PrimaryKey,
  AutoIncrement,
  BelongsTo,
  HasMany,
} from 'sequelize-typescript';

import Users from './Users.model';
import PostsLikes from './PostsLikes.model';
import PostsVerifications from './PostsVerifications.model';
import Comments from './Comments.model';

@Scopes(() => ({
  alert: () => ({
    attributes: ['id', 'title', 'content', 'updatedAt'],
    include: {
      model: Users,
      attributes: ['id', 'login'],
    },
  }),
  manage: {
    attributes: ['id', 'title', 'content', 'updatedAt', 'lastVerification'],
    include: [
      {
        model: PostsVerifications,
        attributes: ['id', 'result', 'reason'],
        order: [['id', 'DESC']],
      },
      {
        model: Users,
        attributes: ['id', 'login'],
      },
    ],
  },
  view: {
    attributes: ['id', 'title', 'content', 'updatedAt', 'lastVerification', 'viewsCount'],
    include: [
      {
        model: PostsVerifications,
        attributes: ['id', 'result', 'reason'],
        order: [['id', 'DESC']],
      },
      {
        model: Users,
        attributes: ['id', 'login'],
      },
      {
        model: PostsLikes,
        attributes: ['userId', 'value'],
      },
      {
        model: Comments,
        attributes: ['id'],
      },
    ],
  },
  detail: {
    attributes: ['id', 'title', 'content', 'updatedAt', 'lastVerification', 'viewsCount'],
    include: [
      {
        model: PostsVerifications,
        attributes: ['id', 'result', 'reason'],
        order: [['id', 'DESC']],
      },
      {
        model: Users,
        attributes: ['id', 'login'],
      },
      {
        model: PostsLikes,
        attributes: ['userId', 'value'],
      },
      {
        model: Comments,
      },
    ],
  },
}))
@Table
export default class Posts extends Model {
  @AutoIncrement
  @PrimaryKey
  @Column(DataType.INTEGER)
  id: number;

  @Column(DataType.STRING)
  title: string;

  @Column(DataType.STRING)
  content: string;

  @ForeignKey(() => Users)
  @Column(DataType.INTEGER)
  ownerId: number;

  @BelongsTo(() => Users)
  owner: Users;

  @HasMany(() => PostsVerifications)
  verification: PostsVerifications[];

  @HasMany(() => PostsLikes)
  likes: PostsLikes[];

  @HasMany(() => Comments)
  comments: Comments[];

  @Column(DataType.INTEGER)
  viewsCount: number;

  // непонятно как сделать что бы возращался не массив а объект
  // + он всегда возрщается даже если его нет в аттрибутах
  // стоит ли это вообще использовать или просто возращать всё что нашлось и там обрабатывать
  // хотя постоянно обрабатывать это плохо, тк это используется часто
  @Column(DataType.VIRTUAL)
  get lastVerification(): PostsVerifications {
    return this.verification === undefined
      ? null
      : this.verification.length == 0
      ? null
      : this.verification.length == 1
      ? this.verification[0]
      : this.verification.reduce((p, c) => (c.id > p.id ? c : p));
  }

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @DeletedAt
  deletedAt: Date;
}
