export interface JwtUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

export interface RequestWithUser extends Request {
  user: JwtUser;
}
