const idGenerator = (first) => () => first++;
export const getNextId = idGenerator(0);
