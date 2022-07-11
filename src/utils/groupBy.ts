export const groupBy = <K, V>(array: V[], keyFn: (item: V) => K): Map<K, V[]> => {
  return array.reduce((store, item) => {
    const key = keyFn(item);
    const collection = store.get(key);
    if (collection == null) {
      store.set(key, [item]);
    } else {
      collection.push(item);
    }
    return store;
  }, new Map<K, V[]>());
};
