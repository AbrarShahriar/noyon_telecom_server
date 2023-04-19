import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { ConfigService } from "@nestjs/config";
import { Request } from "express";
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        JwtStrategy.extractJWTFromCookie,
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get("JWT_SECRET"),
    });
  }

  private static extractJWTFromCookie(req: Request): string | null {
    console.log(req.cookies);

    if (req.cookies && "access_token" in req.cookies) {
      return req.cookies.access_token;
    }
    return null;
  }

  private static extractJwtFromBearer(req: Request): string | null {
    let token = null;

    if (!req.headers["authorization"]) {
      return null;
    }

    if (req.headers["authorization"]) {
      let headerValue = req.headers["authorization"].split(" ")[1];

      if (!headerValue) {
        return null;
      }

      token = headerValue;
    }

    return token;
  }

  async validate(payload: any) {
    console.log(payload);

    return payload;
  }
}
