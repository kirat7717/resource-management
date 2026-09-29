export const buildSearch = (search, fields = []) => {
  if (!search || !fields.length) return {};

  return {
    $or: fields.map((field) => ({
      [field]: { $regex: search.trim(), $options: 'i' }
    }))
  };
};
