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
export type SkillDetailParams =
    | { skill: Skill }
    | { skillId: string; skillTitle?: string };

export type MainStackParamList = {
    Home: undefined;
    SkillDetail: SkillDetailParams;
};

// Settings Stack (SettingsMain -> WebView)
export type SettingsStackParamList = {
    SettingsMain: undefined;
    WebView: undefined;
}

// Tab Navigator (HomeStack | Settings)
export type RootTabParamList = {
    // 'HomeStack' 탭은 RootStackParamList 전체를 중첩합니다.
    HomeStack: NavigatorScreenParams<MainStackParamList>;
    SettingsStack: NavigatorScreenParams<SettingsStackParamList>;
};

// Auth Stack (Login)
export type AuthStackParamList = {
    Login: undefined;
};

// --- 개별 스크린 Props 정의 ---
// Props는 부모 컴포넌트에서 자식 컴포넌트로 전달되는 데이터
// Compose
// @Composable
// fun ChildComponent(name: String, age: Int) {
//     Text(text = "$name 님, $age 세")
// }

// 사용
// ChildComponent(name = "홍길동", age = 25)

// 각 스크린이 받을 Props 타입을 미리 정의 
export type HomeScreenProps = StackScreenProps<MainStackParamList, 'Home'>;
export type SkillDetailScreenProps = StackScreenProps<MainStackParamList, 'SkillDetail'>;

// RootTabParamList 내부 스크린들의 Props
export type SettingsScreenProps = StackScreenProps<SettingsStackParamList, 'SettingsMain'>;
export type WebViewScreenProps = StackScreenProps<SettingsStackParamList, 'WebView'>;

// AuthStack 스크린 Props (LoginScreen은 navigation prop을 직접 쓰진 않지만 정의해둠)
export type LoginScreenProps = StackScreenProps<AuthStackParamList, 'Login'>;
