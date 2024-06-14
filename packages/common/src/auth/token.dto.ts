// TODO: Get this from the server package
export interface TokenPayload {
  id: string;
  projectId: string;
  role: number;
  iat: number;
  exp: number;
  iss: string;
}
