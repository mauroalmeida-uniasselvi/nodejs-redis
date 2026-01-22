import type { RedisClientType } from 'redis';

export async function deleteStudent(
  client: RedisClientType,
  id: number
): Promise<void> {
  await client.del(`student:${id}`);
}

export async function deleteAllStudent(
  client: RedisClientType
): Promise<void> {
  const counter = await client.get('student:id:counter');
  const maxId = counter ? parseInt(counter as string) : 0;
  
  for (let i = 1; i <= maxId; i++) {
    await client.del(`student:${i}`);
  }
  
  // Reset counter
  await client.del('student:id:counter');
}
