import SSRCookie from 'cookie';
import Cookie from 'js-cookie';
import { IProfile } from 'src/@types/user';
import { AUTH_CRED, AUTH_CRED_PROFILE, PERMISSIONS, TOKEN } from 'src/constants/auth.constant';

export function setAuthCredentials(token: string, profile: IProfile) {
  localStorage.setItem(AUTH_CRED_PROFILE, JSON.stringify(profile));
  Cookie.set(AUTH_CRED, JSON.stringify({ token }));
}

export function getAuthCredentials(context?: any): {
  token: string | null;
  permissions: string[] | null;
  profile: IProfile | null;
} {
  let authCred;
  if (context) {
    authCred = parseSSRCookie(context)[AUTH_CRED];
  } else {
    authCred = Cookie.get(AUTH_CRED);
  }
  if (authCred) {
    const profile = JSON.parse(localStorage.getItem(AUTH_CRED_PROFILE) || '{}');
    return { ...JSON.parse(authCred), profile };
  }
  return { token: null, permissions: null, profile: null };
}

export function parseSSRCookie(context: any) {
  return SSRCookie.parse(context.req.headers.cookie ?? '');
}

export function hasAccess(_allowedRoles: string[], _userPermissions: string[] | undefined | null) {
  if (_userPermissions) {
    return Boolean(_allowedRoles?.find((aRole) => _userPermissions.includes(aRole)));
  }
  return false;
}
export function isAuthenticated(_cookies: any) {
  return (
    !!_cookies[TOKEN] && Array.isArray(_cookies[PERMISSIONS]) && !!_cookies[PERMISSIONS].length
  );
}
