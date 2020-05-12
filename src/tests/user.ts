import supertest from 'supertest';
import { connect, disconnect, connection } from 'mongoose';

import app from '../app';
import { decideMongoURI, defaultTestPort } from '../config';

const request = supertest.agent(app);

let username: string;

describe('User Model Tests', () => {
  beforeAll(async () => {
    app.listen(defaultTestPort, () => {
      console.log(`Fancy Todo API Tests\nPORT: ${defaultTestPort}\nUnit: User Model`);
    });
    await connect(decideMongoURI('test'), {
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
    expect(response.status).toBe(201);
  });

  test('Sign In - Success', async () => {
    const signInData = {
      userIdentifier: 'johndoe',
      password: 'johndoe'
    };
    const response = await request.post('/users/signin').send(signInData);
    expect(response.body).toHaveProperty('user');
    expect(response.body).toHaveProperty('message');
    expect(response.body).toHaveProperty('tokens');
    expect(response.status).toBe(200);
    username = response.body.user.username;
  });

  test('Sign In - User Not Found', async () => {
    const signInData = {
      userIdentifier: 'doejohn',
      password: 'doejohn'
    };
    const response = await request.post('/users/signin').send(signInData);
    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toBe('User not found, please sign up first!');
    expect(response.status).toBe(404);
  });

  test('Sign In - Wrong Username or Password', async () => {
    const signInData = {
      userIdentifier: 'johndoe',
      password: 'doejohn'
    };
    const response = await request.post('/users/signin').send(signInData);
    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toBe('Wrong username or password!');
    expect(response.status).toBe(400);
  });

  test('Refresh User Token - Success', async () => {
    const response = await request.post('/users/refresh');
    expect(response.body).toHaveProperty('tokens');
    expect(response.body).toHaveProperty('message');
    expect(response.body.tokens).toHaveProperty('accessToken');
    expect(response.body.tokens).toHaveProperty('refreshToken');
    expect(response.body.message).toBe('Successfully refreshed token!');
    expect(response.status).toBe(200);
  });

  test('Update Profile - Success', async () => {
    const updateProfileData = {
      firstName: 'Jackie',
      lastName: 'Chen',
      username: 'jackiechen',
      email: 'jackiechen@jack.com'
    };
    const response = await request
      .put(`/users/${username}`)
      .send(updateProfileData);
    expect(response.body).toHaveProperty('user');
    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toBe('Successfully updated user!');
    expect(response.status).toBe(200);
    username = updateProfileData.username;
  });

  test('Update Password - Success', async () => {
    const updatePasswordData = {
      password: 'jackiechen2'
    };
    const response = await request
      .patch(`/users/${username}`)
      .send(updatePasswordData);
    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toBe('Successfully updated password!');
    expect(response.status).toBe(200);
  });

  test('Sign Out - Success', async () => {
    const response = await request.post('/users/signout');
    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toBe('Successfully signed out!');
    expect(response.status).toBe(200);
  });

  afterAll(async () => {
    app.close();
    await disconnect();
  });
});
