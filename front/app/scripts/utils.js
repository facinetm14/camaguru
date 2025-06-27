export const isValidEmail = (email) => {
  const patterns = /^[^\s@]+@[^\s@]+\.[^\s@]/;
  const emailRegex = new RegExp(patterns);
  return !!email.match(emailRegex);
};

export const isPasswordStrong = (passwd) => {
  const rulePattern =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^a-zA-Z0-9_]).+$/;
  if (passwd.length < 12) {
    return false;
  }
  const passwdRegex = new RegExp(rulePattern);

  return !!passwd.match(passwdRegex);
};

export const uuid = (prefix = "") => {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);

  return `${prefix}-${timestamp}-${random}`;
};

export const buildUpdateUserInfosRequest = (
  userFormDataWithNoPasswdField,
  user
) => {
  const updateUserInfosRequest = {};
  let isAnyFieldChanged = false;

  const setIsAnyFieldChanged = () => {
    if (!isAnyFieldChanged) {
      isAnyFieldChanged = true;
    }
  };

  for (const [key, value] of Object.entries(userFormDataWithNoPasswdField)) {
    if (key === "passwd") {
      updateUserInfosRequest.passwd = value;
      setIsAnyFieldChanged();
      continue;
    }

    if (value.toLowerCase() !== user[key].toLowerCase()) {
      setIsAnyFieldChanged();
      updateUserInfosRequest[key] = value;
    }
  }

  if (!isAnyFieldChanged) {
    return null;
  }

  return updateUserInfosRequest;
};

export const isImportingValidImage = (file) => {
  return (
    file && (file.type.match("image/jpeg") || file.type.match("image/png"))
  );
};

export const CommentNotificationStatus = {
  ACTIVE: "ACTIVE",
  DISABLED: "DISABLED",
};
