import { StatusBar } from 'expo-status-bar';
import React, { JSX, useState } from 'react';
import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

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

// ProfileCardProps 인터페이스 정의
interface ProfileCardProps {
  name: string;
  setName: (name: string) => void;
  jobTitle: string;
  handlePress: () => void;
}

// ProfileCard 컴포넌트 분리
const ProfileCard = ({ name, setName, jobTitle, handlePress }: ProfileCardProps) => (
  <View style={styles.card}>
    <Image style={styles.profileImage} source={require('./assets/icon.png')} />

    <Text style={styles.name}>{name}</Text>

    {/* 상태를 UI에 반영 */}
    <Text style={styles.jobTitle}>{jobTitle}</Text>

    {/* 사용자 입력을 위한 TextInput 컴포넌트 추가 */}
    {/* Compose의 TextField(value = name, onValueChange = { name = it }) 와 동일 */}
    <TextInput
      style={styles.input}
      placeholder="Enter your name"
      value={name}
      onChangeText={setName}
    />

    {/* 상호작용 컴포넌트 추가 */}
    <TouchableOpacity style={styles.button} onPress={handlePress}>
      <Text style={styles.buttonText}>Toggle Job</Text>
    </TouchableOpacity>
  </View>
);

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
            {/* 분리된 ProfileCard 컴포넌트를 호출하고, props를 통해 상태와 함수를 전달 */}
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
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    marginHorizontal: 20,
    marginTop: 40,
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
  input: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginTop: 20,
    fontSize: 16,
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