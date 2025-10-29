import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, TextInput, Alert, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useUserStore } from '../store/useUserStore';

// Props에 대한 타입 인터페이스
interface ProfileCardProps {
    name: string;
    setName: (name: string) => void;
    jobTitle: string;
    handlePress: () => void;
}

// ProfileCard 컴포넌트 본문
const ProfileCard = ({ name, setName, jobTitle, handlePress }: ProfileCardProps) => {
    // 스토어에서 이미지 URI와 설정 함수 가져오기
    const profileImageUri = useUserStore((state) => state.profileImageUri);
    const setProfileImageUri = useUserStore((state) => state.setProfileImageUri);

    // 이미지 선택/촬영 로직 함수
    const pickImage = async (useCamera: boolean) => {
        let result;

        // 권한 요청 (Camera or Media Library)
        // (Kotlin/Compose 매핑: requestPermissions() / checkSelfPermission())
        const permission = useCamera
            ? await ImagePicker.requestCameraPermissionsAsync()
            : await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (permission.status !== 'granted') {
            Alert.alert('권한 필요', `프로필 사진을 변경하려면 ${useCamera ? '카메라' : '갤러리'} 접근 권한이 필요합니다.`);
            return;
        }

        // 이미지 피커 실행 (카메라 또는 갤러리)
        // (Kotlin/Compose 매핑: Intent(ACTION_IMAGE_CAPTURE) or Intent(ACTION_PICK))
        try {
            if (useCamera) {
                result = await ImagePicker.launchCameraAsync({
                    allowsEditing: true, // 촬영 후 편집 허용
                    aspect: [1, 1],      // 1:1 비율로 편집
                    quality: 0.5,       // 이미지 품질 (0 ~ 1)
                });
            } else {
                result = await ImagePicker.launchImageLibraryAsync({
                    mediaTypes: ImagePicker.MediaTypeOptions.Images, // 이미지만 선택
                    allowsEditing: true,
                    aspect: [1, 1],
                    quality: 0.5,
                });
            }

            // 결과 처리
            if (!result.canceled) {
                // 선택된 이미지의 URI를 Zustand 스토어에 저장
                // (Kotlin/Compose 매핑: ViewModel의 StateFlow 업데이트)
                setProfileImageUri(result.assets[0].uri);
            }
        } catch (error) {
            console.error("Image picking error: ", error);
            Alert.alert('오류', '이미지를 처리하는 중 오류가 발생했습니다.');
        }
    };

    // 프로필 이미지 클릭 시 실행될 함수 (선택 옵션 Alert 띄우기)
    const handleImagePress = () => {
        Alert.alert(
            "프로필 사진 변경",
            "어떤 방법으로 변경하시겠습니까?",
            [
                { text: "카메라로 촬영", onPress: () => pickImage(true) },
                { text: "갤러리에서 선택", onPress: () => pickImage(false) },
                { text: "취소", style: "cancel" },
            ]
        );
    };

    return (
        <View style={styles.card}>
            <TouchableOpacity onPress={handleImagePress}>
                <Image
                    style={styles.profileImage}
                    // 이미지가 components 폴더 밖에 있으므로 경로를 '../'로 수정
                    source={profileImageUri ? { uri: profileImageUri } : require('../assets/icon.png')}
                />
            </TouchableOpacity>
            <Text style={styles.name}>{name}</Text>
            <Text style={styles.jobTitle}>{jobTitle}</Text>
            <TextInput
                style={styles.input}
                placeholder="이름을 입력하세요"
                value={name}
                onChangeText={setName}
            />
            <TouchableOpacity style={styles.button} onPress={handlePress}>
                <Text style={styles.buttonText}>직업 변경</Text>
            </TouchableOpacity>
        </View>
    );
};

// 이 컴포넌트에서만 사용하는 스타일
const styles = StyleSheet.create({
    card: {
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 24,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
        marginBottom: 24,
    },
    profileImage: { width: 100, height: 100, borderRadius: 50, marginBottom: 16 },
    name: { fontSize: 24, fontWeight: 'bold', color: '#1e293b' },
    jobTitle: { fontSize: 16, color: '#64748b', marginTop: 4 },
    button: { marginTop: 20, backgroundColor: '#667eea', paddingVertical: 12, paddingHorizontal: 24, borderRadius: 8, elevation: 2 },
    buttonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
    input: { width: '100%', height: 40, borderColor: '#cbd5e1', borderWidth: 1, borderRadius: 8, paddingHorizontal: 10, marginTop: 20, fontSize: 16 },
});

// 다른 파일에서 이 컴포넌트를 import 할 수 있도록 export 
export default ProfileCard;