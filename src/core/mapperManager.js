import Mapper from './mapper/Mapper';
import defaultHandler from './mapper/default';
import html2md from './mapper/html2md';

const defaultMapper = new Mapper('string', defaultHandler);

const configMap = {};

function registerAttrMapper(attr, mapper, asDefault) {
  let config;
  if (configMap.hasOwnProperty(attr)) {
    config = configMap[attr];
  } else {
    config = configMap[attr] = { mappers: [] };
  }
  config.mappers.push(mapper);

  if (asDefault) {
    config.default = mapper;
  }
}

function getAttrMapperList(attr) {
  const config = configMap[attr];
  return config ? config.mappers.concat(defaultMapper) : [defaultMapper];
}

const mapperManager = {
  registerAttrMapper,
  getAttrMapperList,
  getDefaultMapper(attr) {
    if (!attr) {
      return defaultMapper;
    }

    const config = configMap[attr];
    return (config && config.default) || defaultMapper;
  },
};

mapperManager.registerAttrMapper('innerHTML', new Mapper('markdown', html2md), true);

export default mapperManager;
