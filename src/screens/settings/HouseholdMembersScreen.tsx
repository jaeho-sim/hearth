import React, { useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ScreenContainer } from '@/components/ScreenContainer';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { TextField } from '@/components/TextField';
import { Avatar } from '@/components/Avatar';
import { colors, spacing, typography } from '@/theme';
import { useAuth } from '@/context/AuthContext';
import { useCurrentHousehold } from '@/context/HouseholdContext';
import { inviteMemberByEmail } from '@/services/inviteService';
import { removeMember } from '@/services/householdService';

export function HouseholdMembersScreen() {
  const { profile } = useAuth();
  const { household } = useCurrentHousehold();
  const [email, setEmail] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  if (!household || !profile) return null;
  const members = Object.values(household.members).filter(Boolean);
  const isOwner = household.members[profile.uid]?.role === 'owner';

  async function handleInvite() {
    if (!email.trim() || !household || !profile) return;
    setSending(true);
    setSent(false);
    try {
      await inviteMemberByEmail({
        householdId: household.id,
        householdName: household.name,
        invitedEmail: email.trim(),
        invitedBy: profile.uid,
        invitedByName: profile.displayName,
      });
      setEmail('');
      setSent(true);
    } catch (e) {
      Alert.alert('Could not send invite', 'Please try again.');
    } finally {
      setSending(false);
    }
  }

  function confirmRemove(uid: string, name: string) {
    Alert.alert('Remove member', `Remove ${name} from ${household!.name}?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Remove', style: 'destructive', onPress: () => removeMember(household!.id, uid) },
    ]);
  }

  return (
    <ScreenContainer>
      <Text style={typography.h2}>Members</Text>

      {isOwner && (
        <Card style={{ marginTop: spacing.lg }}>
          <Text style={typography.h3}>Invite someone</Text>
          <Text style={[typography.caption, { marginBottom: spacing.md, marginTop: 2 }]}>
            They'll get an email to join {household.name}.
          </Text>
          <TextField
            placeholder="email@example.com"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <Button title="Send invite" onPress={handleInvite} loading={sending} disabled={!email.trim()} />
          {sent && <Text style={styles.sent}>Invite sent ✓</Text>}
        </Card>
      )}

      <FlatList
        data={members}
        keyExtractor={(m) => m.uid}
        contentContainerStyle={{ gap: spacing.sm, marginTop: spacing.lg }}
        renderItem={({ item }) => (
          <Card style={styles.row}>
            <Avatar name={item.displayName} uri={item.photoURL} />
            <View style={{ flex: 1, marginLeft: spacing.sm }}>
              <Text style={typography.h3}>{item.displayName}</Text>
              <Text style={typography.caption}>{item.role === 'owner' ? 'Owner' : 'Member'}</Text>
            </View>
            {isOwner && item.uid !== profile.uid && (
              <Ionicons
                name="close-circle-outline"
                size={22}
                color={colors.textFaint}
                onPress={() => confirmRemove(item.uid, item.displayName)}
              />
            )}
          </Card>
        )}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
  sent: { color: colors.success, marginTop: spacing.sm, fontWeight: '600' },
});
