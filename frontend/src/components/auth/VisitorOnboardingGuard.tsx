'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/VisitorAuthContext';
import { useQuery } from '@apollo/client';
import { GET_VISITOR_BY_ID } from '@/graphql/queries';

export default function VisitorOnboardingGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { visitor, isInitialized, isAuthenticated } = useAuth();

  const { data } = useQuery(GET_VISITOR_BY_ID, {
    variables: { id: visitor?.id },
    skip: !visitor?.id,
    fetchPolicy: 'cache-first',
  });

  const visitorData = data?.findVisitorById;
  const isMissingName =
    visitorData &&
    (!visitorData.visitor_fname ||
      !visitorData.visitor_fname.trim() ||
      visitorData.visitor_fname === 'Visitor');

  const isProfileIncomplete =
    visitorData &&
    (visitorData.isOnboarded === false ||
      (visitorData.isOnboarded !== true &&
        (isMissingName ||
          (!visitorData.city &&
            !visitorData.phone &&
            !visitorData.wed_date &&
            !visitorData.partner_fname))));

  useEffect(() => {
    if (isInitialized && isAuthenticated && isProfileIncomplete) {
      router.replace('/visitor-onboarding');
    }
  }, [isInitialized, isAuthenticated, isProfileIncomplete, router]);

  if (isProfileIncomplete) {
    return null;
  }

  return <>{children}</>;
}
