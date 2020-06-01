import { sign as jwtSign } from 'jsonwebtoken';

import { JWT_ACCESS_SECRET, JWT_REFRESH_SECRET, JWT_API_KEY_SECRET } from '@/config';

export default function createToken(type: 'access' | 'refresh' | 'apiKey', payload: any): string {
  switch (type) {
    case 'access':
      return jwtSign(payload, JWT_ACCESS_SECRET, {
        expiresIn: '7d'
      });
  
    case 'refresh':
      return jwtSign(payload, JWT_REFRESH_SECRET, {
        expiresIn: '365d'
      });
    
    case 'apiKey':
      return jwtSign(payload, JWT_API_KEY_SECRET);
  }
}
