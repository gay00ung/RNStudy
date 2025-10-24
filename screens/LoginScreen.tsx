import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useUserStore } from '../store/useUserStore';
import apiService from '../api/apiService';

export default function LoginScreen() {
    // 로그인 폼을 위한 로컬 상태 (Compose의 mutableStateOf)
    const [username, setUsername] = useState('root');
    const [password, setPassword] = useState('1234');
    const [loading, setLoading] = useState(false);

    // Zustand 스토어에서 로그인 함수 가져오기
    const login = useUserStore((state) => state.login);

    const handleLogin = async () => {
        if (loading) return; // 이미 로딩 중이면 무시
        setLoading(true);

        try {
            // apiService(Repository 역할)에서 로그인 API 호출
            const token = await apiService.login(username, password);

            // 로그인 성공 시 토큰을 Zustand 스토어에 저장
            login(token);
            Alert.alert('Success', '로그인에 성공했습니다!');
        } catch (error) {
            Alert.alert('로그인 실패', (error as Error).message);
        } finally {
            setLoading(false);
        }
    };
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.title}>로그인</Text>
                <TextInput
                    style={styles.input}
                    placeholder="아이디"
                    value={username}
                    onChangeText={setUsername}
                    autoCapitalize="none"
                />
                <TextInput
                    style={styles.input}
                    placeholder="비밀번호"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry // 비밀번호 가리기
                />
                {loading ? (
                    <ActivityIndicator size="large" color="#667eea" />
                ) : (
                    <Button title="로그인" onPress={handleLogin} />
                )}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f0f4f8' },
    content: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#1e293b',
        marginBottom: 24,
        textAlign: 'center',
    },
    input: {
        width: '100%',
        height: 44,
        backgroundColor: 'white',
        borderColor: '#cbd5e1',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 12,
        fontSize: 16,
        marginBottom: 16,
    },
});
