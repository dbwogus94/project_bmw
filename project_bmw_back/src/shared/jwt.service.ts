import jsonwebtoken, { VerifyErrors } from 'jsonwebtoken';

export interface IJwtPayload {
  id?: number;
  username?: string;
}

export interface IJwtOptins {
  secret: string;
  expiresIn: number;
  issuer: string;
}

export class JwtService {
  private readonly VALIDATION_ERROR = 'JSON-web-token validation failed.';
  constructor() {}

  /**
   * Encrypt data and return jwt.
   *
   * @param data
   */
  public issueToken(data: IJwtPayload, options: IJwtOptins): Promise<string> {
    const { secret, expiresIn, issuer } = options;
    return new Promise((resolve, reject) => {
      jsonwebtoken.sign(data, secret, { expiresIn, issuer }, (err, token) => {
        err //
          ? reject(err)
          : resolve(token || '');
      });
    });
  }

  /**
   * Decrypt JWT and extract client data.
   *
   * @param jwt
   */
  decodeJwt(jwt: string, secret: string): Promise<IJwtPayload> {
    return new Promise((res, rej) => {
      jsonwebtoken.verify(jwt, secret, (err: VerifyErrors | null, decoded?: object) => {
        return err ? rej(this.VALIDATION_ERROR) : res(decoded as IJwtPayload);
      });
    });
  }

  public async decodeToken(jwt: string, secret: string): Promise<IJwtPayload | boolean> {
    try {
      const result: IJwtPayload = await this.decodeJwt(jwt, secret);
      return result;
    } catch (error) {
      return false;
    }
  }
}
