import { JSONSchema7Type } from 'json-schema';

export type DialectType = 'postgres';

export interface DatabaseConfigType {
	host: string;
	port: number;
	username: string;
	password: string;
	database: string;
	schemas?: string[];
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
