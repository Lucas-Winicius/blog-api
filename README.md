# My blog api

# Introduction
Greetings, I present to you my API, which will be part of my future blog. With this API, you will be able to create users with three roles that will be explained in the future. Before I go on too long, let's start the documentation.

# Topics
- [Overview](#oiverview)
- [Roles](#roles)
- [Routes](#routes)
  * [Routes](#routes)

# Overview

This is a simple API for a medium-scale personal blog. With the support of caching, it can handle a certain number of requests. Before we continue, there are a few things to explain. Each user can have one of three roles: user, contributor, or admin.

# Roles
- **User:** Being a user does not have its advantages.
- **Contributor:** Contributors have all the advantages of a user (none) and the ability to make posts.
- **Admin:** Admins, the powerful and all-mighty, have total power. In addition to having the privileges of a contributor, they can also manage users and edit their roles.

# Routes
Before we begin, it's important to know that the routes marked with **" * "** require bearer authentication.

```plaintext
Authorization: Bearer <Your_Token>
```

## /signin

You will need to send

```json
{
	"username": "<Username>",
	"password": "<Password>"
}
```
and as a successful response, you will receive

```json
{
	"status": <Response code>,
	"token": "<JWT Token>"
}
```
