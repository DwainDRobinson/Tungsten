'use strict';

const STRONG_PASSWORD_VALIDATIONS_REGEX =
  '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[#?!@$%^&*-]).{8,}$';

const PASSWORD_VALIDATION_MESSAGE =
  'Please enter a password at least 8 characters, at least one uppercase letter, one lowercase letter, and one special character.';

export { PASSWORD_VALIDATION_MESSAGE, STRONG_PASSWORD_VALIDATIONS_REGEX };

export { default as DIFFICULTY } from './difficulties';
export { default as GENDERS } from './genders';
export { default as RESULTS } from './login';
export { default as MEDIA } from './media';
export { default as MFA } from './mfa';
export { default as PERMISSIONS } from './permissions';
export { default as ROLES } from './roles';
export { default as STATES } from './states';
export { default as STATUS } from './statuses';
