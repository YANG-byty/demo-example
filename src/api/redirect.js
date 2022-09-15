import Setting from '@/setting';
export function authLogin() {
  let url = `${Setting.apiBaseURL}/screenServer/auth/client/login?redirectUri=${Setting.OAUTH_REDIRECT_URI}`;
  return url;
}
export function authLogout() {
  let url = `${Setting.apiBaseURL}/screenServer/auth/client/logout?redirect_url=${Setting.OAUTH_REDIRECT_URI}`;
  return url;
}
