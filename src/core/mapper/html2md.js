import report from 'vfile-reporter';
import unified from 'unified';
import parse from 'rehype-parse';
import rehype2remark from 'rehype-remark';
import stringify from 'remark-stringify';

// import Turndown from 'turndown';
// import * as turndownPluginGfm from 'turndown-plugin-gfm';
// unified.turndown(element[attrName]);
let service;

export default function html2markdown(element, attrName) {
  if (!service) {
    service = unified()
      .use(parse, { fragment: true, emitParseErrors: false })
      .use(rehype2remark, {
        handlers: { comment: () => void 0 },
      })
      .use(stringify, {
        gfm: true,
        bullet: '*',
        fence: '`',
        rule: '-',
        ruleRepetition: 3,
        incrementListMarker: true,
        fences: true,
      });
  }

  let file, err;
  try {
    file = service.processSync(element[attrName]);
  } catch (error) {
    err = error;
  }
  console.error(report(err || file));
  return String(file);
}
