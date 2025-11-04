import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, ActivityIndicator } from 'react-native';
import { SkillDetailScreenProps, SkillDetail, Skill } from '../navigation/types';
import apiService from '../api/apiService';

export default function SkillDetailScreen({ route, navigation }: SkillDetailScreenProps) {
    const params = route.params;

    // 딥 링크 등에서 skillId만 넘어올 수 있으므로 안전하게 기본 스킬 정보 구성
    const initialSkill: Skill = 'skill' in params
        ? params.skill
        : {
            id: params.skillId,
            title: params.skillTitle ?? '스킬 상세',
        };
    const skillId = initialSkill.id;

    // 상세 데이터, 로딩, 에러를 위한 상태 (ViewModel의 StateFlow 역할)
    const [detailData, setDetailData] = useState<SkillDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // 스크린이 마운트되거나 baseSkill.id가 변경될 때 상세 데이터 로드
    // useEffect: 컴포넌트 생명주기 관리 (Compose의 LaunchedEffect와 유사)
    useEffect(() => {
        const loadDetailData = async () => {
            setLoading(true);
            setError(null);
            try {
                // apiService에서 상세 정보 fetch
                const data = await apiService.fetchSkillDetail(skillId);
                setDetailData(data);
            } catch (e) {
                setError('상세 정보를 불러오는 데 실패했습니다.');
            } finally {
                setLoading(false);
            }
        }
        loadDetailData();
    }, [skillId]); // 요청 ID가 변경될 때마다 재실행

    // 로딩 중 UI
    if (loading) {
        return (
            <View style={[styles.container, styles.center]}>
                <ActivityIndicator size="large" color="#667eea" />
                <Text style={styles.loadingText}>로딩 중...</Text>
            </View>
        );
    }

    // 에러 발생 시 UI
    if (error) {
        return (
            <View style={[styles.container, styles.center]}>
                <Text style={styles.errorText}>{error}</Text>
                <Button title="뒤로 가기" onPress={() => navigation.goBack()} />
            </View>
        );
    }

    // 데이터 로드 성공 시 UI
    return (
        <View style={styles.container}>
            {/* detailData가 로드되기 전(null)에는 기본 title을,
                로드된 후에는 API에서 받은 title (detailData.title)을 보여줌
            */}
            <Text style={styles.title}>{detailData?.title || initialSkill.title}</Text>

            {detailData && ( // detailData가 null이 아닐 때만 렌더링
                <>
                    <Text style={styles.description}>
                        {detailData.description}
                    </Text>
                    <Text style={styles.status}>
                        완료 여부: {detailData.completed ? '완료' : '진행 중'}
                    </Text>
                </>
            )}
            <Button title="뒤로 가기" onPress={() => navigation.goBack()} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 24,
    },
    center: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        color: '#64748b',
    },
    errorText: {
        fontSize: 16,
        color: 'red',
        textAlign: 'center',
        marginBottom: 16,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#1e293b',
        marginBottom: 16,
    },
    description: {
        fontSize: 18,
        color: '#475569',
        lineHeight: 26,
        marginBottom: 24,
    },
    status: {
        fontSize: 16,
        color: '#1e293b',
        fontWeight: '600',
        marginBottom: 24,
    }
});
