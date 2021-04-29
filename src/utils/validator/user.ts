// Types
import { Validation } from '@/types';

export default class UserValidator {
  static Name(input: string): Validation {
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

  static Email(input: string): Validation {
    if (!input) {
      return {
        error: true,
        text: 'Email cannot be empty!',
      };
    } else if (input && !/.+@.+\..+/.test(input)) {
      return {
        error: true,
        text: 'Invalid email address!',
      };
    }

    return {
      error: false,
      text: '',
    };
  }

  static Password(input: string): Validation {
    if (!input) {
      return {
        error: true,
        text: 'Password is required!',
      };
    } else if (input.length < 6) {
      return {
        error: true,
        text: 'Password must be at least 6 characters!',
      };
    }

    return {
      error: false,
      text: '',
    };
  }
}
