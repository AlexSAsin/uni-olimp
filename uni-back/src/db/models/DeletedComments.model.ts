import { Table, Column, Model, DataType, ForeignKey, PrimaryKey, AutoIncrement, BelongsTo } from 'sequelize-typescript';

import Comments from './Comments.model';

@Table({
  paranoid: false,
  timestamps: false,
  createdAt: false,
  updatedAt: false,
})
export default class DeletedComments extends Model {
  @AutoIncrement
  @PrimaryKey
  @Column(DataType.INTEGER)
  id: number;

  @ForeignKey(() => Comments)
  @Column(DataType.INTEGER)
  commentId: number;

  @BelongsTo(() => Comments)
  comment: Comments;

  @Column(DataType.STRING)
  reason: string;
}
