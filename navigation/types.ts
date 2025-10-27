import { NavigatorScreenParams } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

// Skill 타입 정의
export type Skill = {
    id: string;
    title: string;
};

export type SkillDetail = Skill & {
    completed: boolean;
    description?: string;
};

// --- 네비게이터 파라미터 리스트 정의 ---
// Stack Navigator (Home -> SkillDetail)
export type RootStackParamList = {
    Home: undefined;
    // SkillDetail 스크린은 기본 Skill 객체를 파라미터로 받음
    // ID를 사용해 상세 정보는 스크린 내부에서 fetch
    SkillDetail: { skill: Skill };
};

// Tab Navigator (HomeStack | Settings)
export type RootTabParamList = {
    // 'HomeStack' 탭은 RootStackParamList 전체를 중첩합니다.
    HomeStack: NavigatorScreenParams<RootStackParamList>;
    Settings: undefined;
};

// Auth Stack (Login)
export type AuthStackParamList = {
    Login: undefined;
};

// --- 개별 스크린 Props 정의 ---
// 각 스크린이 받을 Props 타입을 미리 정의 
export type HomeScreenProps = StackScreenProps<RootStackParamList, 'Home'>;
export type SkillDetailScreenProps = StackScreenProps<RootStackParamList, 'SkillDetail'>;

// RootTabParamList 내부 스크린들의 Props
export type SettingsScreenProps = BottomTabScreenProps<RootTabParamList, 'Settings'>;

// AuthStack 스크린 Props (LoginScreen은 navigation prop을 직접 쓰진 않지만 정의해둠)
export type LoginScreenProps = StackScreenProps<AuthStackParamList, 'Login'>;