export type KyselyError = {
	length: number;
	severity: 'ERROR' | unknown;
	code: string;
	detail: string;
	hint: unknown;
	position: unknown;
	internalPosition: unknown;
	internalQuery: unknown;
	where: unknown;
	schema: string;
	table: string;
	column: string;
	dataType: unknown;
	constraint: string;
	file: string;
	line: string;
	routine: string; 
}

export function isKyselyError(err: unknown): err is KyselyError {
	return !!(err as KyselyError)?.severity && !!(err as KyselyError)?.code && !!(err as KyselyError)?.detail;
}