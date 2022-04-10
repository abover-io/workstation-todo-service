import {
  Table,
  Model,
  Column,
  DataType,
  HasMany,
  CreatedAt,
  UpdatedAt,
  DeletedAt,
} from 'sequelize-typescript';

import Todo from './todo';

@Table({
  tableName: 'todo_lists',
  modelName: 'TodoList',
  underscored: true,
  timestamps: true,
  paranoid: true,
})
class TodoList extends Model<TodoList> {
  @Column({
    type: DataType.UUIDV4,
    primaryKey: true,
  })
  id: string;

  @Column
  user_id: number;

  @Column
  title: string;

  @CreatedAt
  @Column
  created_at: Date;

  @UpdatedAt
  @Column
  updated_at: Date;

  @DeletedAt
  @Column
  deleted_at: Date;

  @HasMany(() => Todo)
  todos: Todo[];
}

export default TodoList;
