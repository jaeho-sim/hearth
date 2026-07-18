import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { ScreenContainer } from '@/components/ScreenContainer';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { TextField } from '@/components/TextField';
import { colors, spacing, typography } from '@/theme';
import { useAuth } from '@/context/AuthContext';
import { createHousehold } from '@/services/householdService';
import { findPendingInvitesForEmail } from '@/services/inviteService';
import { acceptInvite } from '@/services/acceptInvite';
import { Invite } from '@/types/models';

export function CreateOrJoinHouseholdScreen() {
  const { user, profile } = useAuth();
  const [mode, setMode] = useState<'choose' | 'create'>('choose');
  const [name, setName] = useState('');
  const [busy, setBusy] = useState(false);
  const [invites, setInvites] = useState<Invite[]>([]);
  const [loadingInvites, setLoadingInvites] = useState(true);

  useEffect(() => {
    if (!profile?.email) return;
    findPendingInvitesForEmail(profile.email)
      .then(setInvites)
      .finally(() => setLoadingInvites(false));
  }, [profile?.email]);

  async function handleCreate() {
    if (!user || !profile || !name.trim()) return;
    setBusy(true);
    try {
      await createHousehold(name.trim(), {
        uid: user.uid,
        displayName: profile.displayName,
        email: profile.email,
        photoURL: profile.photoURL,
        role: 'owner',
        joinedAt: Date.now(),
      });
    } finally {
      setBusy(false);
    }
  }

  async function handleAccept(invite: Invite) {
    setBusy(true);
    try {
      await acceptInvite(invite.id);
    } finally {
      setBusy(false);
    }
  }

  if (mode === 'create') {
    return (
      <ScreenContainer>
        <Text style={typography.h2}>Name your household</Text>
        <Text style={[typography.bodyMuted, styles.subtitle]}>You can invite others once it's set up.</Text>
        <TextField placeholder="e.g. The Kim House" value={name} onChangeText={setName} autoFocus style={{ marginTop: spacing.lg }} />
        <Button title="Create household" onPress={handleCreate} loading={busy} disabled={!name.trim()} />
        <Button title="Back" variant="ghost" onPress={() => setMode('choose')} style={{ marginTop: spacing.sm }} />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <Text style={typography.h2}>Welcome{profile ? `, ${profile.displayName.split(' ')[0]}` : ''}</Text>
      <Text style={[typography.bodyMuted, styles.subtitle]}>Create a new household or accept an invite below.</Text>

      {!loadingInvites && invites.length > 0 && (
        <View style={{ marginTop: spacing.lg }}>
          <Text style={typography.label}>PENDING INVITES</Text>
          <FlatList
            data={invites}
            keyExtractor={(i) => i.id}
            scrollEnabled={false}
            contentContainerStyle={{ gap: spacing.sm, marginTop: spacing.sm }}
            renderItem={({ item }) => (
              <Card style={styles.inviteCard}>
                <View style={{ flex: 1 }}>
                  <Text style={typography.h3}>{item.householdName}</Text>
                  <Text style={typography.caption}>Invited by {item.invitedByName}</Text>
                </View>
                <Button title="Join" onPress={() => handleAccept(item)} loading={busy} />
              </Card>
            )}
          />
        </View>
      )}

      <Button title="Create a household" onPress={() => setMode('create')} style={{ marginTop: spacing.xl }} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  subtitle: { marginTop: spacing.xs },
  inviteCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
});
