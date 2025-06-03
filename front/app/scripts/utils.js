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