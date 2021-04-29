// Types
import { Validation } from '@/types';

export interface ISignUpValidations {
  name: Validation;
  email: Validation;
  password: Validation;
}

export interface ISignInValidations {
  email: Validation;
  password: Validation;
}
