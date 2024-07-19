const { sequelize } = require("./models");
const validateInput = require("./middleware/validateInput");
const UserController = require("./controllers/UserController");
const Book = require("./models").Book;
const { faker } = require("@faker-js/faker");

async function seed() {
  try {
    // Sync the database (be careful with force: true in production!)
    await sequelize.sync({ force: true });

    console.log("Seeding Books...");
    const books = [];
    const usedTitles = new Set();
    for (let i = 0; i < 10000; i++) {
      let title;
      do {
        title = faker.lorem.words(Math.floor(Math.random() * 5) + 1) + ' ' + faker.datatype.uuid().slice(0, 8);
      } while (usedTitles.has(title));
      usedTitles.add(title);

      books.push({
        title: title,
        num_of_pages: Math.floor(Math.random() * 1000) + 1,
      });

      if (i % 1000 === 0) {
        console.log(`Created ${i} books`);
      }
    }

    // Insert books in smaller batches
    for (let i = 0; i < books.length; i += 1000) {
      await Book.bulkCreate(books.slice(i, i + 1000));
      console.log(`Inserted books ${i} to ${Math.min(i + 1000, books.length)}`);
    }

    console.log("Seeding Users...");
    const users = [];
    for (let i = 0; i < 1000; i++) {
      const password = faker.internet.password();
      users.push({
        email: faker.internet.email(),
        password: password,
        confirmPassword: password,
        isAdmin: faker.datatype.boolean(),
      });

      if (i % 1000 === 0) {
        console.log(`Created ${i} users`);
      }
    }

    // Use UserController to create users
    for (const user of users) {
      const req = { body: user };
      const res = {
        status: function(statusCode) {
          return {
            json: function(data) {
              // You can log or handle the response here if needed
              // console.log(statusCode, data);
            }
          };
        }
      };

      const next = (error) => {
        if (error) console.error("Error creating user:", error);
      };

      try {
        await validateInput.signup(req, res, next);
        await UserController.createUser(req, res, next);
      } catch (error) {
        console.error("Error creating user:", error);
      }
    }

    console.log("Seed data inserted successfully");
  } catch (error) {
    console.error("Error seeding data:", error);
  } finally {
    await sequelize.close();
  }
}

// Run the seed function
seed();