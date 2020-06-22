# Fancy Todo API

[![Build Status](https://travis-ci.com/sunday-projects/fancy-todo-api.svg?branch=master)](https://travis-ci.com/sunday-project/fancy-todo-api)
[![Coverage Status](https://coveralls.io/repos/github/sunday-projects/fancy-todo-api/badge.svg?branch=master)](https://coveralls.io/github/sunday-projects/fancy-todo-api?branch=master)
[![GitHub issues](https://img.shields.io/github/issues/sunday-projects/fancy-todo-api?style=flat)](https://github.com/sunday-projects/fancy-todo-api/issues)
[![GitHub forks](https://img.shields.io/github/forks/sunday-projects/fancy-todo-api?style=flat)](https://github.com/sunday-projects/fancy-todo-api/network)
[![GitHub stars](https://img.shields.io/github/stars/sunday-projects/fancy-todo-api?style=flat)](https://github.com/sunday-projects/fancy-todo-api/stargazers)
[![GitHub license](https://img.shields.io/github/license/sunday-projects/fancy-todo-api?style=flat)](https://github.com/sunday-projects/fancy-todo-api/blob/master/LICENSE)

Sunday Project - Fancy Todo API.

You may want to checkout published docs using Postman.

[Fancy Todo API Docs on Postman](https://documenter.getpostman.com/view/8807216/Szf52okU)

## Installation (Development Only)

```bash
$ git clone https://github.com/rafiandria23/fancy-todo-api.git

$ cd fancy-todo-api

# I use NPM as default package manager.
$ npm i

$ npm run dev
```

## Endpoint Summary

Base URL: http://api.todo.sundayexplore.tech

### User Endpoints

| Method | Endpoint       | Description                      |
| :----: | :------------- | :------------------------------- |
|  GET   | /users/check   | Checks user's JWT token.         |
|  POST  | /users/signup  | Signs up new user.               |
|  POST  | /users/signin  | Signs in users to get JWT token. |
|  PUT   | /users/:userId | Updates specified user.          |
|  PATCH   | /users/:userId | Updates only the pasword of specified user.          |
| DELETE | /users/:userId | Deletes specified user.          |

### Todo Endpoints

| Method | Endpoint               | Description                             |
| :----: | :--------------------- | :-------------------------------------- |
|  GET   | /todos/:userId         | Gets all todos owned by specified user. |
|  GET   | /todos/:userId/:todoId | Gets specified todo data.               |
|  POST  | /todos/:userId         | Creates new todo.                       |
|  PUT   | /todos/:userId/:todoId | Updates specified todo.                 |
| DELETE | /todos/:todoId         | Deletes specified todo.                 |

## API Reference

#### User Endpoints

- ### GET /users/check

  Example Request:

  ```js
  {
    ...
    "headers": {
      "token": "token here"
    }
    ...
  }
  ```

  Example Response (Success - 200):

  ```js
  {
    ...
    "status": 200,
    "body": {
      "message": "User is verified!"
    }
    ...
  }
  ```

  Example Response (Unauthorized - 401):

  ```js
  {
    ...
    "status": 401,
    "body": {
      "message": "User is not verified!"
    }
    ...
  }
  ```

- ### POST /users/signup

  Example Request:

  ```js
  {
    ...
    "body": {
      "firstName": "John",
      "lastName": "Doe",
      "username": "johndoe",
      "email": "john@doe.com",
      "password": "johndoe"
    }
    ...
  }
  ```

  Example Response (Success - 201):

  ```js
  {
    ...
    "status": 201,
    "body": {
      "message": "Successfully signed up!"
    }
    ...
  }
  ```

- ### POST /users/signin

  Example Request:

  ```js
  {
    ...
    "body": {
      "userIdentifier": "johndoe",
      "password": "johndoe"
    }
    ...
  }
  ```

  Example Response (Success - 200):

  ```js
  {
    ...
    "status": 200,
    "body": {
      "message": "Welcome, John!",
      "token": "token here",
      "user": {
        "_id": "id here",
        "firstName": "John",
        "lastName": "Doe",
        "username": "johndoe",
        "email": "john@doe.com",
      }
    }
    ...
  }
  ```

  Example Response (Bad Request - 400):

  ```js
  {
    ...
    "status": 400,
    "body": {
      "message": "Wrong username or password!"
    }
    ...
  }
  ```

  Example Response (Not Found - 404):

  ```js
  {
    ...
    "status": 404,
    "body": {
      "message": "User not found, please sign up first!"
    }
    ...
  }
  ```

- ### PUT /users/:userId

  Example Request:

  ```js
  {
    ...
    "headers": {
      "token": "token here"
    }
    ...
  }
  ```

  Example Response (Success - 200):

  ```js
  {
    ...
    "status": 200,
    "body": {
      "user": {
        "_id": "id here",
        "firstName": "John",
        "lastName": "Doe",
        "username": "johndoe",
        "email": "john@doe.com"
      },
      "message": "Successfully updated user!"
    }
    ...
  }
  ```

- ### PATCH /users/:userId

  Example Request:

  ```js
  {
    ...
    "headers": {
      "token": "token here"
    },
    "body": {
      "password": "johndoe2"
    }
    ...
  }
  ```

  Example Response (Success - 200):

  ```js
  {
    ...
    "status": 200,
    "body": {
      "message": "Successfully updated user password!"
    }
    ...
  }
  ```

- ### DELETE /users/:userId

  Example Request:

  ```js
  {
    ...
    "headers": {
      "token": "token here"
    }
    ...
  }
  ```

  Example Response (Success - 200):

  ```js
  {
    ...
    "status": 200,
    "body": {
      "message": "Successfully deleted user account!"
    }
    ...
  }
  ```

## License
[MIT](LICENSE)
