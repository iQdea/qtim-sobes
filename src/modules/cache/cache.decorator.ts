export interface CacheOptionsInterface {
  key: string;
  ttl: number;
}

export const Cache = (options: CacheOptionsInterface): MethodDecorator => {
  if (!options?.key || !options?.ttl) {
    throw new Error('Invalid cache options')
  }

  return () => {};
};
