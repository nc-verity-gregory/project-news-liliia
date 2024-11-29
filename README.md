# Northcoders News API

## Description
NC News is a API that provides access to news articles, comments, and topics. 
It is built using Node.js, Express, and PostgreSQL.

## Installation
To run this project locally:

1. Clone the repository:

 git clone 'repository_url'
 cd 'repository_directory'

2. Install dependencies:

 npm install

3. Set up environment files:

 You are must add next files:
.env.development   --inside-->   PGDATABASE= 'dbName'
.env.test          --inside-->   PGDATABASE= 'dbNameTest'

4. Set up databases:

 Run the following command to create the databases:
 npm run setup-dbs

5. Seed the development database:

 npm run seed

6. Start the server:

 npm start

## Running Tests
This project includes tests for all endpoints and db functional.

* Run the test:
 npm test

* Testing Modules:
 jest
 supertest
 jest-extended
 jest-sorted

## Endpoints - GET

1. GET /api
Description: Returns an object detailing the documentation for each endpoint.

2. GET /api/topics
Description: Returns an array of topics. Each topic has a slug and description.
Example response:
{
  "topics": [
    {
      "slug": "coding",
      "description": "Code is love, code is life"
    },
    {
      "slug": "football",
      "description": "FOOTIE!"
    },
    {
      "slug": "cooking",
      "description": "Hey good looking, what you got cooking?"
    }
  ]
}

3. GET /api/articles/:article_id
Returns a single article object by its article_id. 
The object of the article has the following form...
Example response:
{
  "article": {
    "article_id": 1,
    "title": "Running a Node App",
    "topic": "coding",
    "author": "jessjelly",
    "body": "This is part two of a series on how to get up and running with Systemd and Node.js. This part dives deeper into how to successfully run your app with systemd long-term, and how to set it up in a production environment.",
    "created_at": "2020-11-07T06:03:00.000Z",
    "votes": 0,
    "article_img_url": "https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?w=700&h=700"
  }
}

4. GET /api/articles
Description: Returns an article object by its ID, including the comment count.
- Articles are sorted in descending order.
- Articles do not include the 'body' property.
Example response:
{
  "article": {
    "article_id": 1,
    "title": "Running a Node App",
    "topic": "coding",
    "author": "jessjelly",
    "body": "This is part two of a series on how to get up and running with Systemd and Node.js...",
    "created_at": "2020-11-07T06:03:00.000Z",
    "votes": 0,
    "article_img_url": "https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?w=700&h=700"
  }
}

5. GET /api/articles/:article_id/comments
Description: Returns an array of comments for the specified 'article_id', sorted with the latest first.
Example response:
{
  "comments": [
    {
      "comment_id": 89,
      "votes": 2,
      "created_at": "2020-10-24T06:08:00.000Z",
      "author": "cooljmessy",
      "body": "Esse et expedita harum non. Voluptatibus commodi voluptatem. Minima velit suscipit numquam ea. Id vitae debitis aut incidunt odio quo quam possimus ipsum.",
      "article_id": 1
    }
  ]
}

## Endpoints - POST

1. POST /api/articles/:article_id/comments
Description:
This endpoint allows a user to add a comment to a specific article.

Example Request:
{
  "username": "butter_bridge",
  "body": "Great article!"
}

Example Response:
{
  "comment": {
    "comment_id": 1,
    "votes": 0,
    "created_at": "2024-11-28T12:34:56.000Z",
    "author": "butter_bridge",
    "body": "Great article!",
    "article_id": 1
  }
}




## Project modules:

    express
    pg
    cors

    jest
    supertest
    jest-extended
    jest-sorted
    pg-format
    husky


This portfolio project was created as part of a Digital Skills Bootcamp in Software Engineering provided by [Northcoders](https://northcoders.com/)
