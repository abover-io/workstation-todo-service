import { Types } from 'mongoose';

// Types
import { Validation } from '@/types';
import { ISubtodoValidator } from '@/types/subtodo';

class SubtodoValidator implements ISubtodoValidator {
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

  public TodoId(input: string): Validation {
    if (!input) {
      return {
        error: true,
        text: 'Todo ID cannot be empty!',
      };
    } else if (!Types.ObjectId.isValid(input)) {
      return {
        error: true,
        text: 'Invalid list ID!',
      };
    }

    return {
      error: false,
      text: '',
    };
  }
}

export default new SubtodoValidator();
