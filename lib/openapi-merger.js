yaml = require('js-yaml');
glob = require('glob');
fs = require('fs');
path = require('path');
minimist = require('minimist');
lodash = require('lodash');

const args = require('minimist')(process.argv.slice(2));

function printHelp() {
  console.log("Usage: openapi-merge --source <source-directory> --dest <dest-path>");
}

function ensureIsDirectory(path) {
  if (fs.existsSync(path) && fs.lstatSync(path).isDirectory()) {
    return true;
  } else {
    console.log(`Directory "${path}" does not exist`);
    return false;
  }
}

function mergeOpenAPIFiles(sourcePath, destPath) {
  glob(`${sourcePath}/**/*.yaml`, function (_, files) {
    const documents = files.map((file) =>  yaml.safeLoad(fs.readFileSync(file, 'utf8')));
    if (files.length > 0) {
      const mergedDocument = documents.reduce(lodash.merge, {});
      const yamlDocument = yaml.safeDump(mergedDocument);
      fs.writeFileSync(destPath, yamlDocument);
    } else {
      console.log(`No specs found at "${sourcePath}"`);
    };
  });
};

if (args.help) {
  printHelp();
} else {
  const sourcePath = args.source;
  const destPath = args.dest;
  if (sourcePath && destPath) {
    if (ensureIsDirectory(sourcePath) && ensureIsDirectory(path.dirname(destPath))) {
      mergeOpenAPIFiles(sourcePath, destPath);
    };
  } else {
    printHelp();
  }
}
