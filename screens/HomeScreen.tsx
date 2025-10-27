import React, { useEffect, useState, useCallback } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Alert, ActivityIndicator, Pressable, Modal, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ProfileCard from '../components/ProfileCard';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList, Skill } from '../navigation/types';
import { useUserStore } from '../store/useUserStore';
import apiService from '../api/apiService';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

type Props = {
    navigation: HomeScreenNavigationProp;
};

export default function HomeScreen({ navigation }: Props) {
    // Zustand 스토어에서 사용자 이름과 직업 타이틀, 상태 변경 함수를 가져옴
    const { name, setName, jobTitle, toggleJobTitle } = useUserStore();

    // 데이터를 위한 3가지 상태 정의
    const [skills, setSkills] = useState<Skill[]>([]);
    const [error, setError] = useState<string | null>(null);

    // 초기 로딩 및 당겨서 새로고침 상태
    const [initialLoading, setInitialLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);

    // 모달 상태를 위한 useState 추가
    // Compose의 val (showDialog, setShowDialog) = remember { mutableStateOf(false) } 와 유사
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);

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
        // 바로 이동하는 대신, 선택된 스킬을 상태에 저장하고 모달 열기
        setSelectedSkill(skill);
        setModalVisible(true);
    }

    // 모달 내부의 '상세보기' 버튼 클릭 핸들러
    const handleViewDetails = () => {
        if (selectedSkill) {
            navigation.navigate('SkillDetail', { skill: selectedSkill });
        }
        setModalVisible(false); // 모달 닫기
        setSelectedSkill(null); // 선택된 스킬 초기화
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
                        {/* Platform.OS를 이용해 현재 플랫폼 이름을 랜더링 */}
                        <Text style={styles.platformText}>
                            (Running on: {Platform.OS.toUpperCase()})
                        </Text>
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

            {/* 모달 컴포넌트 렌더링 */}
            <Modal
                animationType="fade" // 모달 애니메이션 타입 'slide', 'fade', 'none' 중 선택
                transparent={true} // 모달 배경을 투명하게 설정
                visible={modalVisible} // modalVisible 상태에 따라 보임/숨김
                onRequestClose={() => { // 안드로이드 뒤로가기 버튼 핸들러
                    setModalVisible(!modalVisible);
                    setSelectedSkill(null);
                }}
            >
                {/* 모달 UI 구성 */}
                <Pressable
                    style={styles.modalOverlay} // 반투명 검은색 배경
                    onPress={() => { // 배경 클릭 시 모달 닫기
                        setModalVisible(false);
                        setSelectedSkill(null);
                    }}
                >
                    <Pressable
                        style={styles.modalContent}
                        onPress={() => { }} // 모달 컨텐츠 클릭 시 닫히지 않도록 이벤트 전파 방지
                    >
                        <Text style={styles.modalTitle}>알림</Text>
                        <Text style={styles.modalMessage}>
                            '{selectedSkill?.title}' 스킬의 상세 정보를 보시겠습니까?
                        </Text>
                        <View style={styles.modalButtonContainer}>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.cancelButton]}
                                onPress={() => {
                                    setModalVisible(false);
                                    setSelectedSkill(null);
                                }}
                            >
                                <Text style={styles.buttonText}>취소</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.confirmButton]}
                                onPress={handleViewDetails}
                            >
                                <Text style={styles.buttonText}>상세보기</Text>
                            </TouchableOpacity>
                        </View>
                    </Pressable>
                </Pressable>
            </Modal>
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
        // Platform.select을 이용해 플랫폼별 스타일 분기
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOpacity: 0.1,
                shadowRadius: 5,
                shadowOffset: { width: 0, height: 2 },
            },
            android: {
                elevation: 3,
            },
        })
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
    },

    // --- (모달 스타일 추가) ---
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // 반투명 배경
    },
    modalContent: {
        width: '80%',
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 24,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    modalMessage: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 24,
        lineHeight: 22,
    },
    modalButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    modalButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginHorizontal: 8,
    },
    cancelButton: {
        backgroundColor: '#9ca3af', // 회색
    },
    confirmButton: {
        backgroundColor: '#667eea', // 메인 컬러
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    platformText: {
        fontSize: 12,
        color: '#9ca3af',
        textAlign: 'center',
        marginBottom: 16,
    },
});