import {
  Table,
  Column,
  Model,
  DataType,
  DefaultScope,
  HasMany,
  CreatedAt,
  UpdatedAt,
  DeletedAt,
  PrimaryKey,
} from 'sequelize-typescript';

import Users from './Users.model';

@DefaultScope(() => ({
  attributes: ['name'],
  order: ['id'],
}))
@Table
export default class UserRoles extends Model {
  @PrimaryKey
  @Column(DataType.TEXT)
  name: 'admin' | 'user';

  @HasMany(() => Users)
  users: Users;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @DeletedAt
  deletedAt: Date;
}
