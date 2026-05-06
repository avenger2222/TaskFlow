// Powered by OnSpace.AI
import React, { memo } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Task } from '../../constants/mockData';
import { Badge } from '../ui/Badge';
import { Colors, Typography, Spacing, Radius, Shadow } from '../../constants/theme';

interface TaskCardProps {
  task: Task;
  onPress: () => void;
  showAssignee?: boolean;
}

function formatDueDate(dateStr: string): { label: string; isOverdue: boolean; isDueSoon: boolean } {
  const due = new Date(dateStr);
  const now = new Date();
  const diffMs = due.getTime() - now.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return { label: `${Math.abs(diffDays)}d overdue`, isOverdue: true, isDueSoon: false };
  if (diffDays === 0) return { label: 'Due today', isOverdue: false, isDueSoon: true };
  if (diffDays === 1) return { label: 'Due tomorrow', isOverdue: false, isDueSoon: true };
  return {
    label: due.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    isOverdue: false,
    isDueSoon: diffDays <= 3,
  };
}

const PRIORITY_ICON: Record<Task['priority'], keyof typeof MaterialIcons.glyphMap> = {
  high: 'keyboard-arrow-up',
  medium: 'remove',
  low: 'keyboard-arrow-down',
};

export const TaskCard = memo(function TaskCard({ task, onPress, showAssignee = false }: TaskCardProps) {
  const due = formatDueDate(task.dueDate);

  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
      onPress={onPress}
    >
      {/* Priority stripe */}
      <View style={[styles.priorityStripe, styles[`stripe_${task.priority}`]]} />

      <View style={styles.content}>
        {/* Header row */}
        <View style={styles.headerRow}>
          <Badge variant={task.status} />
          <View style={styles.priorityBadge}>
            <MaterialIcons name={PRIORITY_ICON[task.priority]} size={14} color={Colors.textSecondary} />
            <Badge variant={task.priority} />
          </View>
        </View>

        {/* Title */}
        <Text style={styles.title} numberOfLines={2}>{task.title}</Text>

        {/* Description */}
        <Text style={styles.description} numberOfLines={2}>{task.description}</Text>

        {/* Footer */}
        <View style={styles.footer}>
          {showAssignee ? (
            <View style={styles.assignee}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{task.assignedToName.slice(0, 2).toUpperCase()}</Text>
              </View>
              <Text style={styles.assigneeName} numberOfLines={1}>{task.assignedToName}</Text>
            </View>
          ) : (
            <View style={styles.assignee}>
              <MaterialIcons name="person" size={14} color={Colors.textTertiary} />
              <Text style={styles.assigneeName}>Assigned by {task.createdByName}</Text>
            </View>
          )}

          <View style={[styles.dueChip, due.isOverdue && styles.dueOverdue, due.isDueSoon && styles.dueSoon]}>
            <MaterialIcons
              name="schedule"
              size={12}
              color={due.isOverdue ? Colors.error : due.isDueSoon ? Colors.warning : Colors.textTertiary}
            />
            <Text
              style={[
                styles.dueText,
                due.isOverdue && styles.dueTextOverdue,
                due.isDueSoon && styles.dueTextSoon,
              ]}
            >
              {due.label}
            </Text>
          </View>
        </View>

        {/* Tags */}
        {task.tags.length > 0 ? (
          <View style={styles.tags}>
            {task.tags.slice(0, 3).map(tag => (
              <View key={tag} style={styles.tag}>
                <Text style={styles.tagText}>#{tag}</Text>
              </View>
            ))}
          </View>
        ) : null}
      </View>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    overflow: 'hidden',
    ...Shadow.md,
    marginBottom: Spacing.base,
  },
  pressed: { opacity: 0.95, transform: [{ scale: 0.99 }] },

  priorityStripe: { width: 4 },
  stripe_high: { backgroundColor: Colors.error },
  stripe_medium: { backgroundColor: Colors.warning },
  stripe_low: { backgroundColor: Colors.success },

  content: { flex: 1, padding: Spacing.base, gap: Spacing.sm },

  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  priorityBadge: { flexDirection: 'row', alignItems: 'center', gap: 4 },

  title: { ...Typography.h4, color: Colors.text },
  description: { ...Typography.bodySmall, color: Colors.textSecondary, lineHeight: 20 },

  footer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 2 },
  assignee: { flexDirection: 'row', alignItems: 'center', gap: 6, flex: 1 },
  avatar: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontSize: 9, fontWeight: '700', color: Colors.primary },
  assigneeName: { ...Typography.caption, color: Colors.textSecondary, flex: 1 },

  dueChip: { flexDirection: 'row', alignItems: 'center', gap: 3, paddingHorizontal: 6, paddingVertical: 2, borderRadius: Radius.full, backgroundColor: Colors.background },
  dueOverdue: { backgroundColor: Colors.errorLight },
  dueSoon: { backgroundColor: Colors.warningLight },
  dueText: { ...Typography.caption, color: Colors.textTertiary },
  dueTextOverdue: { color: Colors.error, fontWeight: '600' },
  dueTextSoon: { color: Colors.warning, fontWeight: '600' },

  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  tag: { backgroundColor: Colors.background, borderRadius: Radius.full, paddingHorizontal: 8, paddingVertical: 2 },
  tagText: { ...Typography.caption, color: Colors.textSecondary },
});
