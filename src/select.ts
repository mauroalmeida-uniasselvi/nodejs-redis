import type { RedisClientType } from 'redis';

interface Student {
  id: number;
  first_name: string;
  last_name: string;
  grade: number;
  email: string;
}

export async function selectUserById(
  client: RedisClientType,
  id: number
): Promise<Student | null> {
  const user = await client.hGetAll(`user:${id}`);
  
  if (Object.keys(user).length === 0) {
    return null;
  }
  
  return {
    id,
    first_name: user.first_name,
    last_name: user.last_name,
    grade: parseInt(user.grade) || 0,
    email: user.email,
  };
}

export async function selectAllUsers(
  client: RedisClientType
): Promise<Student[]> {
  const counter = await client.get('user:id:counter');
  const maxId = counter ? parseInt(counter) : 0;
  
  const users: Student[] = [];
  
  for (let i = 1; i <= maxId; i++) {
    const user = await selectUserById(client, i);
    if (user) {
      users.push(user);
    }
  }
  
  return users;
}
