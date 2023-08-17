function queryBuilder(queryParams, excludedFields, allowedFields) {
  const query = {};

  function filterAttributes(fields) {
    return fields.filter(
      (field) => allowedFields.includes(field) && !excludedFields.includes(field)
    );
  }

  if (queryParams.searchTerms?.length) {
    query.where = queryParams.searchTerms;
  }

  if (queryParams.filterBy) {
    query.where = { ...query.where, ...queryParams.filterBy };
  }

  if (queryParams.selectFields?.length) {
    query.attributes = filterAttributes(queryParams.selectFields);
  }

  if (!query.attributes && excludedFields?.length) {
    query.attributes = { exclude: excludedFields };
  }

  if (queryParams.sortBy?.length) {
    query.order = [queryParams.sortBy];
  }

  if (queryParams.pagination) {
    queryParams.pagination.offset && (query.offset = queryParams.pagination.offset);
    query.limit = queryParams.pagination.limit;
  }

  return query;
}

function paginationBuilder(result, queryParams, pathname) {
  const pageCount = queryParams.pagination.limit;
  const totalCount = result.count;
  const currentPage = queryParams.pagination.offset / queryParams.pagination.limit + 1;
  const totalPages = Math.ceil(result.count / queryParams.pagination.limit);
  const isNextPage = currentPage < totalPages;
  const isPrevPage = currentPage > 1 && currentPage <= totalPages;

  const page = {
    count_per_page: pageCount,
    total_count: totalCount,
    current_page: currentPage,
    total_pages: totalPages,
    ...((isNextPage || isPrevPage) && {
      _links: {
        ...(isPrevPage && {
          previous: {
            href: `${pathname}?page=${currentPage - 1}&limit=${pageCount}`,
          },
        }),
        ...(isNextPage && {
          next: {
            href: `${pathname}?page=${currentPage + 1}&limit=${pageCount}`,
          },
        }),
      },
    }),
  };

  return page;
}

const builders = {
  queryBuilder,
  paginationBuilder,
};

module.exports = builders;
