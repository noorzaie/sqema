import { DatabaseConfigType, DBClassType, DefinitionsType, DialectType, ObjectType } from './types';
import DB from './dialects/postgres/DB';
import { createDirectory, joinPaths, writeJsonToFile, writeJsToFile, writeTsToFile } from './utils/fileUtils';

type FilesPathsType = { name: string; path: string; data: Object; }[];

class SQLToJsonSchemaConvertor {
	private db: DBClassType;
	private readonly dbName: string;
	private _schema: DefinitionsType;

	constructor(dialect: DialectType, databaseConfig: DatabaseConfigType) {
		switch (dialect) {
			case 'postgres':
				this.db = new DB(databaseConfig);
				this.dbName = databaseConfig.database;
				break;
			default:
				throw `Dialect ${dialect} not supported!`;
		}
	}

	public generateJsonSchemas = async () => {
		await this.db.connect();
		this._schema = this.db.getColumns();
	};

	get schema() {
		return this._schema;
	}

	public writeJsonSchemas = (path: string, granularity: 'single-file' | 'schema' | 'table' | 'field' = 'single-file', format: 'json' | 'js' | 'ts' = 'json') => {
		createDirectory(path);
		let files: FilesPathsType = [];
		let hasMultipleSchemas = false;

		switch (granularity) {
			case 'single-file':
				files = [
					{
						name: this.dbName,
						path,
						data: this._schema
					}
				];
				break;
			case 'schema':
				files = Object.entries(this._schema).map(([ schema, data ]) => ({
						name: schema,
						path,
						data
					})
				);
				break;
			case 'table':
				files = [];
				hasMultipleSchemas = Object.keys(this._schema).length > 1;
				for (const [ schema, tables ] of Object.entries(this._schema)) {
					const p = hasMultipleSchemas ? joinPaths(path, schema) : path;
					createDirectory(p);
					files = [
						...files,
						...Object.entries(tables).map(([ table, data ]) => ({
							name: table,
							path: p,
							data: data as ObjectType
						}))
					];
				}
				break;
			case 'field':
				files = [];
				hasMultipleSchemas = Object.keys(this._schema).length > 1;
				for (const [ schema, tables ] of Object.entries(this._schema)) {
					for (const [ table, fields ] of Object.entries(tables)) {
						const p = hasMultipleSchemas ? joinPaths(path, schema, table) : joinPaths(path, table);
						createDirectory(p);
						files = [
							...files,
							...Object.entries(fields as ObjectType).map(([ field, data ]) => ({
								name: field,
								path: p,
								data: data as ObjectType
							}))
						];
					}
				}
				break;
			default:
				throw `Format ${granularity} not supported`;
		}
		this.writeFiles(files, format);
	};

	private writeFiles = (files: FilesPathsType, format: 'json' | 'js' | 'ts') => {
		for (const file of files) {
			console.log(`Sqema: Writing ${file.name}.${format} to ${joinPaths(process.cwd(), file.path)} ...`);
			switch (format) {
				case 'js':
					writeJsToFile(file.path, file.name, file.data);
					break;
				case 'json':
					writeJsonToFile(file.path, file.name, file.data);
					break;
				case 'ts':
					writeTsToFile(file.path, file.name, file.data);
					break;
				default:
					throw `Format ${format} not supported`;
			}
		}
	};
}

export default SQLToJsonSchemaConvertor;
