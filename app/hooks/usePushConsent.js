'use client';

import { useCallback, useMemo, useState } from 'react';

import {
  getConsentRecord,
  hasValidConsent,
  markConsentAccepted,
  markConsentDeclined,
  PUSH_CONSENT_VERSION,
} from '@/app/lib/pushConsent';

function safeHasValidConsent(version) {
  try {
    return hasValidConsent(version);
  } catch (error) {
    console.warn('pushConsent_hasValid_error', error);
    return false;
  }
}

function safeGetConsentRecord() {
  try {
    return getConsentRecord();
  } catch (error) {
    console.warn('pushConsent_getRecord_error', error);
    return null;
  }
}

export function usePushConsent({ role = null, version = PUSH_CONSENT_VERSION } = {}) {
  const [consentRecord, setConsentRecord] = useState(() => safeGetConsentRecord());
  const [isOpen, setIsOpen] = useState(() => !safeHasValidConsent(version));

  const hasConsent = useMemo(() => {
    if (consentRecord?.accepted && consentRecord?.version === version) {
      return true;
    }
    return safeHasValidConsent(version);
  }, [consentRecord, version]);

  const requestConsent = useCallback(() => {
    setIsOpen(true);
  }, []);

  const closeConsent = useCallback(() => {
    setIsOpen(false);
  }, []);

  const acceptConsent = useCallback(
    (meta = {}) => {
      const record = markConsentAccepted({ role, version, meta });
      setConsentRecord(record);
      setIsOpen(false);
      return record;
    },
    [role, version],
  );

  const declineConsent = useCallback(
    (reason = null) => {
      const record = markConsentDeclined({ role, version, reason });
      setConsentRecord(record);
      setIsOpen(false);
      return record;
    },
    [role, version],
  );

  return {
    consentRecord,
    hasConsent,
    isOpen,
    requestConsent,
    closeConsent,
    acceptConsent,
    declineConsent,
    version,
  };
}
