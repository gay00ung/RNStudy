import React, { useState } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ProfileCard from '../components/ProfileCard';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList, Skill } from '../navigation/types';
type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

type Props = {
    navigation: HomeScreenNavigationProp;
}

const SKILLS: Skill[] = [
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

export default function HomeScreen({ navigation }: Props) {
    const [jobTitle, setJobTitle] = useState('Android Developer');
    const [name, setName] = useState('gay00ung');

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

    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                data={SKILLS}
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
    }
});