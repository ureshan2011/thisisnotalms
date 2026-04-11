import { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { logEvent } from './eventLog';

export function useFeatureTracking(feature: string) {
  const { user, role } = useAuth();

  useEffect(() => {
    if (!user) return;
    logEvent({
      type: 'ui_feature_used',
      description: `${user.email || 'User'} opened ${feature}.`,
      actorUid: user.uid,
      actorEmail: user.email,
      actorRole: role,
      feature,
    }).catch(() => undefined);
  }, [feature, role, user]);
}
