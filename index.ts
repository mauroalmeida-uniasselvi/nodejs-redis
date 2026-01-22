import { createClient } from 'redis';
import { insertStudent } from './src/insert.ts';
import { selectUserById, selectAllUsers } from './src/select.ts';
import { updateStudent, updateStudentName, updateStudentEmail } from './src/update.ts';
import { deleteStudent, deleteAllStudent } from './src/delete.ts';

// Environment variables
const url = process.env.REDIS_URL || 'redis://:uniasselvi@localhost:6379';

async function main() {
  const client = createClient({ url });

  client.on('error', (err) => console.log('Redis Client Error', err));

  try {
    await client.connect();
    console.log('Connected to Redis');

    // Clean up previous data
    await deleteAllStudent(client);
    console.log('Cleaned up previous data');

    // CREATE: Insert users
    console.log('\n--- CREATE ---');
    const userId1 = await insertStudent(client, 'John', 'Doe', 10, 'john@example.com');
    console.log(`User 1 created with ID: ${userId1}`);

    const userId2 = await insertStudent(client, 'Jane', 'Smith', 9, 'jane@example.com');
    console.log(`User 2 created with ID: ${userId2}`);

    const userId3 = await insertStudent(client, 'Bob', 'Johnson', 8, 'bob@example.com');
    console.log(`User 3 created with ID: ${userId3}`);

    // READ: Get single user and all users
    console.log('\n--- READ ---');
    const user = await selectUserById(client, userId1);
    console.log('User by ID:', user);

    const allUsers = await selectAllUsers(client);
    console.log('All users:', allUsers);

    // UPDATE: Update user data
    console.log('\n--- UPDATE ---');
    await updateStudent(client, userId1, 'John', 'Updated', 11, 'john.updated@example.com');
    console.log('User 1 updated (all fields)');

    await updateStudentName(client, userId2, 'Janet');
    console.log('User 2 name updated');

    await updateStudentEmail(client, userId3, 'bob.newemail@example.com');
    console.log('User 3 email updated');

    const updatedUsers = await selectAllUsers(client);
    console.log('All users after update:', updatedUsers);

    // DELETE: Delete specific user and all users
    console.log('\n--- DELETE ---');
    await deleteStudent(client, userId2);
    console.log(`User ${userId2} deleted`);

    const usersAfterDelete = await selectAllUsers(client);
    console.log('Remaining users:', usersAfterDelete);

    // Clean up all users
    await deleteAllStudent(client);
    console.log('All users deleted');

    const finalUsers = await selectAllUsers(client);
    console.log('Final users list:', finalUsers);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.disconnect();
    console.log('\nConnection closed');
  }
}

main();
