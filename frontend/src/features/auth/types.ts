/** Claims of the JWT issued by the backend (security/TokenProvider.java) */
export interface JwtUser {
  id: string;
  rolename: string;
  username: string;
  fullName: string;
  iat: number;
  exp: number;
}

/** model/request/LoginRequest.java */
export interface LoginRequest {
  username: string;
  password: string;
}

/** model/response/LoginResponse.java */
export interface LoginResponse {
  success: boolean;
  token: string;
}

/** model/request/UserRequest.java */
export interface UserRequest {
  username: string;
  password: string;
  name: string;
  roleName: string;
}

export interface SecurityState {
  /** Empty object until a token is decoded, and again after logout */
  user: Partial<JwtUser>;
  validToken: boolean;
}
