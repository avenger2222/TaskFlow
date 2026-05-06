// Powered by OnSpace.AI
import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Typography, Spacing, Radius } from '../../constants/theme';

type BadgeVariant = 'pending' | 'in_progress' | 'completed' | 'admin' | 'user' | 'high' | 'medium' | 'low';

interface BadgeProps {
  variant: BadgeVariant;
  label?: string;
}

const BADGE_CONFIG: Record<BadgeVariant, { bg: string; text: string; defaultLabel: string }> = {
  pending: { bg: Colors.pendingLight, text: Colors.pending, defaultLabel: 'Pending' },
  in_progress: { bg: Colors.inProgressLight, text: Colors.inProgress, defaultLabel: 'In Progress' },
  completed: { bg: Colors.completedLight, text: Colors.completed, defaultLabel: 'Completed' },
  admin: { bg: Colors.adminLight, text: Colors.admin, defaultLabel: 'Admin' },
  user: { bg: Colors.primaryLight, text: Colors.primary, defaultLabel: 'User' },
  high: { bg: Colors.errorLight, text: Colors.error, defaultLabel: 'High' },
  medium: { bg: Colors.warningLight, text: Colors.warning, defaultLabel: 'Medium' },
  low: { bg: Colors.completedLight, text: Colors.success, defaultLabel: 'Low' },
};

export const Badge = memo(function Badge({ variant, label }: BadgeProps) {
  const config = BADGE_CONFIG[variant];
  return (
    <View style={[styles.badge, { backgroundColor: config.bg }]}>
      <Text style={[styles.text, { color: config.text }]}>{label || config.defaultLabel}</Text>
    </View>
  );
});

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: Radius.full,
    alignSelf: 'flex-start',
  },
  text: { ...Typography.caption, fontWeight: '600' },
});
