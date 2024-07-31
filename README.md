# My blog api

# Introduction

Greetings, I present to you my API, which will be part of my future blog. With this API, you will be able to create users with three roles that will be explained in the future. Before I go on too long, let's start the documentation.

# Topics

- [Overview](#overview)
- [Roles](#roles)
- [Routes](#routes)
  - [/signin - POST](#signin)
  - [/users/:username - GET](#userget)
  - [/users/info - GET\*](#userinfo)
  - [/users - POST](#createuser)
  - [/users/:id - PATCH](#patchuser)
  - [/posts - GET](#getonepost)

# Overview

This is a simple API for a medium-scale personal blog. With the support of caching, it can handle a certain number of requests. Before we continue, there are a few things to explain. Each user can have one of three roles: user, contributor, or admin.

# Roles

- **User:** Being a user does not have its advantages.
- **Contributor:** Contributors have all the advantages of a user (none) and the ability to make posts.
- **Admin:** Admins, the powerful and all-mighty, have total power. In addition to having the privileges of a contributor, they can also manage users and edit their roles.

# Routes

Before we begin, it's important to know that the routes marked with **" \* "** require bearer authentication.

```plaintext
Authorization: Bearer <Your_Token>
```

<a id="signin"></a>

## /signin (POST)

You will need to send

```json
{
  "username": "",
  "password": ""
}
```

and as a successful response, you will receive

```json
{
  "status": "int",
  "token": "string"
}
```

<a id="userget"></a>

## /users/:username (GET)

as a successful response, you will receive

```json
{
  "id": "int",
  "name": "string",
  "username": "string",
  "role": "'user' | 'contributor' | 'admin'",
  "createdAt": "Date",
  "updatedAt": "Date",
  "posts": [
    {
      "id": "string",
      "image": "string - URL",
      "title": "string",
      "subtitle": "string",
      "slug": "string",
      "content": "HTML",
      "authorId": "int",
      "createdAt": "Date",
      "updatedAt": "Date"
    }
  ]
}
```

<a id="userinfo"></a>

## /users/info (GET)\*

and as a successful response, you will receive

```json
{
  "name": "string",
  "username": "string",
  "role": "'user' | 'contributor' | 'admin'",
  "createdAt": "Date",
  "updatedAt": "Date",
  "posts": [
    {
      "id": "string",
      "title": "string",
      "slug": "string",
      "content": "HTML",
      "createdAt": "Date",
      "updatedAt": "Date"
    }
  ]
}
```

<a id="createuser"></a>

## /users (POST)

You will need to send

```json
{
  "name": "",
  "username": "",
  "password": ""
}
```

and as a successful response, you will receive

```json
{
  "status": "int",
  "message": "string"
}
```

<a id="patchuser"></a>

## /users/:id (PATCH)

You will need to send

```json
{
  "name": "<optional>",
  "username": "<optional>",
  "password": "<optional>",
  "role": "<optional>"
}
```

and as a successful response, you will receive

```json
{
  "id": "int",
  "name": "string",
  "username": "string",
  "password": "string",
  "role": "string",
  "createdAt": "string",
  "updatedAt": "string"
}
```

<a id="getonepost"></a>

## /posts?id=optional&slug=optional (GET)

and as a successful response, you will receive

```json
{
  "id": "string",
  "image": "string - URL",
  "title": "string",
  "subtitle": "string",
  "slug": "string",
  "content": "HTML",
  "authorId": "int",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

<a id="createpost"></a>

## /posts (POST)

You will need to send

```json
{
  "image": "string - URL",
  "title": "string",
  "subtitle": "string",
  "slug": "string",
  "content": "string - MARKDOWN"
}
```

and as a successful response, you will receive

```json
{
  "id": "string",
  "image": "string - URL",
  "title": "string",
  "subtitle": "string",
  "slug": "string",
  "content": "HTML",
  "authorId": "int",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```
