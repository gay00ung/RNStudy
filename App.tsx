import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Image style={styles.profileImage} source={require('./assets/icon.png')} />
        <Text style={styles.name}>gay00ung</Text>
        <Text style={styles.jobTitle}>Android Developer</Text>
      </View>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, // 화면 전체를 차지 (Modifier.fillMaxSize()와 유사)
    backgroundColor: '#f0f4f8',
    alignItems: 'center', // 가로축 중앙 정렬 (horizontalAlignment = Alignment.CenterHorizontally)
    justifyContent: 'center', // 세로축 중앙 정렬 (verticalArrangement = Arrangement.Center)
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  jobTitle: {
    fontSize: 16,
    color: '#64748b',
    marginTop: 4,
  },
});
