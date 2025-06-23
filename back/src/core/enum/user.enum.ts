export enum UserStatus {
  UNVERIFIED = "unverified",
  VERIFIED = "verified",
  CHANGING_PASSWORD = "changing_password",
}

export enum UserSessionStatus {
  VALID = "valid",
  INVALID = "invalid",
}

export enum UserUniqKeys {
  VALIDATION_TOKEN = "validation_token",
  ID = "id",
  EMAIL = "email",
  USER_NAME = "username",
}
