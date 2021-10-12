import { ColumnType, DatabaseConfigType, DBClassType, DefinitionsType } from '../../types';
import pgStructure, { BaseType, Db, EnumType } from 'pg-structure';
import Schema from 'pg-structure/dist/pg-structure/schema';
import Entity from 'pg-structure/dist/pg-structure/base/entity';
import Column from 'pg-structure/dist/pg-structure/column';
import Type from 'pg-structure/dist/pg-structure/base/type';
import {
	getBooleanRule,
	getDateTimeRule,
	getEnumRule, getJsonRule,
	getNetworkRule,
	getNumberRule,
	getStringRule
} from '../../json-schema/rules';
import { JSONSchema7, JSONSchema7Object, JSONSchema7Type } from 'json-schema';

class DB implements DBClassType{
	private db: Db;
	private schemas: string[];

	constructor(private config: DatabaseConfigType) {
	}

	public connect = async () => {
		this.schemas = this.config.schemas || [ 'public' ];
		this.db = await pgStructure(
			{ database: this.config.database, user: this.config.username, password: this.config.password },
			{ includeSchemas: this.schemas }
		);
	}

	public getColumns = (): DefinitionsType => {
		const definitions: DefinitionsType = {};
		for (const s of this.schemas) {
			const schema: Schema = this.db.get(s) as Schema;
			definitions[s] = {};
			for (const table of schema.tables) {
				definitions[s][table.name] = this.getTableColumns(table);
			}
		}

		return definitions;
	}

	private getTableColumns = (table: Entity): JSONSchema7Type => {
		// console.log(table.columns);
		// return table.columns.map(({ name, type, length, comment, default: defaultValue, notNull, arrayDimension }): ColumnType => ({
		// 	name, type: this.getTypeObject(type), length, comment, notNull
		// }));
		const rules: JSONSchema7Object = {};
		for (const column of table.columns) {
			rules[column.name] = this.getTypeObject(column);
		}
		return rules;
	}

	private getTypeObject = (column: Column): JSONSchema7Type => {
		// console.log(column);
		// https://www.postgresql.org/docs/current/catalog-pg-type.html#CATALOG-TYPCATEGORY-TABLE
		// https://ajv.js.org/json-schema.html#json-data-type
		// https://www.pg-structure.com/nav.02.api/classes/type.html#hierarchy
		// https://json-schema.org/learn/getting-started-step-by-step.html
		// https://json-schema.org/understanding-json-schema/reference/string.html#format
		let rule: JSONSchema7Type = {};
		// console.log(column.name, column.type.category);
		switch (column.type.category) {
			case 'A':
				break;
			case 'B':
				rule = getBooleanRule(column.type)
				break;
			case 'C':
				break;
			case 'D':
				rule = getDateTimeRule(column.type);
				break;
			case 'E':
				rule = getEnumRule(column.type as EnumType);
				break;
			case 'G':
				break;
			case 'I':
				rule = getNetworkRule(column.type);
				break;
			case 'N':
				rule = getNumberRule(column.type);
				break;
			case 'P':
				break;
			case 'R':
				break;
			case 'S':
				rule = getStringRule(column.type, column.length);
				break;
			case 'T':
				break;
			case 'U':
				rule = getJsonRule(column.type);
				break;
			case 'V':
				break;
			case 'X':
				break;
		}

		if (rule.type) {
			if (column.default) {
				rule.default = column.default;
			}

			rule.nullable = !column.notNull;

			if (column.comment) {
				rule.description = column.comment;
			}

			if (column.arrayDimension > 0) {
				return {
					type: 'array',
					items: rule
				}
			}
		}
		return rule;
	}
}

export default DB;
