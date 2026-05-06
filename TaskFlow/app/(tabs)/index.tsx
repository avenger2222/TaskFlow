// Powered by OnSpace.AI
import React, { useEffect, useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  Pressable,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../../hooks/useAuth';
import { useTasks } from '../../hooks/useTasks';
import { TaskCard } from '../../components/feature/TaskCard';
import { FilterBar, TaskFilter } from '../../components/feature/FilterBar';
import { EmptyState } from '../../components/ui/EmptyState';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { Badge } from '../../components/ui/Badge';
import { Task } from '../../constants/mockData';
import { Colors, Typography, Spacing, Radius, Shadow } from '../../constants/theme';

export default function TasksScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user } = useAuth();
  const { tasks, isLoading, fetchTasks } = useTasks();

  const [statusFilter, setStatusFilter] = useState<TaskFilter>('all');
  const [search, setSearch] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (user) fetchTasks(user._id, user.role);
  }, [fetchTasks, user]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    if (user) await fetchTasks(user._id, user.role);
    setRefreshing(false);
  }, [fetchTasks, user]);

  const filteredTasks = useMemo(() => {
    let list = tasks;
    if (statusFilter !== 'all') list = list.filter(t => t.status === statusFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        t =>
          t.title.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          t.tags.some(tag => tag.toLowerCase().includes(q)) ||
          t.assignedToName.toLowerCase().includes(q)
      );
    }
    return list;
  }, [tasks, statusFilter, search]);

  const stats = useMemo(() => ({
    total: tasks.length,
    pending: tasks.filter(t => t.status === 'pending').length,
    inProgress: tasks.filter(t => t.status === 'in_progress').length,
    completed: tasks.filter(t => t.status === 'completed').length,
  }), [tasks]);

  function renderTask({ item }: { item: Task }) {
    return (
      <TaskCard
        task={item}
        onPress={() => router.push(`/task/${item._id}`)}
        showAssignee={user?.role === 'admin'}
      />
    );
  }

  const ListHeader = () => (
    <View>
      {/* Stats Row */}
      <View style={styles.statsRow}>
        {[
          { label: 'Total', value: stats.total, color: Colors.primary },
          { label: 'Pending', value: stats.pending, color: Colors.pending },
          { label: 'Active', value: stats.inProgress, color: Colors.inProgress },
          { label: 'Done', value: stats.completed, color: Colors.completed },
        ].map(s => (
          <View key={s.label} style={styles.statCard}>
            <Text style={[styles.statValue, { color: s.color }]}>{s.value}</Text>
            <Text style={styles.statLabel}>{s.label}</Text>
          </View>
        ))}
      </View>

      {/* Search */}
      <View style={styles.searchWrapper}>
        <MaterialIcons name="search" size={18} color={Colors.textTertiary} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search tasks, tags..."
          placeholderTextColor={Colors.textTertiary}
          value={search}
          onChangeText={setSearch}
        />
        {search.length > 0 ? (
          <Pressable onPress={() => setSearch('')} hitSlop={8}>
            <MaterialIcons name="close" size={16} color={Colors.textTertiary} />
          </Pressable>
        ) : null}
      </View>

      <FilterBar statusFilter={statusFilter} onStatusChange={setStatusFilter} />

      <View style={styles.listHeader}>
        <Text style={styles.listHeaderText}>
          {filteredTasks.length} {filteredTasks.length === 1 ? 'task' : 'tasks'}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>
            {new Date().getHours() < 12 ? 'Good morning' : new Date().getHours() < 17 ? 'Good afternoon' : 'Good evening'},
          </Text>
          <View style={styles.nameRow}>
            <Text style={styles.name}>{user?.name}</Text>
            <Badge variant={user?.role || 'user'} />
          </View>
        </View>
        {user?.role === 'admin' ? (
          <Pressable
            style={({ pressed }) => [styles.addBtn, pressed && { opacity: 0.8 }]}
            onPress={() => router.push('/task/create')}
          >
            <MaterialIcons name="add" size={24} color={Colors.textInverse} />
          </Pressable>
        ) : null}
      </View>

      {isLoading && !refreshing ? (
        <LoadingSpinner message="Fetching tasks..." />
      ) : (
        <FlatList
          data={filteredTasks}
          keyExtractor={item => item._id}
          renderItem={renderTask}
          ListHeaderComponent={ListHeader}
          ListEmptyComponent={
            <EmptyState
              icon={search ? 'search-off' : 'assignment'}
              title={search ? 'No matching tasks' : 'No tasks yet'}
              subtitle={
                search
                  ? 'Try different search terms'
                  : user?.role === 'admin'
                  ? 'Create your first task using the + button'
                  : 'Tasks assigned to you will appear here'
              }
            />
          }
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />
          }
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
  greeting: { ...Typography.bodySmall, color: Colors.textSecondary },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginTop: 2 },
  name: { ...Typography.h3, color: Colors.text },
  addBtn: {
    width: 44,
    height: 44,
    borderRadius: Radius.md,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadow.md,
  },

  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.base,
    gap: Spacing.sm,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    padding: Spacing.sm,
    alignItems: 'center',
    ...Shadow.sm,
  },
  statValue: { ...Typography.h3, fontWeight: '700' },
  statLabel: { ...Typography.caption, color: Colors.textSecondary, marginTop: 2 },

  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    marginHorizontal: Spacing.base,
    marginTop: Spacing.base,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm + 2,
    gap: Spacing.sm,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  searchInput: { flex: 1, ...Typography.body, color: Colors.text, padding: 0 },

  listHeader: { paddingHorizontal: Spacing.base, paddingVertical: Spacing.sm },
  listHeaderText: { ...Typography.caption, color: Colors.textSecondary, fontWeight: '600' },

  listContent: { paddingHorizontal: Spacing.base, paddingBottom: Spacing.xxl },
});
