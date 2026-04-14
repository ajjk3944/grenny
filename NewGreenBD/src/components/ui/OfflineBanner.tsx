import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { syncService } from '../../services/sync';

export const OfflineBanner: React.FC = () => {
  const { t } = useTranslation();
  const [isOnline, setIsOnline] = useState(true);
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    setIsOnline(syncService.isOnline);
    setPendingCount(syncService.pendingUploads);

    const unsubscribe = syncService.addListener((online) => {
      setIsOnline(online);
    });

    loadPendingCount();

    return unsubscribe;
  }, []);

  const loadPendingCount = async () => {
    const pending = await syncService.getPendingUploads();
    setPendingCount(pending.length);
  };

  const handleSyncAll = async () => {
    await syncService.syncAll();
    await loadPendingCount();
  };

  if (isOnline && pendingCount === 0) {
    return null;
  }

  return (
    <View style={[styles.container, { backgroundColor: isOnline ? '#10b981' : '#eab308' }]}>
      <View style={styles.content}>
        <Ionicons
          name={isOnline ? 'cloud-upload' : 'cloud-offline'}
          size={16}
          color="#fff"
        />
        <Text style={styles.text}>
          {isOnline
            ? `${pendingCount} ${t('offline.pending_uploads')}`
            : t('offline.no_connection')}
        </Text>
      </View>
      {isOnline && pendingCount > 0 && (
        <TouchableOpacity onPress={handleSyncAll} style={styles.button}>
          <Text style={styles.buttonText}>{t('offline.upload_all')}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  text: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  button: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
  },
  buttonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
});
