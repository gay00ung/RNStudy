import React, { useEffect, useState, useCallback } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ProfileCard from '../components/ProfileCard';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList, Skill } from '../navigation/types';
import { useUserStore } from '../store/useUserStore';
import apiService from '../api/apiService';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

type Props = {
    navigation: HomeScreenNavigationProp;
}

// 모의 API 호출 함수 (실제 API 호출은 apiService에서 처리) -> 더 이상 사용하지 않음
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
    // Zustand 스토어에서 사용자 이름과 직업 타이틀, 상태 변경 함수를 가져옴
    const { name, setName, jobTitle, toggleJobTitle } = useUserStore();

    // 데이터를 위한 3가지 상태 정의
    const [skills, setSkills] = useState<Skill[]>([]);
    const [error, setError] = useState<string | null>(null);

    // 초기 로딩 및 당겨서 새로고침 상태
    const [initialLoading, setInitialLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);

    // useCallback: 이 함수가 불필요하게 재생성되는 것을 방지 (Compose의 remember { ... } 와 유사)
    const loadData = useCallback(async () => {
        setError(null);
        try {
            const data = await apiService.fetchSkills();
            setSkills(data);
        } catch (e) {
            setError('데이터를 불러오는 데 실패했습니다.');
        }
    }, []); // 빈 의존성 배열 -> 앱 실행 내내 재사용

    // 초기 로딩 (useEffect)
    // Compose의 LaunchedEffect와 유사
    useEffect(() => {
        async function loadInitialData() {
            setInitialLoading(true);
            await loadData();
            setInitialLoading(false);
        }
        loadInitialData();
    }, [loadData]); // loadData 함수가 (이론상) 변경될 때만 실행 (지금은 한 번만 실행됨)

    // 당겨서 새로고침 (onRefresh)
    const handleRefresh = useCallback(async () => {
        setIsRefreshing(true); // 새로고침 스피너 시작
        await loadData();
        setIsRefreshing(false); // 새로고침 스피너 종료
    }, [loadData]); // loadData 함수가 변경될 때만 재생성

    // 스킬 아이템 클릭시 실행 될 함수
    const onSkillPress = (skill: Skill) => {
        // navigation.navigate를 사용하여 SkillDetail 스크린으로 이동하면서 skill 파라미터 전달
        navigation.navigate('SkillDetail', { skill: skill });
    }

    // 로딩 중일 때 로딩 인디케이터 표시
    const renderListContent = () => {
        // 초기 로딩 중일 때 전체 화면 로더 표시
        if (initialLoading) {
            return <ActivityIndicator size="large" color="#667eea" style={styles.loader} />;
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
                        {/* Zustand 스토어에서 가져온 name, setName, jobTitle, toggleJobTitle을 props로 전달 */}
                        <ProfileCard
                            name={name}
                            setName={setName}
                            jobTitle={jobTitle}
                            handlePress={toggleJobTitle}
                        />
                        <Text style={styles.listHeader}>Skills</Text>
                    </>
                }

                contentContainerStyle={styles.listContentContainer}
                // Swipe to Refresh 기능 추가
                refreshing={isRefreshing} // 새로고침 스피너를 보여줄지 여부
                onRefresh={handleRefresh} // 새로고침 시 실행할 함수
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