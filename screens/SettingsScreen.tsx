import React from 'react';
import { View, Text, StyleSheet, TextInput, Button, Alert, NativeModules, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useUserStore } from '../store/useUserStore';
import { SettingsScreenProps } from '../navigation/types';
import Toast from 'react-native-toast-message';

// NativeModules에서 ToastModule 가져오기 (Android 전용)
const { AndroidToast } = NativeModules;

export default function SettingsScreen({ navigation }: SettingsScreenProps) {
    // Zustand 스토어에서 사용자 이름과 상태 변경 함수를 가져옴
    const { name, setName, logout } = useUserStore();

    const handleLogout = () => {
        Alert.alert(
            '로그아웃',
            '정말 로그아웃 하시겠습니까?',
            [
                {
                    text: '취소',
                    style: 'cancel',
                    onPress: () => console.log('Logout cancelled')
                },
                {
                    text: '확인',
                    style: 'destructive',
                    onPress: () => {
                        logout();
                        Toast.show({
                            type: 'success',
                            text1: '로그아웃 되었습니다.',
                            position: 'bottom',
                            visibilityTime: 2000,
                        })
                        console.log('User logged out');
                    }
                },
            ]
        )
    }

    // 네이티브 토스트 메시지 호출 함수
    const handleNativeToast = () => {
        // Android일 경우에만 네이티브 모듈 호출
        if (Platform.OS === 'android' && AndroidToast) {
            AndroidToast.show("Hello from Kotlin! 👋");
        } else {
            // iOS일 경우 (지금은 AndroidToast 모듈이 없으므로) JS Alert 띄우기
            Alert.alert("알림", "이 기능은 Android에서만 동작합니다.");
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.title}>설정</Text>
                <Text style={styles.label}>프로필 이름 수정: </Text>
                <TextInput
                    style={styles.input}
                    value={name}
                    onChangeText={setName} /// 스토어의 setName 함수를 바로 연결
                    placeholder="이름을 입력하세요"
                />

                {/* 로그아웃 버튼 */}
                <View style={styles.loginSection}>
                    <View style={styles.divider} />
                    <Button
                        title="로그아웃"
                        color="#ff3d00"
                        onPress={handleLogout}
                    />
                </View>

                {/* 네이티브 토스트 메시지 버튼 */}
                <View style={styles.logoutButtonContainer}>
                    <Button
                        title="네이티브 토스트 띄우기 (Android)"
                        color="#007aff"
                        onPress={handleNativeToast}
                    />
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f4f8',
    },
    content: {
        flex: 1,
        padding: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#1e293b',
        marginBottom: 24,
    },
    label: {
        fontSize: 16,
        color: '#475569',
        marginBottom: 8,
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
    },
    loginSection: {
        marginTop: 50,
    },
    divider: {
        height: 1,
        backgroundColor: '#cbd5e1',
        marginBottom: 20,
    },
    logoutButtonContainer: {
        marginTop: 16,
    },
});