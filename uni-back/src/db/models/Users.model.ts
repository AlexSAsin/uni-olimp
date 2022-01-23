import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  DefaultScope,
  CreatedAt,
  UpdatedAt,
  DeletedAt,
  Scopes,
  BeforeCreate,
  BeforeUpdate,
  PrimaryKey,
  AutoIncrement,
} from 'sequelize-typescript';
import bcrypt from 'bcrypt';

import UserRoles from './UserRoles.model';

@DefaultScope(() => ({
  attributes: ['id', 'login', 'roleName'],
}))
@Scopes(() => ({
  auth: {
    attributes: ['login', 'password'],
  },
}))
@Table
export default class Users extends Model {
  @AutoIncrement
  @PrimaryKey
  @Column(DataType.INTEGER)
  id: number;

  @Column(DataType.TEXT)
  login: string;

  @Column(DataType.TEXT)
  password: string;

  @ForeignKey(() => UserRoles)
  @Column(DataType.STRING)
  roleName: 'admin' | 'user';

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @DeletedAt
  deletedAt: Date;

  @BeforeCreate
  @BeforeUpdate
  static cryptPassword(instance: Users) {
    if (instance.password !== undefined) {
      const salt = bcrypt.genSaltSync();
      const pswd = bcrypt.hashSync(instance.password, salt);
      instance.password = pswd;
    }
  }
}
