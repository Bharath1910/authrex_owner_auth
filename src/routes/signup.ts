import { Request, Response } from 'express';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { isKyselyError, KyselyError } from '../types';
import { StatusCodes } from 'http-status-codes';
import { db } from '../database';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

export async function signup(
	req: Request,
	res: Response
): Promise<void> {
	const username: string | undefined = req.body.username;
	const password: string | undefined = req.body.password;

	if (!username || !password) {
		res
			.status(StatusCodes.BAD_REQUEST)
			.send({error: 'Username and password are required'});
		return;
	}

	const salt = await bcrypt.genSalt(10);
	const hash = await bcrypt.hash(password, salt);

	try {
		const user = await db
			.insertInto('Owner')
			.values({
				username,
				password: hash,
			})
			.returning('Owner.id')
			.executeTakeFirstOrThrow();

		const token = jwt.sign(
			{id: user.id},
			process.env.JWT_SECRET as string
		);

		res
			.status(StatusCodes.CREATED)
			.send({token});

	} catch (e: KyselyError | unknown) {
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
