import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { db } from '../database';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { NoResultError } from 'kysely';

export async function login(
	req: Request,
	res: Response
): Promise<void> {
	const username: string = req.body.username;
	const password: string = req.body.password;

	try {
		const user = await db
			.selectFrom('Owner')
			.select(['id', 'password'])
			.where('username', '=', username)
			.executeTakeFirstOrThrow();
		
		const match = await bcrypt.compare(password, user.password);
		if (!match) {
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
	} catch (e: NoResultError | unknown) {
		if (!(e instanceof NoResultError)) {
			res
				.status(StatusCodes.INTERNAL_SERVER_ERROR)
				.send({error: '..'});
			return;
		}

		res
			.status(StatusCodes.BAD_REQUEST)
			.send({error: 'Invalid username but kysely error'});
	}
}
