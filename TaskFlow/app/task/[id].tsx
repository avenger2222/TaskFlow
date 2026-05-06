// Powered by OnSpace.AI
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../../hooks/useAuth';
import { useTasks } from '../../hooks/useTasks';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { Task } from '../../constants/mockData';
import { Colors, Typography, Spacing, Radius, Shadow } from '../../constants/theme';

const STATUS_FLOW: Record<Task['status'], { next: Task['status'] | null; label: string; icon: string }> = {
  pending: { next: 'in_progress', label: 'Start Task', icon: 'play-arrow' },
  in_progress: { next: 'completed', label: 'Mark Complete', icon: 'check-circle' },
  completed: { next: null, label: 'Completed', icon: 'done-all' },
};

export default function TaskDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user } = useAuth();
  const { getTaskById, updateTask, deleteTask } = useTasks();
  const dashboardRoute = user?.role === 'admin' ? '/(tabs)/admin' : '/(tabs)';

  const [task, setTask] = useState<Task | null>(null);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (id) {
      const t = getTaskById(id);
      if (t) setTask(t);
    }
  }, [id, getTaskById]);

  async function handleStatusUpdate() {
    if (!task) return;
    const flow = STATUS_FLOW[task.status];
    if (!flow.next) return;
    setUpdating(true);
    try {
      const updated = await updateTask(task._id, { status: flow.next });
      setTask(updated);
    } catch (e: any) {
      Alert.alert('Error', e.message || 'Failed to update task');
    } finally {
      setUpdating(false);
    }
  }

  async function runDelete() {
    if (!task) return;

    setDeleting(true);
    try {
      await deleteTask(task._id);
      if (Platform.OS === 'web') {
        window.alert('Task deleted successfully!');
      }
      router.replace(dashboardRoute);
    } catch (e: any) {
      Alert.alert('Error', e.message || 'Failed to delete task');
      setDeleting(false);
    }
  }

  function handleDelete() {
    if (Platform.OS === 'web') {
      const confirmed = window.confirm('Delete this task? This action cannot be undone.');
      if (confirmed) {
        runDelete();
      }
      return;
    }

    Alert.alert('Delete Task', 'This action cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: runDelete,
      },
    ]);
  }

  if (!task) return <LoadingSpinner fullScreen message="Loading task..." />;

  const flow = STATUS_FLOW[task.status];
  const isAssignee = task.assignedTo === user?._id;
  const canUpdateStatus = isAssignee || user?.role === 'admin';
  const canDelete = user?.role === 'admin';

  const dueDate = new Date(task.dueDate);
  const isOverdue = dueDate < new Date() && task.status !== 'completed';

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom + Spacing.base }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {/* Status Banner */}
        <View style={styles.statusBanner}>
          <Badge variant={task.status} />
          <Badge variant={task.priority} />
          {isOverdue ? <Badge variant="high" label="Overdue" /> : null}
        </View>

        {/* Title */}
        <Text style={styles.title}>{task.title}</Text>
        <Text style={styles.description}>{task.description}</Text>

        {/* Meta Info */}
        <View style={styles.metaCard}>
          {[
            {
              icon: 'person' as const,
              label: 'Assigned to',
              value: task.assignedToName,
              highlight: isAssignee,
            },
            { icon: 'person-outline' as const, label: 'Created by', value: task.createdByName, highlight: false },
            {
              icon: 'schedule' as const,
              label: 'Due date',
              value: dueDate.toLocaleDateString('en-US', { weekday: 'short', month: 'long', day: 'numeric', year: 'numeric' }),
              highlight: isOverdue,
            },
            {
              icon: 'update' as const,
              label: 'Last updated',
              value: new Date(task.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
              highlight: false,
            },
          ].map(item => (
            <View key={item.label} style={styles.metaRow}>
              <MaterialIcons
                name={item.icon}
                size={16}
                color={item.highlight ? Colors.primary : Colors.textTertiary}
              />
              <View style={styles.metaText}>
                <Text style={styles.metaLabel}>{item.label}</Text>
                <Text style={[styles.metaValue, item.highlight && styles.metaValueHighlight]}>
                  {item.value}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Tags */}
        {task.tags.length > 0 ? (
          <View style={styles.tagsCard}>
            <Text style={styles.sectionLabel}>Tags</Text>
            <View style={styles.tags}>
              {task.tags.map(tag => (
                <View key={tag} style={styles.tag}>
                  <MaterialIcons name="label" size={12} color={Colors.primary} />
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
            </View>
          </View>
        ) : null}

        {/* Status Timeline */}
        <View style={styles.timelineCard}>
          <Text style={styles.sectionLabel}>Status Timeline</Text>
          {(['pending', 'in_progress', 'completed'] as Task['status'][]).map((s, i) => {
            const statusOrder = { pending: 0, in_progress: 1, completed: 2 };
            const current = statusOrder[task.status];
            const isDone = statusOrder[s] < current;
            const isActive = s === task.status;

            return (
              <View key={s} style={styles.timelineRow}>
                <View style={[styles.timelineDot, isDone && styles.timelineDotDone, isActive && styles.timelineDotActive]}>
                  {isDone ? (
                    <MaterialIcons name="check" size={12} color={Colors.textInverse} />
                  ) : (
                    <View style={[styles.timelineDotInner, isActive && styles.timelineDotInnerActive]} />
                  )}
                </View>
                {i < 2 ? <View style={[styles.timelineLine, isDone && styles.timelineLineDone]} /> : null}
                <Text style={[styles.timelineLabel, isActive && styles.timelineLabelActive, isDone && styles.timelineLabelDone]}>
                  {s === 'in_progress' ? 'In Progress' : s.charAt(0).toUpperCase() + s.slice(1)}
                </Text>
              </View>
            );
          })}
        </View>
      </ScrollView>

      {/* Actions */}
      <View style={styles.actions}>
        {canUpdateStatus && flow.next ? (
          <Button
            label={flow.label}
            onPress={handleStatusUpdate}
            loading={updating}
            fullWidth
            size="lg"
            variant={task.status === 'in_progress' ? 'primary' : 'outline'}
          />
        ) : task.status === 'completed' ? (
          <View style={styles.completedBanner}>
            <MaterialIcons name="check-circle" size={20} color={Colors.completed} />
            <Text style={styles.completedText}>Task Completed</Text>
          </View>
        ) : null}

        {canDelete ? (
          <Button
            label={deleting ? 'Deleting...' : 'Delete Task'}
            onPress={handleDelete}
            variant="danger"
            size="md"
            fullWidth
            loading={deleting}
          />
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: Spacing.base, gap: Spacing.base, paddingBottom: Spacing.sm },

  statusBanner: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  title: { ...Typography.h2, color: Colors.text },
  description: { ...Typography.body, color: Colors.textSecondary, lineHeight: 26 },

  metaCard: { backgroundColor: Colors.surface, borderRadius: Radius.xl, padding: Spacing.base, gap: Spacing.base, ...Shadow.sm },
  metaRow: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.sm },
  metaText: { flex: 1 },
  metaLabel: { ...Typography.caption, color: Colors.textTertiary },
  metaValue: { ...Typography.bodySmall, color: Colors.text, marginTop: 2 },
  metaValueHighlight: { color: Colors.primary, fontWeight: '600' },

  tagsCard: { backgroundColor: Colors.surface, borderRadius: Radius.xl, padding: Spacing.base, gap: Spacing.sm, ...Shadow.sm },
  sectionLabel: { ...Typography.label, color: Colors.textSecondary },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.primaryLight,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
  },
  tagText: { ...Typography.caption, color: Colors.primary, fontWeight: '600' },

  timelineCard: { backgroundColor: Colors.surface, borderRadius: Radius.xl, padding: Spacing.base, gap: Spacing.sm, ...Shadow.sm },
  timelineRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  timelineDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timelineDotDone: { backgroundColor: Colors.completed },
  timelineDotActive: { backgroundColor: Colors.primary },
  timelineDotInner: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.textTertiary },
  timelineDotInnerActive: { backgroundColor: Colors.textInverse },
  timelineLine: { position: 'absolute', left: 11, top: 24, width: 2, height: 20, backgroundColor: Colors.border },
  timelineLineDone: { backgroundColor: Colors.completed },
  timelineLabel: { ...Typography.bodySmall, color: Colors.textSecondary },
  timelineLabelActive: { color: Colors.primary, fontWeight: '700' },
  timelineLabelDone: { color: Colors.completed },

  actions: { padding: Spacing.base, gap: Spacing.sm, backgroundColor: Colors.surface, borderTopWidth: 1, borderTopColor: Colors.border },
  completedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.completedLight,
    borderRadius: Radius.lg,
    padding: Spacing.base,
  },
  completedText: { ...Typography.button, color: Colors.completed },
});
