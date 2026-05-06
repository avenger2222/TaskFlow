// Powered by OnSpace.AI
import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../../hooks/useAuth';
import { useTasks } from '../../hooks/useTasks';
import { TaskCard } from '../../components/feature/TaskCard';
import { FilterBar, TaskFilter } from '../../components/feature/FilterBar';
import { EmptyState } from '../../components/ui/EmptyState';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { Task } from '../../constants/mockData';
import { Colors, Typography, Spacing, Radius, Shadow } from '../../constants/theme';

export default function AdminScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user } = useAuth();
  const { tasks, isLoading, fetchTasks } = useTasks();

  const [statusFilter, setStatusFilter] = useState<TaskFilter>('all');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (user?.role === 'admin') fetchTasks(user._id, user.role);
  }, [fetchTasks, user]);

  async function onRefresh() {
    setRefreshing(true);
    if (user) await fetchTasks(user._id, user.role);
    setRefreshing(false);
  }

  const filtered = useMemo(() => {
    if (statusFilter === 'all') return tasks;
    return tasks.filter(t => t.status === statusFilter);
  }, [tasks, statusFilter]);

  const userStats = useMemo(() => {
    const map: Record<string, { name: string; count: number; completed: number }> = {};
    tasks.forEach(t => {
      if (!map[t.assignedTo]) map[t.assignedTo] = { name: t.assignedToName, count: 0, completed: 0 };
      map[t.assignedTo].count++;
      if (t.status === 'completed') map[t.assignedTo].completed++;
    });
    return Object.values(map);
  }, [tasks]);

  function renderTask({ item }: { item: Task }) {
    return <TaskCard task={item} onPress={() => router.push(`/task/${item._id}`)} showAssignee />;
  }

  const ListHeader = () => (
    <View>
      {/* Team Overview */}
      <Text style={styles.sectionTitle}>Team Overview</Text>
      <View style={styles.teamCards}>
        {userStats.map(u => (
          <View key={u.name} style={styles.teamCard}>
            <View style={styles.teamAvatar}>
              <Text style={styles.teamAvatarText}>{u.name.slice(0, 2).toUpperCase()}</Text>
            </View>
            <Text style={styles.teamName} numberOfLines={1}>{u.name}</Text>
            <Text style={styles.teamStat}>
              {u.completed}/{u.count} done
            </Text>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${u.count > 0 ? (u.completed / u.count) * 100 : 0}%` as any },
                ]}
              />
            </View>
          </View>
        ))}
      </View>

      <View style={styles.divider} />
      <Text style={styles.sectionTitle}>All Tasks</Text>
      <FilterBar statusFilter={statusFilter} onStatusChange={setStatusFilter} />
      <View style={styles.listHeader}>
        <Text style={styles.listHeaderText}>{filtered.length} tasks</Text>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Admin Panel</Text>
          <Text style={styles.headerSubtitle}>{tasks.length} total tasks</Text>
        </View>
        <Pressable
          style={({ pressed }) => [styles.addBtn, pressed && { opacity: 0.8 }]}
          onPress={() => router.push('/task/create')}
        >
          <MaterialIcons name="add" size={22} color={Colors.textInverse} />
          <Text style={styles.addBtnText}>New Task</Text>
        </Pressable>
      </View>

      {isLoading && !refreshing ? (
        <LoadingSpinner message="Loading all tasks..." />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={item => item._id}
          renderItem={renderTask}
          ListHeaderComponent={ListHeader}
          ListEmptyComponent={
            <EmptyState icon="assignment" title="No tasks found" subtitle="Create a task to get started" />
          }
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.admin} />}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.base,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTitle: { ...Typography.h3, color: Colors.text },
  headerSubtitle: { ...Typography.caption, color: Colors.textSecondary, marginTop: 2 },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.admin,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.md,
    ...Shadow.sm,
  },
  addBtnText: { ...Typography.label, color: Colors.textInverse },

  sectionTitle: { ...Typography.h4, color: Colors.text, paddingHorizontal: Spacing.base, paddingTop: Spacing.base },
  teamCards: { flexDirection: 'row', paddingHorizontal: Spacing.base, paddingTop: Spacing.sm, gap: Spacing.sm },
  teamCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.base,
    alignItems: 'center',
    gap: 4,
    ...Shadow.sm,
  },
  teamAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.adminLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  teamAvatarText: { fontSize: 14, fontWeight: '700', color: Colors.admin },
  teamName: { ...Typography.caption, fontWeight: '600', color: Colors.text, textAlign: 'center' },
  teamStat: { ...Typography.caption, color: Colors.textSecondary },
  progressBar: { width: '100%', height: 4, backgroundColor: Colors.border, borderRadius: 2, marginTop: 4 },
  progressFill: { height: 4, backgroundColor: Colors.admin, borderRadius: 2 },

  divider: { height: 1, backgroundColor: Colors.border, marginHorizontal: Spacing.base, marginTop: Spacing.base },

  listHeader: { paddingHorizontal: Spacing.base, paddingVertical: Spacing.sm },
  listHeaderText: { ...Typography.caption, color: Colors.textSecondary, fontWeight: '600' },

  listContent: { paddingHorizontal: Spacing.base, paddingBottom: Spacing.xxl },
});
