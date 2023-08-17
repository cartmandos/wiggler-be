/*
Query String Formats:
  [filter]: users?filter=firstName=Jane ;[op] ?filter=price>100
  [fields]: users?fields=id,name,email
  [sort]: users?sort=createdAt&direction=desc, users?sort=createdAt&direction=asc
  [paginate]: users?page=2&size=10 (2) users?page=2&limit=10
  [search]: ?title=hello+world, users?name=John+Doe, users?email=user2@example.com, users?name=%John%
*/

const queryStringHandler = (req, res, next) => {
  const { filter, fields, sort, direction, page, limit, size, ...searchTerms } = req.query;
  const filterBy = parseFilterParam(filter);
  const selectFields = parseFieldsParam(fields);
  const sortBy = parseSortParam(sort, direction);
  const pagination = parsePaginationParams(page, limit, size);

  req.queryParams = {
    searchTerms, // where w/o operators
    filterBy, // where
    selectFields, // attributes
    sortBy, // order
    pagination, // offset, limit
  };

  next();
};

// Helpers

// TODO: support operators: >/</>=/<=/=/etc
const parseFilterParam = (filterParam) => {
  if (!filterParam) {
    return {};
  }

  const filterConditions = {};
  const filters = filterParam.split(',');
  filters.forEach((filter) => {
    const [field, value] = filter.split('=');
    filterConditions[field] = value;
  });

  return filterConditions;
};

const parseFieldsParam = (fieldsParam) => {
  if (!fieldsParam) {
    return [];
  }

  return fieldsParam.split(',');
};

const parseSortParam = (sortParam, directionParam) => {
  if (!sortParam) {
    return [];
  }

  const direction = directionParam === 'desc' ? 'DESC' : 'ASC';
  const sortConditions = [sortParam, direction];

  return sortConditions;
};

const parsePaginationParams = (pageParam, limitParam, sizeParam) => {
  const defaultLimit = 20;
  const maxLimit = 100;
  const limitOrSize = limitParam || sizeParam;
  const page = parseInt(pageParam, 10) || 1;
  const limit = Math.min(parseInt(limitOrSize, 10) || defaultLimit, maxLimit);

  const offset = (page - 1) * limit;

  return {
    offset,
    limit,
  };
};

module.exports = { queryStringHandler };
