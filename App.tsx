import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { RootStackParamList, RootTabParamList } from './navigation/types';
import HomeScreen from './screens/HomeScreen';
import SkillDetailScreen from './screens/SkillDetailScreen';
import SettingsScreen from './screens/SettingsScreen';

// Stack 및 Tab 네비게이터 생성
const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<RootTabParamList>();

// 중첩될 스택 네이게이터 정의
// '홈' 탭의 내용물 (Home -> SkillDetail)
function HomeStack() {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerStyle: {
          backgroundColor: '#667eea'
        },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 'bold' },
      }}
    >
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: '내 프로필' }}
      />
      <Stack.Screen
        name="SkillDetail"
        component={SkillDetailScreen}
        options={{ title: '스킬 상세' }}
      />
    </Stack.Navigator >
  );
}

// 메인 앱 컴포넌트
// TabNavigator를 렌더링
export default function App() {
  return (
    // NavigationContainer는 네비게이션 트리와 상태를 관리
    <NavigationContainer>
      <StatusBar style="auto" />
      <Tab.Navigator
        // 탭 네비게이터의 전반적인 옵션 설정
        screenOptions={{
          tabBarActiveTintColor: '#667eea',
          tabBarInactiveTintColor: '#94a3b8',
        }}
      >
        {/* '홈' 탭에 중첩된 스택 네비게이터 연결 */}
        <Tab.Screen
          name="HomeStack"
          component={HomeStack}
          options={{
            // 탭 제목과 헤더 숨기기 설정
            title: '홈',
            headerShown: false
          }}
        />
        {/* '설정' 탭에 SettingsScreen 연결 */}
        <Tab.Screen
          name="Settings"
          component={SettingsScreen}
          options={{
            title: '설정',
            headerStyle: { backgroundColor: '#667eea' },
            headerTintColor: '#fff'
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}