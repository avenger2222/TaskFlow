// Powered by OnSpace.AI
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../../hooks/useAuth';
import { useTasks } from '../../hooks/useTasks';
import { authService } from '../../services/authService';
import { Button, Input } from '../../components';
import { User } from '../../constants/mockData';
import { Colors, Typography, Spacing, Radius, Shadow } from '../../constants/theme';

const PRIORITIES = [
  { value: 'low' as const, label: 'Low', color: Colors.success, bg: Colors.completedLight },
  { value: 'medium' as const, label: 'Medium', color: Colors.warning, bg: Colors.warningLight },
  { value: 'high' as const, label: 'High', color: Colors.error, bg: Colors.errorLight },
];

export default function CreateTaskScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user } = useAuth();
  const { createTask } = useTasks();
  const dashboardRoute = user?.role === 'admin' ? '/(tabs)/admin' : '/(tabs)';

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [selectedUserId, setSelectedUserId] = useState('');
  const [selectedUserName, setSelectedUserName] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [users, setUsers] = useState<Omit<User, 'password'>[]>([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    loadUsers();
    // Default due date: 7 days from now
    const d = new Date();
    d.setDate(d.getDate() + 7);
    setDueDate(d.toISOString().split('T')[0]);
  }, []);

  async function loadUsers() {
    try {
      const all = await authService.getAllUsers();
      setUsers(all);
    } catch {}
  }

  function validate(): boolean {
    const e: Record<string, string> = {};
    if (!title.trim()) e.title = 'Title is required';
    if (!description.trim()) e.description = 'Description is required';
    if (!selectedUserId) e.assignee = 'Please select an assignee';
    if (!dueDate) e.dueDate = 'Due date is required';
    else {
      const d = new Date(dueDate);
      if (isNaN(d.getTime())) e.dueDate = 'Invalid date format (YYYY-MM-DD)';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleCreate() {
    if (!validate() || !user) return;
    setLoading(true);
    try {
      await createTask(
        {
          title: title.trim(),
          description: description.trim(),
          priority,
          assignedTo: selectedUserId,
          assignedToName: selectedUserName,
          dueDate: new Date(dueDate).toISOString(),
          tags: tagsInput.trim() ? tagsInput.split(',').map(t => t.trim()).filter(Boolean) : [],
        },
        user._id,
        user.name
      );
      if (Platform.OS === 'web') {
        window.alert('Task created successfully!');
        router.replace(dashboardRoute);
        return;
      }

      Alert.alert('Success', 'Task created successfully!', [
        { text: 'OK', onPress: () => router.replace(dashboardRoute) },
      ]);
    } catch (e: any) {
      Alert.alert('Error', e.message || 'Failed to create task');
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + Spacing.xxl }]}
        keyboardShouldPersistTaps="handled"
      >
        {/* Task Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Task Details</Text>
          <Input
            label="Title *"
            placeholder="Enter task title"
            value={title}
            onChangeText={setTitle}
            autoCapitalize="sentences"
            leftIcon="title"
            error={errors.title}
          />
          <Input
            label="Description *"
            placeholder="Describe the task in detail..."
            value={description}
            onChangeText={setDescription}
            autoCapitalize="sentences"
            multiline
            numberOfLines={4}
            leftIcon="description"
            error={errors.description}
          />
        </View>

        {/* Priority */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Priority</Text>
          <View style={styles.priorityRow}>
            {PRIORITIES.map(p => (
              <Pressable
                key={p.value}
                style={({ pressed }) => [
                  styles.priorityChip,
                  { borderColor: p.color },
                  priority === p.value && { backgroundColor: p.bg },
                  pressed && { opacity: 0.8 },
                ]}
                onPress={() => setPriority(p.value)}
              >
                <MaterialIcons
                  name={priority === p.value ? 'radio-button-checked' : 'radio-button-unchecked'}
                  size={16}
                  color={p.color}
                />
                <Text style={[styles.priorityLabel, { color: priority === p.value ? p.color : Colors.textSecondary }]}>
                  {p.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Assignee */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Assign To *</Text>
          {errors.assignee ? <Text style={styles.fieldError}>{errors.assignee}</Text> : null}
          <View style={styles.userList}>
            {users.map(u => (
              <Pressable
                key={u._id}
                style={({ pressed }) => [
                  styles.userItem,
                  selectedUserId === u._id && styles.userItemSelected,
                  pressed && { opacity: 0.85 },
                ]}
                onPress={() => { setSelectedUserId(u._id); setSelectedUserName(u.name); }}
              >
                <View style={[styles.userAvatar, selectedUserId === u._id && styles.userAvatarSelected]}>
                  <Text style={[styles.userAvatarText, selectedUserId === u._id && styles.userAvatarTextSelected]}>
                    {u.avatar}
                  </Text>
                </View>
                <View style={styles.userInfo}>
                  <Text style={styles.userName}>{u.name}</Text>
                  <Text style={styles.userEmail}>{u.email}</Text>
                </View>
                {selectedUserId === u._id ? (
                  <MaterialIcons name="check-circle" size={20} color={Colors.primary} />
                ) : (
                  <MaterialIcons name="radio-button-unchecked" size={20} color={Colors.border} />
                )}
              </Pressable>
            ))}
          </View>
        </View>

        {/* Due Date & Tags */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Additional Info</Text>
          <Input
            label="Due Date * (YYYY-MM-DD)"
            placeholder="2025-12-31"
            value={dueDate}
            onChangeText={setDueDate}
            leftIcon="calendar-today"
            error={errors.dueDate}
          />
          <Input
            label="Tags (comma-separated)"
            placeholder="frontend, urgent, review"
            value={tagsInput}
            onChangeText={setTagsInput}
            autoCapitalize="none"
            leftIcon="label"
          />
        </View>

        <Button
          label="Create Task"
          onPress={handleCreate}
          loading={loading}
          fullWidth
          size="lg"
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  content: { padding: Spacing.base, gap: Spacing.base },

  section: { backgroundColor: Colors.surface, borderRadius: Radius.xl, padding: Spacing.base, gap: Spacing.base, ...Shadow.sm },
  sectionTitle: { ...Typography.h4, color: Colors.text },

  priorityRow: { flexDirection: 'row', gap: Spacing.sm },
  priorityChip: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderWidth: 1.5,
    borderRadius: Radius.md,
    paddingVertical: Spacing.sm,
  },
  priorityLabel: { ...Typography.label },

  fieldError: { ...Typography.caption, color: Colors.error },

  userList: { gap: Spacing.sm },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    padding: Spacing.sm,
    borderRadius: Radius.md,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  userItemSelected: { borderColor: Colors.primary, backgroundColor: Colors.primaryLight },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userAvatarSelected: { backgroundColor: Colors.primary },
  userAvatarText: { fontSize: 14, fontWeight: '700', color: Colors.textSecondary },
  userAvatarTextSelected: { color: Colors.textInverse },
  userInfo: { flex: 1 },
  userName: { ...Typography.bodySmall, fontWeight: '600', color: Colors.text },
  userEmail: { ...Typography.caption, color: Colors.textSecondary },
});
