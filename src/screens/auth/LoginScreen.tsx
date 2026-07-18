import React, { useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { ScreenContainer } from '@/components/ScreenContainer';
import { Button } from '@/components/Button';
import { colors, spacing, typography } from '@/theme';
import { googleAuthConfig } from '@/config/googleAuth';
import { signInWithGoogleIdToken } from '@/services/authService';

WebBrowser.maybeCompleteAuthSession();

export function LoginScreen() {
  const [signingIn, setSigningIn] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [, response, promptAsync] = Google.useIdTokenAuthRequest({
    expoClientId: googleAuthConfig.expoClientId,
    iosClientId: googleAuthConfig.iosClientId,
    androidClientId: googleAuthConfig.androidClientId,
    webClientId: googleAuthConfig.webClientId,
  });

  React.useEffect(() => {
    if (response?.type === 'success' && response.params.id_token) {
      handleSignIn(response.params.id_token);
    } else if (response?.type === 'error') {
      setError('Google sign-in failed. Please try again.');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [response]);

  async function handleSignIn(idToken: string) {
    setSigningIn(true);
    setError(null);
    try {
      await signInWithGoogleIdToken(idToken);
    } catch (e) {
      setError('Something went wrong signing you in.');
    } finally {
      setSigningIn(false);
    }
  }

  return (
    <ScreenContainer style={styles.container}>
      <View style={styles.hero}>
        <View style={styles.logoCircle}>
          <Text style={styles.logoEmoji}>🏡</Text>
        </View>
        <Text style={styles.title}>Hearth</Text>
        <Text style={styles.subtitle}>Keep your household running — inventory, shopping, and chores in one place.</Text>
      </View>

      <View style={styles.footer}>
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <Button
          title="Continue with Google"
          onPress={() => promptAsync()}
          loading={signingIn}
          disabled={!googleAuthConfig.expoClientId && !googleAuthConfig.webClientId}
        />
        <Text style={styles.disclaimer}>By continuing you agree to share your name, email, and photo with your household members.</Text>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: { justifyContent: 'space-between', paddingVertical: spacing.xxl },
  hero: { alignItems: 'center', marginTop: spacing.xxl },
  logoCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: colors.primaryMuted,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  logoEmoji: { fontSize: 40 },
  title: { ...typography.h1, marginBottom: spacing.sm },
  subtitle: { ...typography.bodyMuted, textAlign: 'center', paddingHorizontal: spacing.lg },
  footer: { gap: spacing.md },
  error: { color: colors.danger, textAlign: 'center', marginBottom: spacing.sm },
  disclaimer: { ...typography.caption, textAlign: 'center', marginTop: spacing.sm },
});
