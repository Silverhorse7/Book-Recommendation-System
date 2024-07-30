# Book Recommendation System

The Book Recommendation System is a web application that allows users to manage books, track their reading progress, and receive personalized book recommendations based on their reading history.

## Features

- User authentication (signup, signin)
- Add and manage books
- Track reading progress for each book
- Borrow and return books
- Receive personalized book recommendations

## Database Design

### Users Table

| Column              | Type    | Description                                   |
|---------------------|---------|-----------------------------------------------|
| id                  | Integer | Unique identifier for the user                |
| email               | String  | Email address of the user (unique)            |
| password            | String  | Hashed password for user authentication       |
| isAdmin             | Boolean | Indicates if the user has admin privileges    |
| passwordResetToken  | String  | Token for resetting the user's password       |
| authId              | String  | Authentication identifier for external logins |

### Books Table

| Column            | Type    | Description                                |
|-------------------|---------|----------------------------------------------|
| id                | Integer | Unique identifier for the book              |
| title             | String  | Title of the book                           |
| num_of_pages      | Integer | Total number of pages in the book           |
| num_of_read_pages | Integer | Number of pages read by the user            |

### Reads Table

| Column  | Type    | Description                                  |
|---------|---------|-----------------------------------------------|
| book_id | Integer | Unique identifier for the borrowed book      |
| left    | Integer | Left child node in the interval tree         |
| right   | Integer | Right child node in the interval tree        |

## Installation

1. Clone the repository: `git clone https://github.com/silverhorse7/book-recommendation-system.git`
2. Navigate to the project directory: `cd book-recommendation-system`
3. Install dependencies: `npm install`
4. Set up the database: `npm run migrate:dev`
5. (Optional) Seed the database with initial data: `npm run seed`
6. Start the server: `npm start`

## API Endpoints

### Users

- `POST /api/v1/users/signup`
  - Request body: `{ email, password, newPassword, isAdmin }`
  - Response: `{ token, id, isAdmin, message }`
- `POST /api/v1/users/signin`
  - Request body: `{ email, password }`
  - Response: `{ token, id, isAdmin, message }`
- `GET /api/v1/users`
  - Response: `{ users: [ { id, email, isAdmin, CreatedAt, UpdatedAt } ] }`

### Books

- `POST /api/v1/book`
  - Request body: `{ token, title, num_of_pages }`
  - Response: `{ id, title, num_of_pages, num_of_read_pages, CreatedAt, UpdatedAt }`
- `GET /api/v1/books`
  - Response: `{ books: [ { id, title, num_of_pages, num_of_read_pages, CreatedAt, UpdatedAt } ] }`
- `POST /api/v1/Read`
  - Request body: `{ token, book_id, start_page, end_page, user_id }`
  - Response: `{ message }`
- `GET /api/v1/Recommend`
  - Response: `{ books: [ { id, title, num_of_pages, num_of_read_pages, CreatedAt, UpdatedAt } ] }`

### Reads

- `GET /api/v1/transactions`
  - Response: `{ transactions: [ { book_id, left, right, CreatedAt, UpdatedAt } ] }`


## Technologies Used

- Node.js
- Express.js
- PostgreSQL
- Sequelize (ORM)
- JSON Web Tokens (JWT) for authentication
- Bcrypt for password hashing
- Faker for generating fake data

## Implementation Architecture
- MVC
