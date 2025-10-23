import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';

// Skill 타입 정의
export type Skill = {
    id: string;
    title: string;
};

// 전체 네비게이션 스택 파라미터 리스트 정의
export type RootStackParamList = {
    Home: undefined;
    SkillDetail: { skill: Skill };
};

// 각 스크린이 받을 Props 타입을 미리 정의 
export type HomeScreenProps = {
    navigation: StackNavigationProp<RootStackParamList, 'Home'>;
};

export type SkillDetailScreenProps = {
    navigation: StackNavigationProp<RootStackParamList, 'SkillDetail'>;
    route: RouteProp<RootStackParamList, 'SkillDetail'>;
};