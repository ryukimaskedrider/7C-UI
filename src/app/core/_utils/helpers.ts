import { environment as env } from '@env/environment';

export const isValidPath = (path: string): boolean => {
  /* eslint-disable no-useless-escape */
  const pattern = /^[\w\s&?=\/-]+$/;

  return pattern.test(path);
};

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export const parseParams = (params: any): any => {
  const parameters = {};

  Object.keys(params).forEach((key) => {
    if (params[key] !== null && params[key] !== '') {
      Object.assign(parameters, { [key]: params[key] });
    }
  });

  return parameters;
};

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export const isPresent = (obj: any): boolean => {
  return obj !== undefined && obj !== null;
};

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export const isDate = (obj: any): boolean => {
  try {
    const dt = new Date(obj);

    return !isNaN(dt.getTime());
  } catch (err) {
    return false;
  }
};

export const toAmount = (amount: any, precision = 2): string => {
  return parseFloat(amount).toLocaleString('en', {
    minimumFractionDigits: precision,
    maximumFractionDigits: precision
  });
};

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export const padStart = (str: any, char = '0', precision = 2): string => {
    return String(str).padStart(precision, char);
};

export const toDmyDate = (str: string): Date => {
  return new Date(str.replace(/(\d{2})\/(\d{2})\/(\d{4})/, '$3-$2-$1'));
};

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export const setFilters = (filters: any): any => {
  const parameters = {};

  Object.keys(filters)
    .forEach((key: string) => {
      if (filters[key] !== '' && filters[key] !== null) {
        if (Array.isArray(filters[key])) {
          /* eslint-disable @typescript-eslint/no-unsafe-call */
          filters[key].forEach((element: string, index: number) => {
            parameters[`filter[${key}][${index}]`] = element;
          });
        } else {
          parameters['filter[' + key + ']'] = filters[key];
        }
      }
    });

  return parameters;
};

export const settings = (key: string): any => {
  return _get(env, key);
};

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
const _get = (obj: any, key: string): any => {
  return key.split('.')
    .reduce((o: any, k: any) => (o || {})[k], obj);
};
