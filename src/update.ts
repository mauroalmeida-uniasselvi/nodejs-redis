import type { RedisClientType } from 'redis';

export async function updateStudent(
  client: RedisClientType,
  id: number,
  firstName: string,
  lastName: string,
  grade: number,
  email: string
): Promise<void> {
  await client.hSet(`student:${id}`, {
    first_name: firstName,
    last_name: lastName,
    grade: grade.toString(),
    email,
  });
}

export async function updateStudentName(
  client: RedisClientType,
  id: number,
  firstName: string
): Promise<void> {
  await client.hSet(`student:${id}`, 'first_name', firstName);
}

export async function updateStudentEmail(
  client: RedisClientType,
  id: number,
  email: string
): Promise<void> {
  await client.hSet(`student:${id}`, 'email', email);
}
