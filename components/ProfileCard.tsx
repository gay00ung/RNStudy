import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, TextInput } from 'react-native';

// 1. Props에 대한 타입 인터페이스
interface ProfileCardProps {
    name: string;
    setName: (name: string) => void;
    jobTitle: string;
    handlePress: () => void;
}

// 2. ProfileCard 컴포넌트 본문
const ProfileCard = ({ name, setName, jobTitle, handlePress }: ProfileCardProps) => (
    <View style={styles.card}>
        <Image
            style={styles.profileImage}
            // 이미지가 components 폴더 밖에 있으므로 경로를 '../'로 수정
            source={require('../assets/icon.png')}
        />
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

// 3. 이 컴포넌트에서만 사용하는 스타일
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

// 4. 다른 파일에서 이 컴포넌트를 import 할 수 있도록 export 
export default ProfileCard;