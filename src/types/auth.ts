export interface User {
   id: string;
   username: string;
   name: string;
   email: string;
   phone: string;
   avatar: string | null;
   lockFlag: string;
   systemFlag: string;
   roles: {
      id: string;
      name: string;
      code: string;
   }[];
}

export interface AuthResponse {
   success: boolean;
   message: string;
   code: string;
   status: number;
   data: {
      // sessionId & refreshToken are @JsonIgnore on backend — they come as httpOnly cookies, NOT in JSON
      accessToken: string;
      userInfo: User;
      permissions: string[];
   };
}

export interface AuthContextType {
   accessToken: string | null;
   userInfo: User | null;
   permissions: string[];
   isAuthenticated: boolean;
   loading: boolean;
   login: (credentials: any) => Promise<void>;
   setAuthData: (data: {
      accessToken: string;
      userInfo: User;
      permissions?: string[];
   }) => void;
   register: (data: any) => Promise<void>;
   logout: () => Promise<void>;
}
