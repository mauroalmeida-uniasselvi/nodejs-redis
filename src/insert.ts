import type { RedisClientType } from 'redis';

export async function insertStudent(
  client: RedisClientType,
  firstName: string,
  lastName: string,
  grade: number,
  email: string
): Promise<number> {
  // Increment user counter to get next ID
  const id = await client.incr('student:id:counter');
  
  // Store student data in Redis hash
  await client.hSet(`student:${id}`, {
    first_name: firstName,
    last_name: lastName,
    grade: grade.toString(),
    email,
  });
  
  return id;
}
