import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/types';

// SkillDetailScreen이 받게 될 route와 navigation prop의 타입 정의
type SkillDetailScreenNavigationProp = StackNavigationProp<RootStackParamList, 'SkillDetail'>;
type SkillDetailScreenRouteProp = RouteProp<RootStackParamList, 'SkillDetail'>;

type Props = {
    navigation: SkillDetailScreenNavigationProp;
    route: SkillDetailScreenRouteProp;
};

export default function SkillDetailScreen({ route, navigation }: Props) {
    const { skill } = route.params; // route.params에서 skill 객체 추출

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{skill.title} 상세 정보</Text>
            <Text style={styles.description}>
                {skill.title}에 대한 자세한 정보를 여기에 표시합니다.
            </Text>
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
});