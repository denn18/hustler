import { StyleSheet, Text, View } from 'react-native';

import type { DailyTask } from '../lib/tasks';
import { colors, spacing, typography } from '../theme';

type TaskListProps = {
  tasks: DailyTask[];
};

export function TaskList({ tasks }: TaskListProps) {
  return (
    <View style={styles.list}>
      {tasks.map((task, index) => (
        <View key={task.id} style={styles.row}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{index + 1}</Text>
          </View>
          <View style={styles.body}>
            <Text style={styles.taskTitle}>{task.title}</Text>
            <Text style={styles.description}>{task.description}</Text>
          </View>
          <Text style={styles.minutes}>{task.minutes}m</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: spacing.md,
  },
  row: {
    alignItems: 'center',
    backgroundColor: colors.cardMuted,
    borderRadius: 18,
    flexDirection: 'row',
    gap: spacing.md,
    padding: spacing.lg,
  },
  badge: {
    alignItems: 'center',
    backgroundColor: colors.textOnCard,
    borderRadius: 14,
    height: 34,
    justifyContent: 'center',
    width: 34,
  },
  badgeText: {
    color: colors.textPrimary,
    fontWeight: typography.weights.black,
  },
  body: {
    flex: 1,
  },
  taskTitle: {
    color: colors.textOnCard,
    fontSize: typography.sizes.body,
    fontWeight: typography.weights.black,
  },
  description: {
    color: colors.textMuted,
    lineHeight: 20,
    marginTop: spacing.xs,
  },
  minutes: {
    color: colors.accentDark,
    fontWeight: typography.weights.black,
  },
});
