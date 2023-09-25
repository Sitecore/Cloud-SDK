// © Sitecore Corporation A/S. All rights reserved. Sitecore® is a registered trademark of Sitecore Corporation A/S.
import fs from 'fs';
import path from 'path';
import { argv } from 'node:process';
/**
 * This script for coping the README.md and package.json files to dist
 */
const pName = argv[2];
const readMeSource = path.resolve(__dirname, '..', '..', 'packages', pName, 'README.md');
const readMeDestination = path.resolve(__dirname, '..', '..', 'dist', 'packages', pName, 'README.md');
fs.copyFile(readMeSource, readMeDestination, (err) => {
  if (err) {
    throw err;
  }
});
const packageJsonSource = path.resolve(__dirname, '..', '..', 'packages', pName, 'package.json');
const packageJsonDestination = path.resolve(__dirname, '..', '..', 'dist', 'packages', pName, 'package.json');
fs.copyFile(packageJsonSource, packageJsonDestination, (err) => {
  if (err) {
    throw err
  }
});
