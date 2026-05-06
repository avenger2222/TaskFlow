// Powered by OnSpace.AI
import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../../hooks/useAuth';
import { useTasks } from '../../hooks/useTasks';
import { Badge } from '../../components/ui/Badge';
import { Colors, Typography, Spacing, Radius, Shadow } from '../../constants/theme';

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user, logout } = useAuth();
  const { tasks } = useTasks();

  const myStats = useMemo(() => {
    const myTasks = user?.role === 'admin' ? tasks : tasks.filter(t => t.assignedTo === user?._id);
    return {
      total: myTasks.length,
      pending: myTasks.filter(t => t.status === 'pending').length,
      inProgress: myTasks.filter(t => t.status === 'in_progress').length,
      completed: myTasks.filter(t => t.status === 'completed').length,
      completionRate: myTasks.length > 0
        ? Math.round((myTasks.filter(t => t.status === 'completed').length / myTasks.length) * 100)
        : 0,
    };
  }, [tasks, user]);

  function handleLogout() {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: async () => { await logout(); router.replace('/login'); } },
    ]);
  }

  const INFO_ITEMS = [
    { icon: 'email' as const, label: 'Email', value: user?.email || '' },
    { icon: 'badge' as const, label: 'Role', value: user?.role === 'admin' ? 'Administrator' : 'Team Member' },
    { icon: 'calendar-today' as const, label: 'Member since', value: user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : '' },
  ];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {/* Avatar Card */}
        <View style={styles.avatarCard}>
          <View style={[styles.avatar, user?.role === 'admin' ? styles.avatarAdmin : styles.avatarUser]}>
            <Text style={styles.avatarText}>{user?.avatar || 'U'}</Text>
          </View>
          <Text style={styles.name}>{user?.name}</Text>
          <Badge variant={user?.role || 'user'} />
        </View>

        {/* Stats */}
        <View style={styles.statsCard}>
          <Text style={styles.sectionTitle}>Task Statistics</Text>
          <View style={styles.statsGrid}>
            {[
              { label: 'Total', value: myStats.total, color: Colors.primary },
              { label: 'Pending', value: myStats.pending, color: Colors.pending },
              { label: 'Active', value: myStats.inProgress, color: Colors.inProgress },
              { label: 'Done', value: myStats.completed, color: Colors.completed },
            ].map(s => (
              <View key={s.label} style={styles.statItem}>
                <Text style={[styles.statValue, { color: s.color }]}>{s.value}</Text>
                <Text style={styles.statLabel}>{s.label}</Text>
              </View>
            ))}
          </View>
          <View style={styles.completionRow}>
            <Text style={styles.completionLabel}>Completion Rate</Text>
            <Text style={styles.completionValue}>{myStats.completionRate}%</Text>
          </View>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${myStats.completionRate}%` as any }]} />
          </View>
        </View>

        {/* Info */}
        <View style={styles.infoCard}>
          <Text style={styles.sectionTitle}>Account Info</Text>
          {INFO_ITEMS.map(item => (
            <View key={item.label} style={styles.infoRow}>
              <MaterialIcons name={item.icon} size={18} color={Colors.primary} />
              <View style={styles.infoText}>
                <Text style={styles.infoLabel}>{item.label}</Text>
                <Text style={styles.infoValue}>{item.value}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Backend Info Card */}
        <View style={styles.backendCard}>
          <MaterialIcons name="info-outline" size={18} color={Colors.inProgress} />
          <View style={{ flex: 1 }}>
            <Text style={styles.backendTitle}>Backend Mode</Text>
            <Text style={styles.backendText}>
              Currently using mock data (AsyncStorage). To connect to a real Node.js + MongoDB backend, update{' '}
              <Text style={styles.backendCode}>services/apiClient.ts</Text> — set USE_MOCK_BACKEND = false and update BASE_URL.
            </Text>
          </View>
        </View>

        {/* Logout */}
        <Pressable
          style={({ pressed }) => [styles.logoutBtn, pressed && { opacity: 0.8 }]}
          onPress={handleLogout}
        >
          <MaterialIcons name="logout" size={18} color={Colors.error} />
          <Text style={styles.logoutText}>Sign Out</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.base,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTitle: { ...Typography.h3, color: Colors.text },

  content: { padding: Spacing.base, gap: Spacing.base, paddingBottom: Spacing.xxxl },

  avatarCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    padding: Spacing.xl,
    alignItems: 'center',
    gap: Spacing.sm,
    ...Shadow.md,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xs,
  },
  avatarAdmin: { backgroundColor: Colors.adminLight },
  avatarUser: { backgroundColor: Colors.primaryLight },
  avatarText: { fontSize: 28, fontWeight: '700', color: Colors.primary },
  name: { ...Typography.h2, color: Colors.text },

  statsCard: { backgroundColor: Colors.surface, borderRadius: Radius.xl, padding: Spacing.base, gap: Spacing.base, ...Shadow.sm },
  sectionTitle: { ...Typography.h4, color: Colors.text },
  statsGrid: { flexDirection: 'row', justifyContent: 'space-between' },
  statItem: { alignItems: 'center', gap: 4 },
  statValue: { ...Typography.h3, fontWeight: '700' },
  statLabel: { ...Typography.caption, color: Colors.textSecondary },
  completionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  completionLabel: { ...Typography.label, color: Colors.textSecondary },
  completionValue: { ...Typography.h4, color: Colors.primary },
  progressBar: { height: 8, backgroundColor: Colors.border, borderRadius: 4 },
  progressFill: { height: 8, backgroundColor: Colors.primary, borderRadius: 4 },

  infoCard: { backgroundColor: Colors.surface, borderRadius: Radius.xl, padding: Spacing.base, gap: Spacing.base, ...Shadow.sm },
  infoRow: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.sm, paddingVertical: 4 },
  infoText: { flex: 1 },
  infoLabel: { ...Typography.caption, color: Colors.textSecondary },
  infoValue: { ...Typography.bodySmall, color: Colors.text, marginTop: 2 },

  backendCard: {
    flexDirection: 'row',
    backgroundColor: Colors.inProgressLight,
    borderRadius: Radius.lg,
    padding: Spacing.base,
    gap: Spacing.sm,
    borderLeftWidth: 3,
    borderLeftColor: Colors.inProgress,
  },
  backendTitle: { ...Typography.label, color: Colors.inProgress, marginBottom: 4 },
  backendText: { ...Typography.caption, color: Colors.textSecondary, lineHeight: 18 },
  backendCode: { fontWeight: '600', color: Colors.text },

  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.errorLight,
    borderRadius: Radius.lg,
    padding: Spacing.base,
  },
  logoutText: { ...Typography.button, color: Colors.error },
});
