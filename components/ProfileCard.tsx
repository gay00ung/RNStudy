import React from 'react';
import { Alert, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useUserStore } from '../store/useUserStore';
import styled from 'styled-components/native';

// Props에 대한 타입 인터페이스
interface ProfileCardProps {
    name: string;
    setName: (name: string) => void;
    jobTitle: string;
    handlePress: () => void;
}

// 스타일 컴포넌트 정의 (StyleSheet.create 대신)
// styled.View`...` : View 컴포넌트에 스타일을 적용한 새 컴포넌트를 만듦
// CSS 문법을 백틱(` `` `) 안에 직접 작성
const StyledCardView = styled.View`
  background-color: white;
  border-radius: 16px; /* CSS 스타일: px 단위 사용 가능 */
  padding: 24px;
  align-items: center;
  /* Platform.select 로직은 styled-components 내부에서도 사용 가능 */
  ${Platform.select({
    ios: `
      shadow-color: #000;
      shadow-opacity: 0.1;
      shadow-radius: 8px;
      shadow-offset: 0px 2px;
    `,
    android: `
      elevation: 5;
    `,
})}
  margin-bottom: 24px; /* HomeScreen과의 간격 */
`;

// styled(Image)`...` : 기존 Image 컴포넌트에 스타일 적용
const StyledProfileImage = styled.Image`
  width: 100px;
  height: 100px;
  border-radius: 50px; /* 원형 이미지 */
  margin-bottom: 16px;
`;

// styled(TouchableOpacity)`...` : TouchableOpacity에 스타일 적용
const StyledImageTouchable = styled.TouchableOpacity``; // 이미지 감싸는 용도 (스타일 없음)

const StyledNameText = styled.Text`
  font-size: 24px;
  font-weight: bold;
  color: #1e293b;
`;

const StyledJobTitleText = styled.Text`
  font-size: 16px;
  color: #64748b;
  margin-top: 4px;
`;

const StyledTextInput = styled.TextInput`
  width: 100%;
  height: 40px;
  border-color: #cbd5e1;
  border-width: 1px;
  border-radius: 8px;
  padding-horizontal: 10px;
  margin-top: 20px;
  font-size: 16px;
`;

const StyledButton = styled.TouchableOpacity`
  margin-top: 20px;
  background-color: #667eea;
  padding: 12px 24px; /* 여러 값 지정 가능 */
  border-radius: 8px;
  elevation: 2; /* Android 그림자 */
`;

const StyledButtonText = styled.Text`
  color: white;
  font-size: 16px;
  font-weight: bold;
`;

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

    // JSX에서 기존 컴포넌트 대신 styled 컴포넌트를 사용
    return (
        <StyledCardView>
            <StyledImageTouchable onPress={handleImagePress}>
                <StyledProfileImage
                    source={profileImageUri ? { uri: profileImageUri } : require('../assets/icon.png')}
                />
            </StyledImageTouchable>

            <StyledNameText>{name}</StyledNameText>
            <StyledJobTitleText>{jobTitle}</StyledJobTitleText>

            <StyledTextInput
                placeholder="이름을 입력하세요"
                value={name}
                onChangeText={setName}
            />

            <StyledButton onPress={handlePress}>
                <StyledButtonText>직업 변경</StyledButtonText>
            </StyledButton>
        </StyledCardView>
    );
};

// 다른 파일에서 이 컴포넌트를 import 할 수 있도록 export 
export default ProfileCard;