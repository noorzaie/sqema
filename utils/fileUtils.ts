import fs from "fs";
import path from 'path';
import { ObjectType } from '../types';

export const createDirectory = (path: string) => {
	if (!fs.existsSync(joinPaths(process.cwd(), path))) {
		fs.mkdirSync(joinPaths(process.cwd(), path), { recursive: true });
	}
};

export const writeDataToFile = (dir: string, fileName: string, data: string) => {
	fs.writeFileSync(path.join(joinPaths(process.cwd(), dir), fileName), data);
};

export const writeJsonToFile = (dir: string, fileName: string, data: ObjectType) => {
	writeDataToFile(dir, `${fileName}.json`, JSON.stringify(data, null, 4));
};

export const writeJsToFile = (dir: string, fileName: string, data: ObjectType) => {
	const formattedData = `module.exports = ${JSON.stringify(data, null, 4)}`
	writeDataToFile(dir, `${fileName}.js`, formattedData);
};

export const writeTsToFile = (dir: string, fileName: string, data: ObjectType) => {
	const formattedData = `export default ${JSON.stringify(data, null, 4)}`
	writeDataToFile(dir, `${fileName}.ts`, formattedData);
};

export const joinPaths = (...paths: string[]) => {
	return path.join(...paths);
};
