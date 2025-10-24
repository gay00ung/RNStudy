import { NavigatorScreenParams } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

// Skill 타입 정의
export type Skill = {
    id: string;
    title: string;
};

// --- 네비게이터 파라미터 리스트 정의 ---
// Stack Navigator (Home -> SkillDetail)
export type RootStackParamList = {
  Home: undefined;
  SkillDetail: { skill: Skill };
};

// Tab Navigator (HomeStack | Settings)
export type RootTabParamList = {
  // 'HomeStack' 탭은 RootStackParamList 전체를 중첩합니다.
  HomeStack: NavigatorScreenParams<RootStackParamList>;
  Settings: undefined;
};

// 각 스크린이 받을 Props 타입을 미리 정의 
export type HomeScreenProps = StackScreenProps<RootStackParamList, 'Home'>;
export type SkillDetailScreenProps = StackScreenProps<RootStackParamList, 'SkillDetail'>;
export type SettingsScreenProps = BottomTabScreenProps<RootTabParamList, 'Settings'>;