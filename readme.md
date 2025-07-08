# WorkNotes API

## 📄 Introduction

A secure, scalable, and well-structured RESTful API for the [WorkNotes App](https://github.com/MartinXCVI/worknotes-app). Built with **Node.js**, **TypeScript**, **Express**, and **MongoDB**.

WorkNotes API provides user authentication, role-based access control, and a full CRUD interface for managing work notes within teams or small organizations.

---

## 🛰️ Technologies Used

- Node.js: JavaScript runtime environment used to execute server-side code.
- TypeScript: Allows specifying the types of data being passed around within the code.
- Express: Fast and minimalist web framework for Node.js.
- MongoDB: Non-relational document database for agile development.
- Mongoose: ODM (Object Data Modeling) library for MongoDB and Node.js to manage data.

## 📋 Installation Guide

### 1. Clone the repository
```bash
git clone https://github.com/MartinXCVI/worknotes-api.git
```

### 2. Navigate into the project
```bash
cd worknotes-api
```

### 3. Install dependencies
```bash
npm install
```

### 4. Environment variables (.env)

Create a `.env` file in the root directory and configure the following variables:

```
NODE_ENV=development
PORT_ENV=3500
DATABASE_URI=<your_mongodb_uri>
ACCESS_TOKEN_SECRET=<your_access_token_secret>
REFRESH_TOKEN_SECRET=<your_refresh_token_secret>
CLIENT_URL=<your_client_url>
```

## 🚀 Running the Project

- Start the server in development mode (with nodemon):

```bash
npm run dev
```

- Production build:
```bash
npm run build
npm start
```

---

## 📚 Learn More

- [Node.js latest documentation](https://nodejs.org/docs/latest/api/)
- [TypeScript documentation](https://www.typescriptlang.org/docs/)
- [Nodemon project website](https://nodemon.io/)
- [Getting started with Express.js](https://expressjs.com/en/starter/installing.html)
- [Dotenv repository](https://github.com/motdotla/dotenv#readme)
- [MongoDB documentation](https://www.mongodb.com/docs/)
- [Mongoose documentation](https://mongoosejs.com/docs/)
- [bcrypt NPM package](https://www.npmjs.com/package/bcrypt)
- [cookie-parser NPM package](https://www.npmjs.com/package/cookie-parser)
- [Cross Origin Resource Sharing](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
- [JSON Web Tokens official website's introduction](https://jwt.io/introduction)
---

## 📜 License

This project is licensed under the [MIT License](LICENSE).

---

## 🧑‍💻 Developer

- [**MartinXCVI**](https://github.com/MartinXCVI)