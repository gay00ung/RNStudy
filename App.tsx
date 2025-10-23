import { StatusBar } from 'expo-status-bar';
import React, { JSX, useState } from 'react';
import { StyleSheet, Text, View, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
// 분리된 ProfileCard 컴포넌트 import
import ProfileCard from './components/ProfileCard';

// 리스트에 표시할 데이터 
// LazyColumn의 items(skills) { ... } 와 동일
const SKILLS = [
  { id: '1', title: 'React Native' },
  { id: '2', title: 'TypeScript' },
  { id: '3', title: 'JavaScript' },
  { id: '4', title: 'Node.js' },
  { id: '5', title: 'Expo' },
  { id: '6', title: 'Android (Kotlin/Compose)' },
  { id: '7', title: 'Git & GitHub' },
  { id: '8', title: 'UI/UX Design' },
  { id: '9', title: 'REST APIs' },
  { id: '10', title: 'Firebase' },
];

// Skill 인터페이스 정의
interface Skill {
  id: string;
  title: string;
}

export default function App() {
  // 상태
  const [jobTitle, setJobTitle] = useState('Android Developer');
  const [name, setName] = useState('gay00ung');

  // 버튼 클릭 시 실행 될 함수
  const handlePress = () => {
    if (jobTitle == 'Android Developer') {
      setJobTitle('iOS Developer'); // setJobTitle 함수를 호출하면 상태가 변경되고, UI가 자동으로 다시 그려짐
    } else {
      setJobTitle('Android Developer');
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={SKILLS}
        renderItem={({ item }) => (
          <View style={styles.skillItem}>
            <Text style={styles.skillText}>{item.title}</Text>
          </View>
        )}
        keyExtractor={item => item.id}
        // ListHeaderComponent에 프로필 카드와 스킬 목록 헤더를 함께 렌더링
        ListHeaderComponent={
          <>
            {/* import한 ProfileCard 컴포넌트를 호출하고, props를 통해 상태와 함수를 전달 */}
            <ProfileCard
              name={name}
              setName={setName}
              jobTitle={jobTitle}
              handlePress={handlePress}
            />
            <Text style={styles.listHeader}>Skills</Text>
          </>
        }

        contentContainerStyle={styles.listContentContainer}
      />
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, // 화면 전체를 차지 (Modifier.fillMaxSize()와 유사)
    backgroundColor: '#f0f4f8',
    // alignItems: 'center', // 가로축 중앙 정렬 (horizontalAlignment = Alignment.CenterHorizontally)
    // justifyContent: 'center', // 세로축 중앙 정렬 (verticalArrangement = Arrangement.Center)
  },
  listContainer: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#1e293b',
  },
  listHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#1e293b',
  },
  skillItem: {
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    shadowColor: '#000',
    elevation: 2,
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  skillText: {
    fontSize: 16,
    color: '#334155',
  },
  listContentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
});