// Powered by OnSpace.AI
import React, { memo } from 'react';
import { ScrollView, Pressable, Text, StyleSheet, View } from 'react-native';
import { Colors, Typography, Spacing, Radius } from '../../constants/theme';

export type TaskFilter = 'all' | 'pending' | 'in_progress' | 'completed';
export type PriorityFilter = 'all' | 'high' | 'medium' | 'low';

interface FilterBarProps {
  statusFilter: TaskFilter;
  onStatusChange: (f: TaskFilter) => void;
}

const STATUS_OPTIONS: { value: TaskFilter; label: string }[] = [
  { value: 'all', label: 'All Tasks' },
  { value: 'pending', label: 'Pending' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
];

export const FilterBar = memo(function FilterBar({ statusFilter, onStatusChange }: FilterBarProps) {
  return (
    <View style={styles.wrapper}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {STATUS_OPTIONS.map(opt => (
          <Pressable
            key={opt.value}
            style={({ pressed }) => [
              styles.chip,
              statusFilter === opt.value && styles.chipActive,
              pressed && styles.chipPressed,
            ]}
            onPress={() => onStatusChange(opt.value)}
          >
            <Text style={[styles.chipText, statusFilter === opt.value && styles.chipTextActive]}>
              {opt.label}
            </Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
});

const styles = StyleSheet.create({
  wrapper: { minHeight: 52 },
  content: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: Spacing.base, paddingVertical: Spacing.sm, gap: Spacing.sm },
  chip: {
    height: 36,
    paddingHorizontal: Spacing.base,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surface,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  chipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  chipPressed: { opacity: 0.8 },
  chipText: { ...Typography.label, color: Colors.textSecondary },
  chipTextActive: { color: Colors.textInverse },
});
