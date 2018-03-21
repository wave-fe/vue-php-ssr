import path from 'path';
import {
    baseDir,
    outputPath
} from './config';

export function getOutputFilePath(filePath) {
    let relativePath = path.relative(baseDir, filePath);
    let outputFilePath = path.resolve(outputPath, relativePath);
    let parsedPath = path.parse(outputFilePath);
    return {
        outputFileDir: parsedPath.dir,
        outputFilePath
    };
}
