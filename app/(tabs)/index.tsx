import { Alert, StyleSheet, TouchableOpacity } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function HomeScreen() {
  const handlePress = (feature: string) => {
    Alert.alert('Feature Selected', `You selected ${feature}`);
  };
  return (
      <ThemedView style={styles.container}>
        <ThemedView style={styles.titleContainer}>
          <ThemedText type="title" style={styles.titleText}>Welcome to Auralize</ThemedText>
          <ThemedText style={styles.subtitleText}>Choose your experience</ThemedText>
        </ThemedView>
        
        <ThemedView style={styles.buttonsContainer}>
          <TouchableOpacity style={styles.button} onPress={() => handlePress('Twinkle')}>
            <ThemedText style={styles.buttonText}>✨ Twinkle</ThemedText>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.button} onPress={() => handlePress('Ripple Wave')}>
            <ThemedText style={styles.buttonText}>🌊 Ripple Wave</ThemedText>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.button} onPress={() => handlePress('Heart')}>
            <ThemedText style={styles.buttonText}>❤️ Heart</ThemedText>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.button} onPress={() => handlePress('HackGT12')}>
            <ThemedText style={styles.buttonText}>🚀 HackGT12</ThemedText>
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
