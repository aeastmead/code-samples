import { NLSSError } from './errors';
import axios, { AxiosResponse } from 'axios';
import queryString from 'qs';

const AuthStorage: { user: NLSSUser | undefined } = { user: undefined };

function setUser(user: NLSSUser): void {
  AuthStorage.user = { ...user };
}

function getUser(throwIfEmpty?: true): NLSSUser;
function getUser(throwIfEmpty: false): NLSSUser | undefined;
function getUser(throwIfEmpty: boolean = true): NLSSUser | undefined {
  if (AuthStorage.user !== undefined) {
    return { ...AuthStorage.user };
  }
  if (throwIfEmpty) {
    throw new NLSSError({ code: 'Auth', message: 'No active user is available' });
  }
  return undefined;
}

function clearUser(): void {
  AuthStorage.user = undefined;
}

async function fetchUserInfo(redirectOnError?: true): Promise<NLSSUser | undefined>;
async function fetchUserInfo(redirectOnError: false): Promise<NLSSUser | NLSSError>;
async function fetchUserInfo(redirectOnError: boolean = true): Promise<NLSSUser | NLSSError | undefined> {
  try {
    const response: AxiosResponse<NLSSUser> = await axios.get('/bsso/me');
    setUser(response.data);

    return response.data;
  } catch (cause: unknown) {
    if (!redirectOnError) return NLSSError.fromError(cause);
  }

  const redirectQueryString: string = queryString.stringify({ originalUrl: window.location.pathname });

  window.location.assign(`/bsso/login?${redirectQueryString}`);
  return undefined;
}

export interface NLSSUser {
  readonly id: number;
  readonly firstName: string;
  readonly lastName: string;
  readonly pvfLevels: string[];
  readonly username: string;
}

export default {
  setUser,
  getUser,
  clearUser,
  fetchUserInfo,
};
