import SQLToJsonSchemaConvertor from '../index';

const convertor = new SQLToJsonSchemaConvertor('postgres', { host: 'localhost', port: 5432, database: 'test_db', username: 'postgres', password: 'postgres'});

// Generate all possible outputs and write them in output directory
convertor.generateJsonSchemas()
	.then(() => {
		const granularities = [ 'single-file', 'schema', 'table', 'field' ];
		const outputFormats = [ 'json', 'js', 'ts' ];
		for (const granularity of granularities) {
			for (const format of outputFormats) {
				// @ts-ignore
				convertor.writeJsonSchemas(`output/${granularity}/${format}`, granularity, format);
			}
		}
	});
