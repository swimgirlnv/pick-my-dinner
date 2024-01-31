const { db } = require('@vercel/postgres');
const {
  restaurants,
  users,
} = require('../app/lib/placeholder-data.js');

async function seedUsers(client) {
  try {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
    // Create the "users" table if it doesn't exist
    const createTable = await client.sql`
      CREATE TABLE IF NOT EXISTS users (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
      );
    `;

    console.log(`Created "users" table`);

    // Insert data into the "users" table
    const insertedUsers = await Promise.all(
      users.map(async (user) => {
        return client.sql`
        INSERT INTO users (id, name)
        VALUES (${user.id}, ${user.name})
        ON CONFLICT (id) DO NOTHING;
      `;
      }),
    );

    console.log(`Seeded ${insertedUsers.length} users`);

    return {
      createTable,
      users: insertedUsers,
    };
  } catch (error) {
    console.error('Error seeding users:', error);
    throw error;
  }
}


async function seedRestaurants(client) {
  try {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

    // Create the "customers" table if it doesn't exist
    const createTable = await client.sql`
      CREATE TABLE IF NOT EXISTS customers (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        foodtype VARCHAR(255) NOT NULL,
        location VARCHAR(255) NOT NULL,
        ranking INT,
        review TEXT,
      );
    `;

    console.log(`Created "customers" table`);

    // Insert data into the "customers" table
    const insertedRestaurants = await Promise.all(
      restaurants.map(
        (restaurant) => client.sql`
        INSERT INTO customers (id, name, foodtype, location, ranking, review)
        VALUES (${customer.id}, ${restaurant.name}, ${restaurant.foodtype}, ${restaurant.location}, ${restaurant.ranking}, ${restaurant.review})
        ON CONFLICT (id) DO NOTHING;
      `,
      ),
    );

    console.log(`Seeded ${insertedRestaurants.length} customers`);

    return {
      createTable,
      restaurants: insertedRestaurants,
    };
  } catch (error) {
    console.error('Error seeding restaurants:', error);
    throw error;
  }
}


async function main() {
  const client = await db.connect();

  await seedUsers(client);
  await seedRestaurants(client);
  
  await client.end();
}

main().catch((err) => {
  console.error(
    'An error occurred while attempting to seed the database:',
    err,
  );
});