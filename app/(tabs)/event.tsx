import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { OtpInput } from "react-native-otp-entry";


import { useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { Toast } from 'toastify-react-native';

export default function EventScreen() {
  const [code, setCode] = useState('');

  const handlePress = (feature: string) => {
    // Alert.alert('Room joined', `You joined room with code: ${code}`);
    Toast.success('Successfully joined room!');
  };
  return (
      <ThemedView style={styles.container}>
        <ThemedView style={styles.titleContainer}>
          <ThemedText type="title" style={styles.titleText}>Join/Create an Aura</ThemedText>
          <ThemedText style={styles.subtitleText}>Choose your experience</ThemedText>
        </ThemedView>
        
        <ThemedView style={styles.buttonsContainer}>
          <ThemedView style={styles.horizontal}>
            <OtpInput numberOfDigits={4}
              onTextChange={setCode}
              type="numeric"
              theme={{
                containerStyle: styles.digits,
              }}
              autoFocus={false}
              focusColor="green"
            />
            <TouchableOpacity disabled={!(code.length === 4)} style={styles.button} onPress={() => handlePress('Join Auralize')}>
              <ThemedText style={styles.buttonText}>🤝 Join</ThemedText>
            </TouchableOpacity>
          </ThemedView>
          <TouchableOpacity style={styles.button} onPress={() => handlePress('Auralize')}>
            <ThemedText style={styles.buttonText}>🤝 Auralize </ThemedText>
          </TouchableOpacity>
        </ThemedView>
      </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    padding: 20,
    justifyContent: 'center',
  },
  digits: {
    width: 200,
    justifyContent: 'space-between',
  },
  horizontal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'transparent',
  },
  input: {
    flex: 1,
    height: '100%',
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    fontSize: 16,
    color: '#334155',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 32,
    backgroundColor: 'transparent',
  },
  buttonsContainer: {
    backgroundColor: 'transparent',
    gap: 16,
  },
  button: {
    backgroundColor: '#ffffff',
    paddingVertical: 18,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  disabledButton: {
    backgroundColor: '#f0f0f0',
    borderColor: '#d0d0d0',
  },
  titleText: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitleText: {
    fontSize: 16,
    fontWeight: '400',
    color: '#64748b',
    textAlign: 'center',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#334155',
  },
  reactLogo: {
    height: 250,
    width: '100%',
    resizeMode: 'contain',
    position: 'absolute',
    bottom: 0,
    left: 0,
  },
});

