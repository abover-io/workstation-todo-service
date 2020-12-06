import supertest from 'supertest';

import app from '@/app';
import { apiVersion } from '@/config';

const request = supertest.agent(app);

const wrongTodoID = 'thisiswrongtodoobjectid';

let username: string;
let todoId: string;
let csrfToken: string;
let accessToken: string;
let refreshToken: string;

test('Sign In - Success', async () => {
  const signInData = {
    userIdentifier: 'janedoe',
    password: '`Jackiechen2',
  };
  const response = await request
    .post(`/${apiVersion}/users/signin`)
    .send(signInData);
  expect(response.body).toHaveProperty('user');
  expect(response.body).toHaveProperty('message');
  expect(response.body).toHaveProperty('tokens');
  expect(response.status).toBe(200);
  username = response.body.user.username;
  csrfToken = response.body.tokens.csrfToken;
  accessToken = response.body.tokens.accessToken;
  refreshToken = response.body.tokens.refreshToken;
});

test('Add Todo - Success', async () => {
  const addTodoData = {
    name: 'Create Client using Next.js',
    due: new Date(),
    priority: 0,
  };
  const response = await request.post(`/${apiVersion}/todos`).send(addTodoData);
  expect(response.body).toHaveProperty('todo');
  expect(response.body).toHaveProperty('message');
  expect(response.body.todo.name).toBe(addTodoData.name);
  expect(response.body.message).toBe('Successfully added todo!');
  todoId = response.body.todo._id;
});

test('Get All Todos - Success', async () => {
  const response = await request.get(`/${apiVersion}/todos`).send({});
  expect(response.status).toBe(200);
  expect(response.body).toHaveProperty('todos');
  expect(Array.isArray(response.body.todos)).toBe(true);
});

test('Get a Specified Todo - Success', async () => {
  const response = await request.get(`/${apiVersion}/todos/${todoId}`);
  expect(response.status).toBe(200);
  expect(response.body).toHaveProperty('todo');
  expect(response.body.todo instanceof Object).toBe(true);
});

test('Update Todo - Success', async () => {
  const updateTodoData = {
    name: 'Install MySQL',
    due: new Date(),
    priority: 0,
  };
  const response = await request
    .put(`/${apiVersion}/todos/${todoId}`)
    .send(updateTodoData);
  expect(response.body).toHaveProperty('todo');
  expect(response.body).toHaveProperty('message');
  expect(response.body.todo.name).toBe(updateTodoData.name);
  expect(response.body.message).toBe('Successfully updated todo!');
  expect(response.status).toBe(200);
});

test('Update Todo - Not Found Error', async () => {
  const updateTodoData = {
    name: 'Install MySQL',
    due: new Date(),
    priority: 0,
  };
  const response = await request
    .put(`/${apiVersion}/todos/${wrongTodoID}`)
    .send(updateTodoData);
  expect(response.body).toHaveProperty('message');
  expect(response.body.message).toBe(
    `Cannot update, no todo whose ID is ${wrongTodoID} found!`,
  );
  expect(response.status).toBe(404);
});

test('Complete Todo - Success', async () => {
  const response = await request.patch(
    `/${apiVersion}/todos/complete/${todoId}`,
  );
  expect(response.body).toHaveProperty('todo');
  expect(response.body).toHaveProperty('message');
  expect(response.body.message).toBe('Successfully completed todo!');
  expect(response.status).toBe(200);
});

test('Complete Todo - Not Found Error', async () => {
  const response = await request.patch(
    `/${apiVersion}/todos/complete/${wrongTodoID}`,
  );
  expect(response.body).toHaveProperty('message');
  expect(response.body.message).toBe(
    `Cannot complete, no todo whose ID is ${wrongTodoID} found!`,
  );
  expect(response.status).toBe(404);
});

test('Uncomplete Todo - Success', async () => {
  const response = await request.patch(
    `/${apiVersion}/todos/uncomplete/${todoId}`,
  );
  expect(response.body).toHaveProperty('todo');
  expect(response.body).toHaveProperty('message');
  expect(response.body.message).toBe('Successfully uncompleted todo!');
  expect(response.status).toBe(200);
});

test('Uncomplete Todo - Not Found Error', async () => {
  const response = await request.patch(
    `/${apiVersion}/todos/uncomplete/${wrongTodoID}`,
  );
  expect(response.body).toHaveProperty('message');
  expect(response.body.message).toBe(
    `Cannot uncomplete, no todo whose ID is ${wrongTodoID} found!`,
  );
  expect(response.status).toBe(404);
});

test('Delete Todo - Success', async () => {
  const response = await request.delete(`/${apiVersion}/todos/${todoId}`);
  expect(response.status).toBe(200);
  expect(response.body).toHaveProperty('todo');
  expect(response.body).toHaveProperty('message');
  expect(response.body.todo instanceof Object).toBe(true);
  expect(typeof response.body.message).toBe('string');
  expect(response.body.message).toBe('Successfully deleted todo!');
});

test('Delete User - Success', async () => {
  const response = await request.delete(`/${apiVersion}/users/${username}`);
  expect(response.status).toBe(200);
  expect(response.body).toHaveProperty('message');
  expect(response.body.message).toBe('Successfully deleted account!');
});
