#!/usr/bin/env node

import { program, Option } from 'commander';
import prompts from 'prompts';
import SQLToJsonSchemaConvertor from '../index';

(async () => {
	program
		.version('1.0.0')
		.addOption(new Option('-d, --dialect <dialect>', 'database dialect').default('postgres').choices([ 'postgres' ]))
		.requiredOption('-db, --database <database>', 'database name')
		.requiredOption('-u, --username <username>', 'database username')
		.addOption(new Option('-p, --path <path>', 'output folder').default('output'))
		.addOption(new Option('-g, --granularity <granularity>', 'output files granularity').default('single-file').choices([ 'single-file', 'schema', 'table', 'field' ]))
		.addOption(new Option('-f, --format <format>', 'output format').default('json').choices([ 'json', 'js', 'ts' ]));

	program.parse(process.argv);

	const options = program.opts();

	if(!options.password){
		const response = await prompts({
			type: 'password',
			name: 'password',
			message: 'Database password?'
		});
		if(response.password) {
			options.password = response.password;
		}
	}

	const convertor = new SQLToJsonSchemaConvertor(
		options.dialect,
		{
			database: options.database,
			username: options.username,
			password: options.password
		}
	);

	convertor.generateJsonSchemas();
	convertor.writeJsonSchemas(options.path, options.granularity, options.format);
})();
