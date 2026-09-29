export const buildSort = (sortBy, sortOrder = 'desc', allowedFields = []) => {
  const field = allowedFields.includes(sortBy) ? sortBy : 'createdAt';
  const order = sortOrder === 'asc' ? 1 : -1;

  return { [field]: order };
};
