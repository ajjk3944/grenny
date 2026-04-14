import React from 'react';
import { Badge } from './Badge';
import { useTranslation } from 'react-i18next';

interface StatusBadgeProps {
  status: 'pending' | 'approved' | 'rejected' | 'verified' | 'uploading';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const { t } = useTranslation();

  const getVariant = () => {
    switch (status) {
      case 'approved':
      case 'verified':
        return 'success';
      case 'rejected':
        return 'error';
      case 'uploading':
        return 'info';
      default:
        return 'warning';
    }
  };

  const getLabel = () => {
    if (status === 'verified') return t('history.approved');
    return t(`history.${status}`);
  };

  return <Badge text={getLabel()} variant={getVariant()} />;
};
