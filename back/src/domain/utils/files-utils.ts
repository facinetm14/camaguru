export const getFileExtension = (path: string): string => {
  return path.substring(path.lastIndexOf(".") + 1);
};
