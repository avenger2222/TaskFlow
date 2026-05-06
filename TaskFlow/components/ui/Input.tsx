// Powered by OnSpace.AI
import React, { memo, useState } from 'react';
import { View, Text, TextInput, StyleSheet, Pressable, ViewStyle } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Radius } from '../../constants/theme';

interface InputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  error?: string;
  multiline?: boolean;
  numberOfLines?: number;
  leftIcon?: keyof typeof MaterialIcons.glyphMap;
  style?: ViewStyle;
  editable?: boolean;
}

export const Input = memo(function Input({
  label,
  placeholder,
  value,
  onChangeText,
  secureTextEntry,
  keyboardType = 'default',
  autoCapitalize = 'none',
  error,
  multiline,
  numberOfLines = 1,
  leftIcon,
  style,
  editable = true,
}: InputProps) {
  const [focused, setFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={[styles.container, style]}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View
        style={[
          styles.inputWrapper,
          focused && styles.inputFocused,
          error ? styles.inputError : null,
          !editable && styles.inputDisabled,
        ]}
      >
        {leftIcon ? (
          <MaterialIcons
            name={leftIcon}
            size={18}
            color={focused ? Colors.primary : Colors.textTertiary}
            style={styles.leftIcon}
          />
        ) : null}
        <TextInput
          style={[styles.input, multiline && styles.multiline]}
          placeholder={placeholder}
          placeholderTextColor={Colors.textTertiary}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry && !showPassword}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          multiline={multiline}
          numberOfLines={multiline ? numberOfLines : 1}
          editable={editable}
          accessibilityLabel={label || placeholder}
        />
        {secureTextEntry ? (
          <Pressable onPress={() => setShowPassword(!showPassword)} hitSlop={8}>
            <MaterialIcons
              name={showPassword ? 'visibility' : 'visibility-off'}
              size={18}
              color={Colors.textTertiary}
            />
          </Pressable>
        ) : null}
      </View>
      {error ? (
        <View style={styles.errorRow}>
          <MaterialIcons name="error-outline" size={12} color={Colors.error} />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}
    </View>
  );
});

const styles = StyleSheet.create({
  container: { gap: Spacing.xs },
  label: { ...Typography.label, color: Colors.text },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    borderWidth: 1.5,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm + 2,
    gap: Spacing.sm,
  },
  inputFocused: { borderColor: Colors.borderFocus },
  inputError: { borderColor: Colors.error },
  inputDisabled: { backgroundColor: Colors.background, opacity: 0.7 },
  input: { flex: 1, ...Typography.body, color: Colors.text, padding: 0 },
  multiline: { minHeight: 80, textAlignVertical: 'top' },
  leftIcon: {},
  errorRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  errorText: { ...Typography.caption, color: Colors.error },
});
