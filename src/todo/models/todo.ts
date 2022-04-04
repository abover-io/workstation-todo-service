import {
  Table,
  Model,
  Column,
  DataType,
  ForeignKey,
  BelongsTo,
  CreatedAt,
  UpdatedAt,
  DeletedAt,
} from 'sequelize-typescript';

import TodoList from './todo-list';

@Table({
  tableName: 'todos',
  modelName: 'Todo',
  underscored: true,
  timestamps: true,
  paranoid: true,
})
class Todo extends Model<Todo> {
  @Column({
    type: DataType.UUIDV4,
    primaryKey: true,
  })
  id: number;

  @ForeignKey(() => TodoList)
  @Column
  list_id: string;

  @BelongsTo(() => TodoList)
  list: TodoList;

  @Column
  name: string;

  @Column
  completed_at: Date;

  @CreatedAt
  @Column
  created_at: Date;

  @UpdatedAt
  @Column
  updated_at: Date;

  @DeletedAt
  @Column
  deleted_at: Date;
}

export default Todo;
