import type { RequestHandler } from '@sveltejs/kit';
import { redisClientInit } from '$lib/utils/redis';
import type { RedisClientType } from 'redis';

export const POST: RequestHandler = async ({ request }) => {
	const data = await request.json();
	const articulos = data.articulos;

	if (!articulos) return new Response('No hay articulos', { status: 400 });
	let client;
	try {
		client = await redisClientInit();
		await client.set('QUIVER', JSON.stringify(articulos), { EX: 60 * 60 * 5 });
		return new Response('success', { status: 200 });
	} catch (err) {
		console.log(err);
		return new Response('Error', { status: 500 });
	} finally {
		await client?.disconnect();
	}
};
