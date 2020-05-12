import supertest from 'supertest';
import { connect, disconnect, connection } from 'mongoose';

import app from '../app';
import { defaultTestPort, decideMongoURI } from '../config';

const request = supertest.agent(app);

let username: string;
let todoId: string;


describe('Todo Model Tests', () => {
  beforeAll(async () => {
    app.listen(defaultTestPort, () => {
      console.log(`Fancy Todo API Tests\nPORT: ${defaultTestPort}\nUnit: User Model`);
    });
    await connect(decideMongoURI('test'), {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
  });

  test('Sign In - Success', async () => {
    const signInData = {
      userIdentifier: 'jackiechen',
      password: 'jackiechen2'
    };
    const response = await request.post('/users/signin').send(signInData);
    expect(response.body).toHaveProperty('user');
    expect(response.body).toHaveProperty('message');
    expect(response.body).toHaveProperty('tokens');
    expect(response.status).toBe(200);
    username = response.body.user.username;
  });

  test('Create Todo - Success', async () => {
    const createTodoData = {
      name: 'Create Client using Vue.js',
      dueDate: new Date()
    };
    const response = await request
      .post(`/todos/${username}`)
      .send(createTodoData)
    todoId = response.body.todo._id;
    expect(response.body).toHaveProperty('todo');
    expect(response.body).toHaveProperty('message');
    expect(response.body.todo.name).toBe(createTodoData.name);
    expect(response.body.message).toBe('Successfully created todo!');
  });

  test('Get All Todos - Success', async () => {
    const response = await request.get(`/todos/${username}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('todos');
    expect(Array.isArray(response.body.todos)).toBe(true);
  });

  test('Get a Specified Todo - Success', async () => {
    const response = await request.get(`/todos/${username}/${todoId}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('todo');
    expect(response.body.todo instanceof Object).toBe(true);
  });

  test('Update Todo - Success', async () => {
    const updateTodoData = {
      name: 'Install MySQL',
      dueDate: new Date()
    };
    const response = await request
      .put(`/todos/${username}/${todoId}`)
      .send(updateTodoData);
    expect(response.body).toHaveProperty('todo');
    expect(response.body).toHaveProperty('message');
    expect(response.body.todo.name).toBe(updateTodoData.name);
    expect(response.body.message).toBe('Successfully updated todo!');
  });

  test('Delete Todo - Success', async () => {
    const response = await request.delete(`/todos/${username}/${todoId}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('todo');
    expect(response.body).toHaveProperty('message');
    expect(response.body.todo instanceof Object).toBe(true);
    expect(typeof response.body.message).toBe('string');
    expect(response.body.message).toBe('Successfully deleted todo!');
  });

  afterAll(async () => {
    app.close();
    await connection.collection('users').drop();
    await connection.collection('todos').drop();
    await disconnect();
  });
});
