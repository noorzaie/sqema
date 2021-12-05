When you create a web application, you need to validate client-side inputs, most of inputs are same as database fields and you need to create validation schema manually. With `sqema` you can automatically export your sql tables to [json-schema](https://json-schema.org/) format.

## Installation
```npm
npm install sqema
```

## Usage
### In scripts
```typescript
import SQLToJsonSchemaConvertor from 'sqema';

const convertor = new SQLToJsonSchemaConvertor(
    'postgres', 
    { host: 'localhost', port: 5432, database: '***', username: '***', password: '***'}
);

convertor.generateJsonSchemas()
    .then(() => {
        // This will write json schemas to output directory
        convertor.writeJsonSchemas('output', 'single-file', 'json');
    });
```

#### `writeJsonSchemas` Options
| Option  | Description | Possible values | Default value |
| ------------- | ------------- | ------------- | ------------- |
| path | Path of a directory to write schemas  | Any string  | output  |
| granularity  | Scale of data to be written  | `single-file`: Write all schemas in single file <br> `schema`: Write each schema in separate files <br> `table`: Write each table in separate file <br> `field`: Write each field in separate file  | single-file  |
| format  | Format of output  | `json` <br> `js` <br> `ts`  | json  |

### Using cli
You can use `sqma` command with following options:
```
Options:
  -d, --dialect <dialect>          database dialect (choices: "postgres", default: "postgres")
  -h, --host <host>                database host
  -port, --port <port>             database port
  -db, --database <database>       database name
  -u, --username <username>        database username
  -p, --path <path>                output folder (default: "output")
  -g, --granularity <granularity>  output files granularity (choices: "single-file", "schema", "table", "field", default: "single-file")
  -f, --format <format>            output format (choices: "json", "js", "ts", default: "json")
  --help                           display help for command
```

## Note
This library currently supports `postgresql` database and also some complex data types not implemented yet.
