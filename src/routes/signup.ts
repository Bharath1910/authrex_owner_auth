import { Request, Response } from 'express';
import { KyselyError, isKyselyError } from '../types'
import { StatusCodes } from 'http-status-codes';
import { db } from '../database';
import jwt from 'jsonwebtoken';

export async function signup(
	req: Request,
	res: Response
): Promise<void> {
	const username: string = req.body.username;
	const password: string = req.body.password;

	try {
		const user = await db
			.insertInto('Owner')
			.values({
				username,
				password,
			})
			.returning('Owner.id')
			.executeTakeFirstOrThrow();

		const token = jwt.sign(
			{id: user.id},
			process.env.JWT_SECRET as string
		)

		res
			.status(StatusCodes.CREATED)
			.send({token});

	} catch (e: KyselyError | any) {
		if (!isKyselyError(e)) {
			res
				.status(StatusCodes.INTERNAL_SERVER_ERROR)
				.send({error: 'Username already exists'});
			return;
		}
		
		if (e.code === '23505') {
			res
				.status(StatusCodes.BAD_REQUEST)
				.send({error: 'Username already exists'});
			return;
		}

		res
			.status(StatusCodes.INTERNAL_SERVER_ERROR)
			.send({error: 'Username already exists'});
	} 
}
