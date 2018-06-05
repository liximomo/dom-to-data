import Turndown from 'turndown';
import * as turndownPluginGfm from 'turndown-plugin-gfm';

let turndownService;

export default function html2markdown(element, attrName) {
  if (!turndownService) {
    turndownService = new Turndown();
    turndownService.use(turndownPluginGfm.gfm);
  }

  return turndownService.turndown(element[attrName]);
}
