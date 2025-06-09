import 'express-session';
import 'passport-saml';

declare global {
  namespace Express {
    export interface User {
      id: number;
      firstName: string;
      lastName: string;
      pvfLevels: string[];
      username: string;
    }
  }
}

declare module 'express-session' {
  export interface SessionData {
    originalUrl: string;
  }
}

declare module 'passport-saml' {
  export interface Profile {
    issuer?: string | undefined;
    sessionIndex?: string | undefined;
    nameID?: string | undefined;
    nameIDFormat?: string | undefined;
    nameQualifier?: string | undefined;
    spNameQualifier?: string | undefined;
    ID?: string | undefined;
    mail?: string | undefined; // InCommon Attribute urn:oid:0.9.2342.19200300.100.1.3
    email?: string | undefined; // `mail` if not present in the assertion
    getAssertionXml?(): string; // get the raw assertion XML
    getAssertion?(): object; // get the assertion XML parsed as a JavaScript object
    getSamlResponseXml?(): string; // get the raw SAML response XML
    uuid: string;
    pvfLevels: string | string[] | undefined;
    firstName: string;
    lastName: string;
    username: string;
  }
}
