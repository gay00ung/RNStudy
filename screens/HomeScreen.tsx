import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ProfileCard from '../components/ProfileCard';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList, Skill } from '../navigation/types';
type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

type Props = {
    navigation: HomeScreenNavigationProp;
}

const fetchSkillsFromAPI = (): Promise<Skill[]> => {
    const FACE_SKILLS_DATA: Skill[] = [
        { id: '1', title: 'React Native' },
        { id: '2', title: 'TypeScript' },
        { id: '3', title: 'JavaScript (ES6+)' },
        { id: '4', title: 'Node.js' },
        { id: '5', title: 'Expo' },
        { id: '6', title: 'Android (Kotlin/Compose)' },
        { id: '7', title: 'Git & GitHub' },
        { id: '8', title: 'UI/UX Design' },
        { id: '9', title: 'REST APIs' },
        { id: '10', title: 'Firebase' },
    ];

    return new Promise(resolve => {
        setTimeout(() => {
            resolve(FACE_SKILLS_DATA);
        }, 2000); // 2초 지연 후 데이터 반환
    });
}

export default function HomeScreen({ navigation }: Props) {
    const [jobTitle, setJobTitle] = useState('Android Developer');
    const [name, setName] = useState('gay00ung');

    // 데이터를 위한 3가지 상태 정의
    const [skills, setSkills] = useState<Skill[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // useEffect 훅: 컴포넌트가 처음 마운트될 때 API 데이터를 가져옴
    // Compose의 LaunchedEffect와 유사
    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true); // 로딩 시작
                setError(null); // 에러 초기화

                const data = await fetchSkillsFromAPI(); // API 호출
                setSkills(data); // 데이터 상태 업데이트
            } catch (error) {
                setError('Failed to load skills'); // 에러 상태 업데이트
                Alert.alert('Error', '스킬 목록을 불러오는 데 실패했습니다.'); // 사용자에게 알림
            } finally {
                setLoading(false); // 로딩 종료
            }
        };

        loadData(); // 정의한 비동기 함수 실행
    }, []); // 빈 의존성 배열: 컴포넌트 마운트 시 한 번만 실행

    // 프로필 카드의 "직업 변경" 버튼 클릭시 실행 될 함수
    const handlePress = () => {
        setJobTitle(prevTitle =>
            prevTitle === 'Android Developer' ? 'iOS Developer' : 'Mobile Developer'
        );
    }

    // 스킬 아이템 클릭시 실행 될 함수
    const onSkillPress = (skill: Skill) => {
        // navigation.navigate를 사용하여 SkillDetail 스크린으로 이동하면서 skill 파라미터 전달
        navigation.navigate('SkillDetail', { skill: skill });
    }

    // 로딩 중일 때 로딩 인디케이터 표시
    const renderListContent = () => {
        if (loading) {
            // Compose의 CircularProgressIndicator와 유사
            return <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />;
        }

        // 에러가 있을 때 에러 메시지 표시
        if (error) {
            return <Text style={styles.errorText}>{error}</Text>;
        }

        // 로딩이 완료되고 에러가 없으면 FlatList로 스킬 목록 표시
        return (
            <FlatList
                data={skills}
                renderItem={({ item }) => (
                    // 각 스킬 아이템을 TouchableOpacity로 감싸 클릭 가능하게 만듦
                    <TouchableOpacity onPress={() => onSkillPress(item)}>
                        <View style={styles.skillItem}>
                            <Text style={styles.skillText}>{item.title}</Text>
                        </View>
                    </TouchableOpacity>
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
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            {renderListContent()}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f4f8',
    },
    listContentContainer: {
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    listHeader: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 12,
        color: '#1e293b',
    },
    skillItem: {
        backgroundColor: 'white',
        padding: 16,
        borderRadius: 8,
        marginBottom: 10,
        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 4,
    },
    skillText: {
        fontSize: 16,
        color: '#334155',
    },
    loader: {
        marginTop: 40,
    },
    errorText: {
        marginTop: 40,
        fontSize: 16,
        color: 'red',
        textAlign: 'center',
    }
});