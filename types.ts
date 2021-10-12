import { JSONSchema7Type } from 'json-schema';

export type DialectType = 'postgres';

export interface DatabaseConfigType {
	username: string;
	password: string;
	database: string;
	schemas?: string[];
}

export interface ColumnType {
	name: string;
	type: any;
	length: number | undefined;
	comment: any;
	notNull: boolean;
	minValue: number | undefined;
	maxValue: number | undefined;
}

export interface DBClassType {
	connect(): void;
	getColumns(): DefinitionsType;
}

export type RuleTypesType = 'number' | 'string' | 'array' | 'object';

export interface ObjectType {
	[key: string]: any;
}

export interface DefinitionsType {
	[key: string]: {
		[key: string]: JSONSchema7Type
	}
}
