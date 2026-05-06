// Powered by OnSpace.AI
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from '../contexts/AuthContext';
import { TaskProvider } from '../contexts/TaskContext';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <TaskProvider>
          <StatusBar style="auto" />
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="login" />
            <Stack.Screen name="(tabs)" />
            <Stack.Screen
              name="task/[id]"
              options={{
                headerShown: true,
                title: 'Task Details',
                headerBackTitle: 'Back',
                headerStyle: { backgroundColor: '#FFFFFF' },
                headerTintColor: '#2563EB',
                headerTitleStyle: { fontWeight: '600', color: '#0F172A' },
              }}
            />
            <Stack.Screen
              name="task/create"
              options={{
                headerShown: true,
                title: 'Create Task',
                headerBackTitle: 'Back',
                headerStyle: { backgroundColor: '#FFFFFF' },
                headerTintColor: '#2563EB',
                headerTitleStyle: { fontWeight: '600', color: '#0F172A' },
              }}
            />
          </Stack>
        </TaskProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
