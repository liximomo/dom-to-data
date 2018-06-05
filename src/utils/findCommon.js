export default function findCommon(listOfArray) {
  const statistics = listOfArray.reduce((cache, arr) => {
    arr.forEach(item => {
      if (cache.hasOwnProperty(item)) {
        cache[item] += 1;
      } else {
        cache[item] = 1;
      }
    });

    return cache;
  }, {});

  return Object.keys(statistics)
    .filter(key => statistics[key] >= listOfArray.length);
}
