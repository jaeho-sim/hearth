import React, { useMemo } from 'react';
import { SectionList, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ScreenContainer } from '@/components/ScreenContainer';
import { EmptyState } from '@/components/EmptyState';
import { FAB } from '@/components/FAB';
import { ChoreRow } from '@/components/ChoreRow';
import { spacing, typography } from '@/theme';
import { useAuth } from '@/context/AuthContext';
import { useCurrentHousehold } from '@/context/HouseholdContext';
import { useChores } from '@/hooks/useChores';
import { completeChore, uncompleteChore } from '@/services/choresService';
import { Chore } from '@/types/models';

export function ChoresScreen() {
  const { household } = useCurrentHousehold();
  const { profile } = useAuth();
  const { chores, loading } = useChores(household?.id);
  const navigation = useNavigation<any>();

  const sections = useMemo(() => {
    const active = chores.filter((c) => !c.completed);
    const done = chores.filter((c) => c.completed);
    return [
      ...(active.length ? [{ title: 'Upcoming', data: active }] : []),
      ...(done.length ? [{ title: 'Completed', data: done }] : []),
    ];
  }, [chores]);

  function handleToggle(chore: Chore) {
    if (!household || !profile) return;
    if (chore.completed) {
      uncompleteChore(household.id, chore.id);
    } else {
      completeChore(household.id, chore, profile.uid, profile.displayName);
    }
  }

  return (
    <ScreenContainer>
      <SectionList
        sections={sections}
        keyExtractor={(c) => c.id}
        contentContainerStyle={{ paddingTop: spacing.md, paddingBottom: spacing.xxl, flexGrow: 1 }}
        renderSectionHeader={({ section }) => <Text style={styles.sectionHeader}>{section.title.toUpperCase()}</Text>}
        renderItem={({ item }) => (
          <ChoreRow chore={item} onToggle={() => handleToggle(item)} onPress={() => navigation.navigate('AddEditChore', { choreId: item.id })} />
        )}
        ListEmptyComponent={
          !loading ? <EmptyState icon="checkbox-outline" title="No chores yet" subtitle="Add one to keep the house running smoothly." /> : null
        }
      />
      <FAB onPress={() => navigation.navigate('AddEditChore', {})} />
    </ScreenContainer>
  );
}

const styles = {
  sectionHeader: { ...typography.label, marginTop: spacing.md, marginBottom: spacing.sm },
} as const;
