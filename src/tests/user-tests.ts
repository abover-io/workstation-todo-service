import supertest from 'supertest';

import app from '@/app';
import { startAPI, stopAPI } from '@/utils';
import { defaultTestPort, apiVersion } from '@/config';

const request = supertest.agent(app);

let username: string;
let csrfToken: string;

describe('User Model Tests', () => {
  beforeAll(async () => {
    await startAPI(app, {
      port: defaultTestPort,
      env: 'test',
    });
  });

  test('Sign Up - Success', async () => {
    const signUpData = {
      firstName: 'John',
      lastName: 'Doe',
      username: 'johndoe',
      email: 'john@doe.com',
      password: '`Johndoe123',
    };
    const response = await request
      .post(`/${apiVersion}/users/signup`)
      .send(signUpData);
    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toBe('Successfully signed up!');
    expect(response.status).toBe(201);
    csrfToken = response.body.tokens.csrfToken;
  });

  test('Sign Up - Validation Error', async () => {
    const signUpData = {
      firstName: 'John',
      lastName: 'Doe',
      username: 'johndoe',
      email: 'john',
      password: 'johndoe',
    };
    const response = await request
      .post(`/${apiVersion}/users/signup`)
      .send(signUpData);
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toBe('Failed to sign up, please correct user information!');
  });

  test('Sign Up - Unavailable Username', async () => {
    const signUpData = {
      firstName: 'John',
      lastName: 'Doe',
      username: 'johndoe',
      email: 'john@doe.com',
      password: '`Johndoe123',
    };
    const response = await request
      .post(`/${apiVersion}/users/signup`)
      .send(signUpData);
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toBe(`Username isn't available.`);
  });

  test('Sign Up - Unavailable Email', async () => {
    const signUpData = {
      firstName: 'John',
      lastName: 'Doe',
      username: 'johndoe2',
      email: 'john@doe.com',
      password: '`Johndoe123',
    };
    const response = await request
      .post(`/${apiVersion}/users/signup`)
      .send(signUpData);
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toBe(`Email isn't available.`);
  });

  test('Sign In - Success', async () => {
    const signInData = {
      userIdentifier: 'johndoe',
      password: '`Johndoe123',
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
  });

  test('Sign In - User Not Found', async () => {
    const signInData = {
      userIdentifier: 'doejohn',
      password: '`Doejohn456',
    };
    const response = await request
      .post(`/${apiVersion}/users/signin`)
      .send(signInData);
    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toBe('User not found, please sign up first!');
    expect(response.status).toBe(404);
  });

  test('Sign In - Wrong Username or Password', async () => {
    const signInData = {
      userIdentifier: 'johndoe',
      password: '`Doejohn5468468',
    };
    const response = await request
      .post(`/${apiVersion}/users/signin`)
      .send(signInData);
    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toBe('Wrong username or password!');
    expect(response.status).toBe(400);
  });

  test('Sign In - Validation Error', async () => {
    const signInData = {
      userIdentifier: 'johndoe',
      password: 'john',
    };
    const response = await request
      .post(`/${apiVersion}/users/signin`)
      .send(signInData);
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toBe('Failed to sign in, please correct user information!');
  })

  test('Refresh User Token - Success', async () => {
    const response = await request.post(`/${apiVersion}/users/refresh`);
    expect(response.body).toHaveProperty('tokens');
    expect(response.body).toHaveProperty('message');
    expect(response.body.tokens).toHaveProperty('accessToken');
    expect(response.body.tokens).toHaveProperty('refreshToken');
    expect(response.body.message).toBe('Successfully refreshed token!');
    expect(response.status).toBe(200);
  });

  test('Refresh User Token - Refresh Token Error', async () => {
    await request.post(`/${apiVersion}/users/signout`);
    const response = await request.post(`/${apiVersion}/users/refresh`);
    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('message');
  });

  test('Update User - Success', async () => {
    const updateUserData = {
      firstName: 'Jackie',
      lastName: 'Chen',
      email: 'jackiechen@jack.com',
      _csrf: csrfToken
    };
    const response = await request
      .put(`/${apiVersion}/users/${username}`)
      .send(updateUserData);

    expect(response.body).toHaveProperty('user');
    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toBe('Successfully updated user!');
    expect(response.status).toBe(200);
  });

  test('Update User - Authorization Error', async () => {
    const updateUserData = {
      firstName: 'Jackie',
      lastName: 'Chen',
      email: 'jackiechen@jack.com',
      _csrf: csrfToken
    };
    const response = await request
      .put(`/${apiVersion}/users/wrongusername`)
      .send(updateUserData);

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toBe('Cannot update user, invalid credentials!');
  });

  test('Update User - Validation Error', async () => {
    const updateUserData = {
      firstName: 'Jackie',
      lastName: 'Chen',
      email: 'jackiechen',
      _csrf: csrfToken
    };
    const response = await request
      .put(`/${apiVersion}/users/${username}`)
      .send(updateUserData);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toBe('Cannot update, please correct user information!');
  });

  test('Update User - Unavailable Email', async () => {
    const updateUserData = {
      firstName: 'Jackie',
      lastName: 'Chen',
      email: 'jackiechen@jack.com',
      _csrf: csrfToken
    };
    const response = await request
      .put(`/${apiVersion}/users/${username}`)
      .send(updateUserData);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toBe(`Email isn't available.`);
  });

  test('Update Password - Success', async () => {
    const updatePasswordData = {
      password: '`Jackiechen2',
      _csrf: csrfToken
    };
    const response = await request
      .patch(`/${apiVersion}/users/${username}`)
      .send(updatePasswordData);
    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toBe('Successfully updated password!');
    expect(response.status).toBe(200);
  });

  test('Sign Out - Success', async () => {
    const response = await request.post(`/${apiVersion}/users/signout`);
    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toBe('Successfully signed out!');
    expect(response.status).toBe(200);
  });

  afterAll(async () => {
    await stopAPI(app, {
      env: 'test',
      db: 'hold',
    });
  });
});
