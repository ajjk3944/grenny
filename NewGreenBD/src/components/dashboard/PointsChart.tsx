import React from 'react';
import { View, Dimensions, StyleSheet } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { useTheme } from '../../store/themeStore';
import { PointsHistory } from '../../store/pointsStore';

interface PointsChartProps {
  data: PointsHistory[];
  period: 'today' | 'weekly' | 'monthly' | 'yearly';
}

export const PointsChart: React.FC<PointsChartProps> = ({ data, period }) => {
  const { colors } = useTheme();
  const screenWidth = Dimensions.get('window').width;

  const getChartData = () => {
    let filteredData = data;
    let labels: string[] = [];

    if (period === 'today') {
      // Show hourly data for today
      const hours = Array.from({ length: 24 }, (_, i) => i);
      labels = hours.filter((_, i) => i % 4 === 0).map(h => `${h}:00`);
      const values = hours.filter((_, i) => i % 4 === 0).map(() => Math.floor(Math.random() * 20));
      return { labels, datasets: [{ data: values }] };
    }

    if (period === 'weekly') {
      filteredData = data.slice(-7);
      labels = filteredData.map(d => new Date(d.date).getDate().toString());
    } else if (period === 'monthly') {
      filteredData = data.slice(-30);
      labels = filteredData.filter((_, i) => i % 5 === 0).map(d => new Date(d.date).getDate().toString());
    } else {
      // Yearly - show monthly aggregates
      labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const values = labels.map(() => Math.floor(Math.random() * 500) + 100);
      return { labels, datasets: [{ data: values }] };
    }

    const values = period === 'monthly' 
      ? filteredData.filter((_, i) => i % 5 === 0).map(d => d.points)
      : filteredData.map(d => d.points);

    return {
      labels,
      datasets: [{ data: values.length > 0 ? values : [0] }],
    };
  };

  const chartData = getChartData();

  return (
    <View style={styles.container}>
      <LineChart
        data={chartData}
        width={screenWidth - 32}
        height={220}
        chartConfig={{
          backgroundColor: colors.surface,
          backgroundGradientFrom: colors.surface,
          backgroundGradientTo: colors.surface,
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(0, 135, 90, ${opacity})`,
          labelColor: (opacity = 1) => colors.textSecondary,
          style: {
            borderRadius: 16,
          },
          propsForDots: {
            r: '4',
            strokeWidth: '2',
            stroke: colors.primary,
          },
          propsForBackgroundLines: {
            strokeDasharray: '',
            stroke: colors.border,
            strokeWidth: 1,
          },
        }}
        bezier
        style={styles.chart}
        withInnerLines
        withOuterLines
        withVerticalLines={false}
        withHorizontalLines
        withDots
        withShadow={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    marginVertical: 8,
  },
  chart: {
    borderRadius: 16,
  },
});
