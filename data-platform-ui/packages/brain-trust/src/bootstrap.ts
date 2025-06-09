import authService, { NLSSUser } from './auth.service';
import { searchBarService } from './search';

/**
 * Called during or before every app mounts.
 */
export default async function appBootstrap(): Promise<NLSSUser | undefined> {
  const user: NLSSUser | undefined = await authService.fetchUserInfo();

  if (user === undefined) {
    return user;
  }
  await searchBarService.fetchEntityTypeFilter();

  return user;
}
