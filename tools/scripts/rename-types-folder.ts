// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import fs from 'fs';
import path from 'path';

/**
 * This script is renaming the types folder generated from tsc for the given package.
 * The original folder name is src and the new one is types
 */
const libName = process.argv[2];
//const dependencyName = process.argv[3];

const oldDirName = path.resolve(__dirname, '..', '..', 'dist', 'packages', libName, 'src');
const newDirName = path.resolve(__dirname, '..', '..', 'dist', 'packages', libName, 'types');

fs.rename(oldDirName, newDirName, (err) => {
  if (err) 
    throw err;
  
});
