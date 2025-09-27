import { useEffect, useRef, useState } from 'react';
import { Alert, StyleSheet, TouchableOpacity } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

// Firebase imports
import Flashlight from '@/components/flashlight';
import useFirebaseAuth from '@/hooks/use-firebase-auth';
import { arrayRemove, arrayUnion, deleteDoc, doc, getDoc, onSnapshot, setDoc, updateDoc } from 'firebase/firestore';
import { OtpInput } from 'react-native-otp-entry';
import { Toast } from 'toastify-react-native';
import { db } from '../../firebaseConfig';

export default function HomeScreen() {
  const [code, setCode] = useState<string | null>(null);
  const [inputCode, setInputCode] = useState('');
  const [members, setMembers] = useState<string[]>([]);
  const unsubRef = useRef<(() => void) | null>(null);
  const [host, setHost] = useState<string | null>(null);

  const [aura, setAura] = useState('');

  const { user, handleAnonymousSignIn } = useFirebaseAuth();

  //num generation
  const handleCreateRoom = async () => {
      const code = Math.floor(1000 + Math.random() * 9000).toString();
      const userId = user?.uid;
      const roomRef = doc(db, 'rooms', code);
  
      // save room in Firestore under /rooms/{code}
      await setDoc(roomRef, {
        host: userId,
        members: [userId],
        createdAt: new Date(),
        aura: '',
      });
      Toast.success(`Room created! Code: ${code}`);
      setCode(code);
      setHost(userId || null);
      
      // subscribe to live updates of the room
      const unsub = onSnapshot(roomRef, (s) => {
        if (s.exists()) {
          const data = s.data() as any;
          if (data.aura) setAura(data.aura);
          setMembers(data.members || []);
        } else {
          setAura('');
          setMembers([]);
        }
      }, (err) => {
        console.warn('Room snapshot error:', err);
      });
  
      // clean up previous subscription if any
      if (unsubRef.current) {
        unsubRef.current();
      }
      unsubRef.current = unsub;
    };
  const handlePress = async (feature: string) => {
    if (!code) {
      Alert.alert("No Room", "Please create a room first!");
      return;
    }

    if (host && user && host !== user.uid) {
      Alert.alert("Not Host", "Only the host can change features!");
      return;
    } else {
      //write feature as aura to firebase
      const roomRef = doc(db, 'rooms', code);
      await updateDoc(roomRef, { aura: feature }).catch((err) => {
        console.error("Error updating aura:", err);
        Toast.error("Failed to update feature");
      });
    }
    
    Alert.alert('Feature Selected', `You selected ${feature} in room ${code}`);
    setAura(feature);
  };

  // clean up when leaving the screen
  useEffect(() => {
    return () => {
      if (unsubRef.current) {
        unsubRef.current();
        unsubRef.current = null;
      }
    };
  }, []);
  
  const handleJoin = async () => {
    const cleanCode = inputCode?.trim();
    if (cleanCode?.length !== 4) {
      Toast.error('Enter a 4-digit code');
      return;
    }

    try {
      const roomRef = doc(db, 'rooms', cleanCode);
      const snap = await getDoc(roomRef);
      if (!snap.exists()) {
        Toast.error('Room not found — check the code');
        return;
      }

      const userId = user?.uid ?? `guest-${Math.random().toString(36).slice(2, 8)}`;
      await updateDoc(roomRef, { members: arrayUnion(userId) });
      setCode(cleanCode);
      Toast.success('Successfully joined room!');

      // unsubscribe previous subscription if any (rare)
      if (unsubRef.current) {
        unsubRef.current();
        unsubRef.current = null;
      }

      // subscribe to live updates of the room
      const unsub = onSnapshot(roomRef, (s) => {
        if (s.exists()) {
          const data = s.data() as any;
          setHost(data.host || null);
          if (data.aura) setAura(data.aura);
          setMembers(data.members || []);
          console.log("USER: ", userId, "AURA: ", data.aura);
        } else {
          setHost(null);
          setAura('');
          setMembers([]);
        }
      }, (err) => {
        console.warn('Room snapshot error:', err);
      });

      unsubRef.current = unsub;
    } catch (err: any) {
      Toast.error(err.message || 'Failed to join room');
      console.error(err);
    }
  };

  // handle leaving the room and removing member from firebase
  const handleLeaveRoom = async () => {
    if (!code) return;

    const userId = user?.uid;
    const roomRef = doc(db, 'rooms', code);

    try {
      await updateDoc(roomRef, { members: arrayRemove(userId) });
      Toast.success('Left room successfully');

      setCode(null);
      setMembers([]);
      setHost(null);
      setAura('');

      // unsubscribe from room updates
      if (unsubRef.current) {
        unsubRef.current();
        unsubRef.current = null;
      }
    } catch (err: any) {
      Toast.error(err.message || 'Failed to leave room');
      console.error(err);
    }
  };

  const handleCloseRoom = async () => {
    if (!code) return;
    
    const roomRef = doc(db, 'rooms', code);
    
    try {
      await deleteDoc(doc(db, "rooms", code));

      Toast.success('Room closed successfully');

      setCode(null);
      setMembers([]);
      setHost(null);
      setAura('');

      // unsubscribe from room updates
      if (unsubRef.current) {
        unsubRef.current();
        unsubRef.current = null;
      }
    } catch (err: any) {
      Toast.error(err.message || 'Failed to close room');
      console.error(err);
    }
  };

  return (
      <ThemedView style={styles.container}>
        <ThemedView style={styles.titleContainer}>
          {!user && <ThemedText type="title" style={styles.titleText}>Welcome to Auralize</ThemedText>}
          {user && code && (
            <>
              <ThemedText type="title" style={styles.titleText}>Welcome to {"Aura " + code}</ThemedText>
              {user && user.uid == host && <ThemedText style={styles.subtitleText}>Choose your experience</ThemedText>}
            </>
          )}
        </ThemedView>

        <ThemedView style={styles.titleContainer}>
          {!user && (
            <TouchableOpacity style={styles.button} onPress={handleAnonymousSignIn}>
              <ThemedText style={styles.titleText}>Sign in Anonymously</ThemedText>
            </TouchableOpacity>
          )}
        </ThemedView>

        <Flashlight aura={aura} />

        {user && code && host && (user.uid == host) && (
          <>
          <ThemedView style={styles.buttonsContainer}>
            <TouchableOpacity style={styles.button} onPress={() => handlePress('twinkle')}>
              <ThemedText style={styles.buttonText}>✨ Twinkle</ThemedText>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.button} onPress={() => handlePress('ripple')}>
              <ThemedText style={styles.buttonText}>🌊 Ripple</ThemedText>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.button} onPress={() => handlePress('heart')}>
              <ThemedText style={styles.buttonText}>❤️ Heart</ThemedText>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={() => handlePress('shine')}>
              <ThemedText style={styles.buttonText}>💡 Shine</ThemedText>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={() => handlePress('custom')}>
              <ThemedText style={styles.buttonText}> 🎉Custom</ThemedText>
            </TouchableOpacity>
          </ThemedView>
          </>
        )}

        {user && !code && (<>
          <ThemedView style={styles.titleContainer}>
                  <ThemedText type="title" style={styles.titleText}>Join/Create an Aura</ThemedText>
                  <ThemedText style={styles.subtitleText}>Enter the 4-digit room code</ThemedText>
                </ThemedView>
          
                <ThemedView style={styles.buttonsContainer}>
                  <ThemedView style={styles.horizontal}>
                    <OtpInput
                      numberOfDigits={4}
                      onTextChange={setInputCode}
                      type="numeric"
                      theme={{ containerStyle: styles.digits }}
                      autoFocus={false}
                      focusColor="green"
                    />
                    <TouchableOpacity
                      disabled={!(inputCode.length === 4)}
                      style={[styles.button, inputCode.length === 4 ? {} : styles.disabledButton]}
                      onPress={handleJoin}
                    >
                      <ThemedText style={styles.buttonText}>🤝 Join</ThemedText>
                    </TouchableOpacity>
                  </ThemedView>

                  {members.length > 0 && (
                    <ThemedView style={{ marginTop: 12, alignItems: 'center' }}>
                      <ThemedText>Members in room: {members.length}</ThemedText>
                    </ThemedView>
                  )}

                  <TouchableOpacity style={styles.button} onPress={() => handleCreateRoom()}>
                    <ThemedText style={styles.buttonText}>🤝 Auralize </ThemedText>
                  </TouchableOpacity>
                </ThemedView>
                </>
              )}
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
  digits: { width: 200, justifyContent: 'space-between' },
  horizontal: { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: 'transparent' },
  disabledButton: { backgroundColor: '#f0f0f0', borderColor: '#d0d0d0' },
});
