import { Request, Response } from 'express';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { KyselyError, isKyselyError } from '../types';
import { StatusCodes } from 'http-status-codes';
import { db } from '../database';
import jwt from 'jsonwebtoken';

export async function login(req: Request, res: Response): Promise<void> {
	const username: string = req.body.username;
	const password: string = req.body.password;

	try {
		const user = await db
			.selectFrom('Owner')
			.select(['id', 'password'])
			.where('username', '=', username)
			.executeTakeFirstOrThrow();
		
		if (user.password !== password) {
			res
				.status(StatusCodes.BAD_REQUEST)
				.send({error: 'Invalid password'});
			return;
		}

		const token = jwt.sign(
			{id: user.id},
			process.env.JWT_SECRET as string
		);

		res
			.status(StatusCodes.OK)
			.send({token});
	} catch (e: KyselyError | unknown) {
		console.log(e);
		if (!isKyselyError(e)) {
			res
				.status(StatusCodes.INTERNAL_SERVER_ERROR)
				.send({error: 'Invalid username'});
			return;
		}

		res
			.status(StatusCodes.INTERNAL_SERVER_ERROR)
			.send({error: 'Invalid username but kysely error'});
	}
}
