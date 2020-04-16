import supertest from 'supertest';
import { connect, disconnect, connection } from 'mongoose';

import app from '../app';
import { decideMongoURI } from '../config';

const request = supertest(app);

let token: string;
let userId: string;
let todoId: string;

describe('User Model Tests', () => {
  beforeAll(async () => {
    await connect(decideMongoURI(), {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
  });

  test('Sign Up - Success', async () => {
    const signUpData = {
      firstName: 'John',
      lastName: 'Doe',
      username: 'johndoe',
      email: 'john@doe.com',
      password: 'johndoe'
    };
    const response = await request.post('/users/signup').send(signUpData);
    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toBe('Successfully signed up!');
  });

  test('Sign In - Success', async () => {
    const signInData = {
      userIdentifier: 'johndoe',
      password: 'johndoe'
    };
    const response = await request.post('/users/signin').send(signInData);
    expect(response.body).toHaveProperty('user');
    expect(response.body).toHaveProperty('message');
    expect(response.body).toHaveProperty('token');
    token = response.body.token;
    userId = response.body.user._id;
  });

  test('Sign In - User Not Found', async () => {
    const signInData = {
      userIdentifier: 'doejohn',
      password: 'doejohn'
    };
    const response = await request.post('/users/signin').send(signInData);
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toBe('User not found, please sign up first!');
  });

  test('Sign In - Wrong Username or Password', async () => {
    const signInData = {
      userIdentifier: 'johndoe',
      password: 'doejohn'
    };
    const response = await request.post('/users/signin').send(signInData);
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toBe('Wrong username or password!');
  });

  test('Check User Token - Success', async () => {
    const response = await request.get('/users/check').set('token', token);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toBe('User is verified!');
  });

  test('Check User Token - Failed', async () => {
    const fakeToken = 'a'.repeat(token.length);
    const response = await request.get('/users/check').set('token', fakeToken);
    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toBe('User is not verified!');
  });

  test('Update Profile - Success', async () => {
    const updateProfileData = {
      firstName: 'Jackie',
      lastName: 'Chen',
      username: 'jackiechen',
      email: 'jackiechen'
    };
    const response = await request
      .put(`/users/${userId}`)
      .send(updateProfileData)
      .set('token', token);
    expect(response.body).toHaveProperty('user');
    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toBe('Successfully updated user!');
  });

  test('Update Password - Success', async () => {
    const updatePasswordData = {
      password: 'jackiechen'
    };
    const response = await request
      .patch(`/users/${userId}`)
      .send(updatePasswordData)
      .set('token', token);
    expect(response.body).toHaveProperty('user');
    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toBe('Successfully updated user password!');
  });

  afterAll(async () => {
    await disconnect();
  });
});

describe('Todo Model Test', () => {
  beforeAll(async () => {
    await connect(decideMongoURI(), {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
  });

  test('Create Todo - Success', async () => {
    const createTodoData = {
      name: 'Create Client using Vue.js',
      dueDate: new Date()
    };
    const response = await request
      .post(`/todos/${userId}`)
      .send(createTodoData)
      .set('token', token);
    todoId = response.body.todo._id;
    expect(response.body).toHaveProperty('todo');
    expect(response.body).toHaveProperty('message');
    expect(response.body.todo.name).toBe(createTodoData.name);
    expect(response.body.message).toBe('Successfully created todo!');
  });

  test('Get All Todos - Success', async () => {
    const response = await request.get(`/todos/${userId}`).set('token', token);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('todos');
    expect(Array.isArray(response.body.todos)).toBe(true);
  });

  test('Get a Specified Todo - Success', async () => {
    const response = await request.get(`/todos/${userId}/${todoId}`).set('token', token);
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
      .put(`/todos/${userId}/${todoId}`)
      .send(updateTodoData)
      .set('token', token);
    expect(response.body).toHaveProperty('todo');
    expect(response.body).toHaveProperty('message');
    expect(response.body.todo.name).toBe(updateTodoData.name);
    expect(response.body.message).toBe('Successfully updated todo!');
  });

  test('Delete Todo - Success', async () => {
    const response = await request.delete(`/todos/${userId}/${todoId}`).set('token', token);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('todo');
    expect(response.body).toHaveProperty('message');
    expect(response.body.todo instanceof Object).toBe(true);
    expect(typeof response.body.message).toBe('string');
    expect(response.body.message).toBe('Successfully deleted todo!');
  });

  afterAll(async () => {
    await connection.collection('users').drop();
    await connection.collection('todos').drop();
    disconnect();
  });
});
