// Types
import { Validation } from '@/types';

export interface ISignUpFormValidations {
  name: Validation;
  email: Validation;
  password: Validation;
}

export interface ISignUpFormData {
  name: string;
  email: string;
  password: string;
}

export interface ISignInFormValidations {
  email: Validation;
  password: Validation;
}

export interface ISignInFormData {
  email: string;
  password: string;
}
