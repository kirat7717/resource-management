export const buildFilter = (query = {}, allowedFields = []) => {
  const filter = {};

  allowedFields.forEach((field) => {
    if (query[field] !== undefined && query[field] !== '') {
      filter[field] = query[field];
    }
  });

  return filter;
};
