# Fancy Todo API

[![Sunday Explore](https://circleci.com/gh/sundayexplore/fancy-todo-api.svg?style=svg)](https://github.com/sundayexplore/fancy-todo-api)
[![GitHub Issues](https://img.shields.io/github/issues/sundayexplore/fancy-todo-api?style=flat)](https://github.com/sundayexplore/fancy-todo-api/issues)
[![GitHub Forks](https://img.shields.io/github/forks/sundayexplore/fancy-todo-api?style=flat)](https://github.com/sundayexplore/fancy-todo-api/network)
[![GitHub Stars](https://img.shields.io/github/stars/sundayexplore/fancy-todo-api?style=flat)](https://github.com/sundayexplore/fancy-todo-api/stargazers)
[![GitHub License](https://img.shields.io/github/license/sundayexplore/fancy-todo-api?style=flat)](https://github.com/sundayexplore/fancy-todo-api/blob/master/LICENSE)

Sunday Project - Fancy Todo API.

## Documentation

[Fancy Todo API Docs on Postman](https://documenter.getpostman.com/view/8807216/Szf52okU)

## Installation (Development Only)

```bash
$ git clone https://github.com/sundayexplore/fancy-todo-api.git

$ cd fancy-todo-api

# I use Yarn as default package manager.
$ yarn
# Or
$ yarn install

$ yarn dev

# In case you use NPM
$ npm i

$ npm run dev
```

## Endpoint Summary

Base URL: https://api.todo.sundayx.tech

### User Endpoints

| Method | Endpoint       | Description                                     |
| :----: | :------------- | :---------------------------------------------- |
|  GET   | /users/sync    | Syncs user and todo data.                       |
|  POST  | /users/signup  | Signs up new user.                              |
|  POST  | /users/signin  | Signs in users.                                 |
|  POST  | /users/signout | Signs current user out, based on refresh token. |
|  POST  | /users/refresh | Generates all tokens, requires refresh token.   |
|  PUT   | /users/:userId | Updates specified user.                         |
| PATCH  | /users/:userId | Updates only the pasword of specified user.     |
| DELETE | /users/:userId | Deletes specified user.                         |

### Todo Endpoints

| Method | Endpoint               | Description                             |
| :----: | :--------------------- | :-------------------------------------- |
|  GET   | /todos/:userId         | Gets all todos owned by specified user. |
|  GET   | /todos/:userId/:todoId | Gets specified todo data.               |
|  POST  | /todos/:userId         | Creates new todo.                       |
|  PUT   | /todos/:userId/:todoId | Updates specified todo.                 |
| DELETE | /todos/:todoId         | Deletes specified todo.                 |

## License

[MIT](LICENSE)
