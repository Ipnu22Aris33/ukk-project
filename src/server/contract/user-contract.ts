/**
 * Driving layer: User repository interface
 */
export type UserRepository = {
  create: (user: any) => Promise<any>;
  getById: (id: string) => Promise<any>;
  update: (id: string, user: any) => Promise<any>;
  delete: (id: string) => Promise<void>;
};

/**
 * Driven layer: User service interface
 */
export type UserService = {
  register: (userData: any) => Promise<any>;
  login: (credentials: any) => Promise<any>;
  getProfile: (userId: string) => Promise<any>;
};
