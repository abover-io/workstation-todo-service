import { Request } from 'express';

import { NODE_ENV } from '@/config';

export default (
  optionName: 'httpOnly' | 'secure' | 'sameSite' | 'domain',
  req?: Request,
): any => {
  switch (optionName) {
    case 'secure':
      return NODE_ENV !== 'production' ? false : true;

    case 'sameSite':
      return NODE_ENV !== 'production' ? 'strict' : 'none';

    default:
      return true;
  }
};
