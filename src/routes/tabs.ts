import { ComponentType } from 'react';
import { DashboardPage } from '../pages/DashboardPage';
import { CommunityPage } from '../pages/CommunityPage';
import { MessengerPage } from '../pages/MessengerPage';
import { InsightsPage } from '../pages/InsightsPage';
import { ProfilePage } from '../pages/ProfilePage';

export type RouteKey = 'dashboard' | 'community' | 'messenger' | 'insights' | 'profile';

export interface AppRoute {
  key: RouteKey;
  label: string;
  component: ComponentType;
}

export const routes: AppRoute[] = [
  { key: 'dashboard', label: 'Dashboard', component: DashboardPage },
  { key: 'community', label: 'Karte', component: CommunityPage },
  { key: 'messenger', label: 'Chat', component: MessengerPage },
  { key: 'insights', label: 'Analyse', component: InsightsPage },
  { key: 'profile', label: 'Profil', component: ProfilePage },
];
