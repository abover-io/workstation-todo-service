import { Types } from 'mongoose';
import moment from 'moment';

// Types
import { Validation } from '@/types';
import { ITodoValidator, TodoPriority } from '@/types/todo';

class TodoValidator implements ITodoValidator {
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

  public ListId(input: string): Validation {
    if (!input) {
      return {
        error: true,
        text: 'List ID cannot be empty!',
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

  public Notes(input: string | null): Validation {
    if (input) {
      return {
        error: false,
        text: '',
      };
    }

    return {
      error: false,
      text: '',
    };
  }

  public URL(input: string | null): Validation {
    const pattern: RegExp = new RegExp(
      '^(https?:\\/\\/)?' + // Protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // Domain
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR IPv4
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // Port and Path
        '(\\?[;&a-z\\d%_.~+=-]*)?' + // Query String
        '(\\#[-a-z\\d_]*)?$',
      'i',
    );

    if (input) {
      if (!pattern.test(input)) {
        return {
          error: true,
          text: 'Invalid URL!',
        };
      }
    }

    return {
      error: false,
      text: '',
    };
  }

  public IsDateSet(input: boolean): Validation {
    if (input === true) {
      return {
        error: false,
        text: '',
      };
    } else if (input === false) {
      return {
        error: false,
        text: '',
      };
    }

    return {
      error: true,
      text: 'Invalid isDateSet attribute!',
    };
  }

  public IsTimeSet(input: boolean): Validation {
    if (input === true) {
      return {
        error: false,
        text: '',
      };
    } else if (input === false) {
      return {
        error: false,
        text: '',
      };
    }

    return {
      error: true,
      text: 'Invalid isTimeSet attribute!',
    };
  }

  public Due(input: string | null): Validation {
    if (input) {
      if (!moment(input).isValid()) {
        return {
          error: true,
          text: 'Invalid due attribute!',
        };
      }
    }

    return {
      error: false,
      text: '',
    };
  }

  public Priority(input: string): Validation {
    switch (input as TodoPriority) {
      case 'none':
        break;

      case 'low':
        break;

      case 'medium':
        break;

      case 'high':
        break;

      default:
        return {
          error: true,
          text: 'Invalid priority attribute!',
        };
    }

    return {
      error: false,
      text: '',
    };
  }
}

export default new TodoValidator();
