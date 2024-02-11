const { db } = require('@vercel/postgres');

async function createSessionEventsTable(client) {
  try {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
    // Create the "createSessionEventsTable" table if it doesn't exist
    const createTable = await client.sql`
      CREATE TABLE IF NOT EXISTS sessionEvents (
        sessionId INTEGER NOT NULL,
        eventName VARCHAR(255) NOT NULL,
        eventTime TIMESTAMP NOT NULL
      );
    `;

    console.log(`Created "sessionEvents" table`);

    return {
      createTable
    };
  } catch (error) {
    console.error('Error creating sessionEvents table:', error);
    throw error;
  }
}

async function main() {
  const client = await db.connect();
  await createSessionEventsTable(client);
  await client.end();
}

main().catch((err) => {
  console.error(
    'An error occurred while attempting to seed the database:',
    err,
  );
});
