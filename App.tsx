import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';

export default function App() {
  // 1. 상태
  const [jobTitle, setJobTitle] = useState('Android Developer');

  // 2. 버튼 클릭 시 실행 될 함수
  const handlePress = () => {
    if (jobTitle == 'Android Developer') {
      setJobTitle('iOS Developer'); // setJobTitle 함수를 호출하면 상태가 변경되고, UI가 자동으로 다시 그려짐
    } else {
      setJobTitle('Android Developer');
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Image style={styles.profileImage} source={require('./assets/icon.png')} />

        <Text style={styles.name}>gay00ung</Text>
        {/* 3. 상태를 UI에 반영 */}
        <Text style={styles.jobTitle}>{jobTitle}</Text>

        {/* 4. 상호작용 컴포넌트 추가 */}
        <TouchableOpacity style={styles.button} onPress={handlePress}>
          <Text style={styles.buttonText}>Toggle Job</Text>
        </TouchableOpacity>

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
  button: {
    marginTop: 20,
    backgroundColor: '#3b82f6',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    elevation: 2,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});