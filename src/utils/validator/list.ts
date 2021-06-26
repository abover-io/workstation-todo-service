import { Types } from 'mongoose';

// Types
import { Validation } from '@/types';
import { IListValidator } from '@/types/list';

class ListValidator implements IListValidator {
  public Id(input: string): Validation {
    if (!input) {
      return {
        error: true,
        text: 'ID cannot be empty!',
      };
    } else if (!Types.ObjectId.isValid(input)) {
      return {
        error: true,
        text: 'Invalid ID!',
      };
    }

    return {
      error: false,
      text: '',
    };
  }

  public UserId(input: string): Validation {
    if (!input) {
      return {
        error: true,
        text: 'User ID cannot be empty!',
      };
    } else if (!Types.ObjectId.isValid(input)) {
      return {
        error: true,
        text: 'Invalid user ID!',
      };
    }

    return {
      error: false,
      text: '',
    };
  }

  public Name(input: string): Validation {
    if (!input) {
      return {
        error: true,
        text: 'Name cannot be empty!',
      };
    }

    return {
      error: false,
      text: '',
    };
  }

  public Color(input: string): Validation {
    if (!input) {
      return {
        error: true,
        text: 'Color cannot be empty!',
      };
    } else if (!/^#[0-9A-F]{6}$/i.test('input')) {
      return {
        error: true,
        text: 'Invalid color hex!',
      };
    }

    return {
      error: false,
      text: '',
    };
  }
}

export default new ListValidator();
