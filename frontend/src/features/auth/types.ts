/** model/response/AuthUserResponse.java */
export interface AuthUser {
  id: string;
  rolename: string;
  username: string;
  fullName: string;
}

/** model/request/LoginRequest.java */
export interface LoginRequest {
  username: string;
  password: string;
}

/** model/request/UserRequest.java */
export interface UserRequest {
  username: string;
  password: string;
  name: string;
}

export interface SecurityState {
  /** Empty object while nobody is logged in */
  user: Partial<AuthUser>;
  validToken: boolean;
}
