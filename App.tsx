import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';

import HomeScreen from './screens/HomeScreen';
import SkillDetailScreen from './screens/SkillDetailScreen';
import { RootStackParamList } from './navigation/types';

// 화면 스택(Stack)을 정의합니다.
// 안드로이드 NavGraph의 <navigation> 태그와 동일
const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  return (
    // NavigationContainer는 네비게이션 트리와 상태를 관리
    <NavigationContainer>
      <StatusBar style="auto" />
      {/* Stack.Navigator는 스택 내비게이션을 설정 */}
      <Stack.Navigator initialRouteName="Home">
        {/** 각 스크린에 대한 Stack.Screen 컴포넌트를 추가합니다. */}
        <Stack.Screen
          name="Home" // 스크린 이름
          component={HomeScreen} // 렌더링할 컴포넌트
          options={{ title: '홈' }} // 헤더에 표시할 옵션
        />
        <Stack.Screen
          name="SkillDetail"
          component={SkillDetailScreen}
          options={{ title: '스킬 상세' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}