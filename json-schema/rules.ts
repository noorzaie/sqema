import { ObjectType, RuleTypesType } from '../types';
import BaseType from 'pg-structure/dist/pg-structure/type/base-type';
import EnumType from 'pg-structure/dist/pg-structure/type/enum-type';
import { JSONSchema7Type } from 'json-schema';

const FIXED_RULES = {
	smallint: {
		minimum: -32768,
		maximum: 32767
	},
	integer: {
		minimum: -2147483648,
		maximum: 2147483647
	},
	bigint: {
		minimum: -9223372036854775808,
		maximum: 9223372036854775807
	},
	smallserial: {
		minimum: 1,
		maximum: 32767
	},
	serial: {
		minimum: 1,
		maximum: 2147483647
	},
	bigserial: {
		minimum: 1,
		maximum: 9223372036854775807
	}
};

type FixedRulesKey = keyof typeof FIXED_RULES;

export const getNumberRule = (type: BaseType) => {
	// maximum
	// minimum
	// exclusiveMaximum
	// exclusiveMinimum
	// multipleOf
	const typeName = [ 'smallint', 'integer', 'bigint' ].includes(type.name) ? 'integer' : 'number';
	return Object.prototype.hasOwnProperty.call(FIXED_RULES, type.name) ?
		{ ...FIXED_RULES[type.name as FixedRulesKey], type: typeName } :
		{ type: typeName };
}

export const getBooleanRule = (type: BaseType) => {
	return { type: 'boolean' };
}

export const getStringRule = (type: BaseType, length?: number) => {
	const rule: JSONSchema7Type = { type: 'string' };
	if ([ 'character varying', 'varchar' ].includes(type.name)) {
		if (length !== undefined) {
			rule.maxLength = length;
		}
	} else if ([ 'character', 'char' ].includes(type.name)) {
		rule.minLength = length || 1;
		rule.maxLength = length || 1;
	}
	return rule;
}

export const getEnumRule = (type: EnumType) => {
	return {
		enum: type.values
	};
}

export const getDateTimeRule = (type: BaseType) => {
	const rule: JSONSchema7Type = { type: 'string' };
	if ([ 'timestamp', 'timestamp with time zone', 'timestamp without time zone', ].includes(type.name)) {
		rule.format = 'date-time';
	} else if ([ 'time', 'time without time zone', 'time with time zone' ].includes(type.name)) {
		rule.format = 'time';
	} else if (type.name === 'date') {
		rule.format = 'date'
	}
	// TODO: interval type
	return rule;
}

export const getNetworkRule = (type: BaseType) => {
	let rule: JSONSchema7Type = { type: 'string' };
	if ([ 'cidr', 'inet' ].includes(type.name)) {
		rule = {
			oneOf:[
				{
					type: 'string',
					format: 'ipv4'
				},
				{
					type: 'string',
					format: 'ipv6'
				}
			]
		};
	}
	// TODO: macaddr type
	return rule;
}

export const getJsonRule = (type: BaseType) => {
	return { type: 'object' };
}

export const addGeneralProperties = (ruleObject: ObjectType, name: string, notNull: boolean, defaultValue: any, values: Array<any>) => {
	ruleObject
}
