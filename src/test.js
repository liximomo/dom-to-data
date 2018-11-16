const report = require('vfile-reporter');
const unified = require('unified');
const parse = require('rehype-parse');
const rehype2remark = require('rehype-remark');
const stringify = require('remark-stringify');

unified()
  .use(parse, { fragment: true, emitParseErrors: false })
  .use(rehype2remark)
  .use(stringify)
  .process('<img src="#" alt alt>', function(err, file) {
    console.error(report(err || file));
    console.log(String(file));
  });
