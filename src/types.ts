export function isKyselyError(err: any): err is KyselyError {
	return err && err.severity && err.code && err.detail;
};

export type KyselyError = {
	length: number;
	severity: 'ERROR' | any;
	code: string;
	detail: string;
	hint: any;
	position: any;
	internalPosition: any;
	internalQuery: any;
	where: any;
	schema: string;
	table: string;
	column: string;
	dataType: any;
	constraint: string;
	file: string;
	line: string;
	routine: string; 
}