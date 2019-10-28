export const allGt0 = (...args: number[]) => args.every(x => x > 0);

export const sanitizeBase64 = (str: string) =>
  str.replace(/\+/g, '-').replace(/\//g, '_');
