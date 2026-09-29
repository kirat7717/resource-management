export const getPagination = (page = 1, limit = 10) => {
  const parsedPage = Math.max(1, parseInt(page, 10) || 1);
  const parsedLimit = Math.min(100, Math.max(1, parseInt(limit, 10) || 10));
  const skip = (parsedPage - 1) * parsedLimit;

  return {
    page: parsedPage,
    limit: parsedLimit,
    skip
  };
};

export const getPaginationMeta = (totalItems = 0, page = 1, limit = 10) => {
  const currentPage = Math.max(1, parseInt(page, 10) || 1);
  const currentLimit = Math.min(100, Math.max(1, parseInt(limit, 10) || 10));
  const totalPages = totalItems === 0 ? 0 : Math.ceil(totalItems / currentLimit);

  return {
    totalItems,
    totalPages,
    currentPage,
    limit: currentLimit,
    hasNextPage: currentPage < totalPages,
    hasPrevPage: currentPage > 1
  };
};
