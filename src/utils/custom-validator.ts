export default class CustomValidator {
  static firstName(input: string) {
    if (!input) {
      return 'First Name cannot be empty!';
    }
  }

  static username(input: string) {
    if (!input) {
      return 'Username cannot be empty!';
    } else if (!(input && input.length >= 6)) {
      return 'Username must be at least 6 characters!';
    } else if (input && /.+@.+\..+/.test(input)) {
      return 'Username cannot be an email format!';
    }
  }

  static email(input: string) {
    if (!input) {
      return 'Email cannot be empty!';
    } else if (input && !/.+@.+\..+/.test(input)) {
      return 'Invalid email address!';
    }
  }

  static userIdentifier(input: string) {
    if (!input) {
      return 'Username or email is required!';
    } else if (
      !input.includes('@') &&
      !(input && !/.+@.+\..+/.test(input) && input.length >= 6)
    ) {
      return 'Username must be at least 6 characters!';
    } else if (input.includes('@') && !(input && /.+@.+\..+/.test(input))) {
      return 'Invalid email address!';
    }
  }

  static password(input: string) {
    if (!input) {
      return 'Password is required!';
    } else if (input.length < 6) {
      return 'Password must be at least 6 characters!';
    } else if (
      input.length >= 6 &&
      !/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*)(+=._-`])([a-zA-Z0-9!@#$%^&*)(+=._-`]+)$/g.test(
        input,
      )
    ) {
      return 'Password must contain at least a Number, a Special Character, and an Upper-Case Letter!';
    }
  }
}
