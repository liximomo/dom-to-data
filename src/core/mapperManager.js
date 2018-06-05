import Mapper from './mapper/Mapper';
import defaultHandler from './mapper/default';
import html2md from './mapper/html2md';

const defaultMapper = new Mapper('string', defaultHandler);

const configMap = {};

function registerAttrMapper(attr, mapper) {
  if (configMap.hasOwnProperty(attr)) {
    const mappers = configMap[attr];
    mappers.push(mapper);
    return;
  }

  configMap[attr] = [mapper];
}

function getAttrMapperList(attr) {
  const mappers = configMap[attr];
  return mappers ? mappers.concat(defaultMapper) : [defaultMapper];
}

const mapperManager = {
  registerAttrMapper,
  getAttrMapperList,
  getDefaultMapper() {
    return defaultMapper;
  }
};

mapperManager.registerAttrMapper('innerHTML', new Mapper('markdown', html2md));

export default mapperManager;
