import React, { useState } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import * as AppleAuthentication from 'expo-apple-authentication';
import { ScreenContainer } from '@/components/ScreenContainer';
import { Button } from '@/components/Button';
import { colors, radii, spacing, typography } from '@/theme';
import { googleAuthConfig } from '@/config/googleAuth';
import { signInWithApple, signInWithGoogleIdToken } from '@/services/authService';
import { createAppleNonce } from '@/utils/appleNonce';

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
      handleGoogleSignIn(response.params.id_token);
    } else if (response?.type === 'error') {
      setError('Google sign-in failed. Please try again.');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [response]);

  async function handleGoogleSignIn(idToken: string) {
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

  async function handleAppleSignIn() {
    setSigningIn(true);
    setError(null);
    try {
      const { rawNonce, hashedNonce } = await createAppleNonce();
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
        nonce: hashedNonce,
      });

      if (!credential.identityToken) {
        throw new Error('Apple did not return an identity token.');
      }

      const fullName = credential.fullName
        ? [credential.fullName.givenName, credential.fullName.familyName].filter(Boolean).join(' ')
        : null;

      await signInWithApple(credential.identityToken, rawNonce, fullName);
    } catch (e: any) {
      // ERR_REQUEST_CANCELED just means the user dismissed the sheet — not an error worth surfacing.
      if (e?.code !== 'ERR_REQUEST_CANCELED') {
        setError('Something went wrong signing you in with Apple.');
      }
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
        {Platform.OS === 'ios' && (
          <AppleAuthentication.AppleAuthenticationButton
            buttonType={AppleAuthentication.AppleAuthenticationButtonType.CONTINUE}
            buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
            cornerRadius={radii.md}
            style={styles.appleButton}
            onPress={handleAppleSignIn}
          />
        )}
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
  appleButton: { width: '100%', height: 48 },
  error: { color: colors.danger, textAlign: 'center', marginBottom: spacing.sm },
  disclaimer: { ...typography.caption, textAlign: 'center', marginTop: spacing.sm },
});
