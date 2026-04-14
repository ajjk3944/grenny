import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Dimensions,
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import BottomSheet from '@gorhom/bottom-sheet';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../store/themeStore';
import { MapPin } from '../../types';
import * as greenmapService from '../../services/greenmap';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const CATEGORIES = [
  { id: 'all', icon: 'apps', label: 'greenmap.all_categories' },
  { id: 'tree_planting', icon: 'leaf', label: 'Tree Planting' },
  { id: 'cleaning', icon: 'trash', label: 'Cleaning' },
  { id: 'river_cleanup', icon: 'water', label: 'River Cleanup' },
];

export default function GreenMapScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const mapRef = useRef<MapView>(null);
  const bottomSheetRef = useRef<BottomSheet>(null);

  const [region, setRegion] = useState({
    latitude: 23.8103,
    longitude: 90.4125,
    latitudeDelta: 0.5,
    longitudeDelta: 0.5,
  });
  const [pins, setPins] = useState<MapPin[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'all'>('all');
  const [selectedPin, setSelectedPin] = useState<MapPin | null>(null);
  const [areaStats, setAreaStats] = useState({ totalActions: 0, recentActivities: [] });

  useEffect(() => {
    initializeMap();
  }, []);

  useEffect(() => {
    loadPins();
  }, [region, selectedCategory, timeRange]);

  const initializeMap = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const location = await Location.getCurrentPositionAsync({});
        setRegion({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        });
      }
    } catch (error) {
      console.error('Failed to get location:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadPins = async () => {
    try {
      const filters = {
        category: selectedCategory !== 'all' ? selectedCategory : undefined,
        timeRange,
      };
      const data = await greenmapService.getMapPins(region, filters);
      setPins(data);
    } catch (error) {
      console.error('Failed to load pins:', error);
    }
  };

  const handleMarkerPress = async (pin: MapPin) => {
    setSelectedPin(pin);
    bottomSheetRef.current?.expand();

    // Load area stats
    try {
      const stats = await greenmapService.getAreaStats(pin.lat + ',' + pin.lng);
      setAreaStats(stats);
    } catch (error) {
      console.error('Failed to load area stats:', error);
    }
  };

  const handleRegionChangeComplete = (newRegion: typeof region) => {
    setRegion(newRegion);
  };

  const getCategoryIcon = (category: string): string => {
    const icons: Record<string, string> = {
      tree_planting: 'leaf',
      cleaning: 'trash',
      river_cleanup: 'water',
      default: 'location',
    };
    return icons[category] || icons.default;
  };

  const getCategoryColor = (category: string): string => {
    const colors: Record<string, string> = {
      tree_planting: '#10b981',
      cleaning: '#3b82f6',
      river_cleanup: '#06b6d4',
      default: '#10b981',
    };
    return colors[category] || colors.default;
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centered, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
          {t('greenmap.loading_map')}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={region}
        onRegionChangeComplete={handleRegionChangeComplete}
        showsUserLocation
        showsMyLocationButton
      >
        {pins.map((pin) => (
          <Marker
            key={pin.id}
            coordinate={{ latitude: pin.lat, longitude: pin.lng }}
            onPress={() => handleMarkerPress(pin)}
          >
            <View
              style={[
                styles.markerContainer,
                { backgroundColor: getCategoryColor(pin.category) },
              ]}
            >
              <Ionicons
                name={getCategoryIcon(pin.category) as any}
                size={20}
                color="#fff"
              />
            </View>
          </Marker>
        ))}
      </MapView>

      {/* Category Filter */}
      <View style={[styles.filterContainer, { backgroundColor: colors.card }]}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              style={[
                styles.categoryChip,
                {
                  backgroundColor:
                    selectedCategory === cat.id ? colors.primary : colors.background,
                },
              ]}
              onPress={() => setSelectedCategory(cat.id)}
            >
              <Ionicons
                name={cat.icon as any}
                size={16}
                color={selectedCategory === cat.id ? '#fff' : colors.text}
              />
              <Text
                style={[
                  styles.categoryText,
                  { color: selectedCategory === cat.id ? '#fff' : colors.text },
                ]}
              >
                {cat.id === 'all' ? t(cat.label) : cat.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Time Range Filter */}
      <View style={[styles.timeFilterContainer, { backgroundColor: colors.card }]}>
        {(['week', 'month', 'all'] as const).map((range) => (
          <TouchableOpacity
            key={range}
            style={[
              styles.timeChip,
              {
                backgroundColor: timeRange === range ? colors.primary : 'transparent',
              },
            ]}
            onPress={() => setTimeRange(range)}
          >
            <Text
              style={[
                styles.timeText,
                { color: timeRange === range ? '#fff' : colors.text },
              ]}
            >
              {t(`greenmap.time_range.${range}`)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Bottom Sheet */}
      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={['25%', '50%', '75%']}
        enablePanDownToClose
        backgroundStyle={{ backgroundColor: colors.card }}
        handleIndicatorStyle={{ backgroundColor: colors.border }}
      >
        <View style={styles.bottomSheetContent}>
          {selectedPin ? (
            <>
              <Text style={[styles.sheetTitle, { color: colors.text }]}>
                {selectedPin.userName}
              </Text>
              <Text style={[styles.sheetSubtitle, { color: colors.textSecondary }]}>
                {selectedPin.category}
              </Text>

              <View style={styles.statsRow}>
                <View style={styles.statItem}>
                  <Ionicons name="star" size={20} color="#f59e0b" />
                  <Text style={[styles.statText, { color: colors.text }]}>
                    {selectedPin.points} {t('dashboard.points')}
                  </Text>
                </View>
                <View style={styles.statItem}>
                  <Ionicons name="time" size={20} color={colors.textSecondary} />
                  <Text style={[styles.statText, { color: colors.textSecondary }]}>
                    {new Date(selectedPin.submittedAt).toLocaleDateString('bn-BD')}
                  </Text>
                </View>
              </View>

              <View style={styles.divider} />

              <Text style={[styles.areaTitle, { color: colors.text }]}>
                {t('greenmap.total_actions')}: {areaStats.totalActions}
              </Text>

              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: colors.primary }]}
              >
                <Text style={styles.actionButtonText}>
                  {t('greenmap.work_in_area')}
                </Text>
              </TouchableOpacity>
            </>
          ) : (
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              {t('greenmap.no_activities')}
            </Text>
          )}
        </View>
      </BottomSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  map: {
    flex: 1,
  },
  markerContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  filterContainer: {
    position: 'absolute',
    top: 16,
    left: 0,
    right: 0,
    paddingVertical: 12,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    gap: 6,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
  },
  timeFilterContainer: {
    position: 'absolute',
    top: 80,
    right: 16,
    borderRadius: 12,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  timeChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginBottom: 4,
  },
  timeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  bottomSheetContent: {
    padding: 20,
  },
  sheetTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  sheetSubtitle: {
    fontSize: 14,
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 24,
    marginBottom: 16,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statText: {
    fontSize: 14,
  },
  divider: {
    height: 1,
    backgroundColor: '#e5e7eb',
    marginVertical: 16,
  },
  areaTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
  },
  actionButton: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 32,
  },
});
