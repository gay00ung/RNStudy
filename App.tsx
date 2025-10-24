import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList, RootTabParamList, AuthStackParamList } from './navigation/types';
import { useUserStore } from './store/useUserStore';
import HomeScreen from './screens/HomeScreen';
import SkillDetailScreen from './screens/SkillDetailScreen';
import SettingsScreen from './screens/SettingsScreen';
import LoginScreen from './screens/LoginScreen';
import { Toast } from 'react-native-toast-message/lib/src/Toast';

// Stack 및 Tab 네비게이터 생성
// 각 네비게이터 스택을 생성하고 타입 지정
const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<RootTabParamList>();
const AuthStack = createStackNavigator<AuthStackParamList>();

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

function HomeTabNavigator() {
  return (
    <Tab.Navigator
      // ({ route }) 파라미터를 받아, 현재 라우트(화면)에 따라 다른 옵션을 설정
      screenOptions={({ route }) => ({
        // 탭 아이콘을 설정하는 부분 (Compose의 NavigationBarItem의 icon = { ... }과 동일)
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: React.ComponentProps<typeof Ionicons>['name']; // 아이콘 이름 타입 추론

          if (route.name === 'HomeStack') {
            // focused 상태에 따라 다른 아이콘 사용
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Settings') {
            iconName = focused ? 'settings' : 'settings-outline';
          } else {
            iconName = 'help-outline'; // 기본 아이콘
          }
          // Ionicons 컴포넌트를 반환하여 아이콘 렌더링
          // color와 size는 React Navigation에서 자동으로 전달
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#667eea',
        tabBarInactiveTintColor: 'gray',
      })}>
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
  );
}

// 로그인이 안됐을 때 보여줄 인증 스택
function AuthNavigator() {
  return (
    <AuthStack.Navigator>
      <AuthStack.Screen
        name="Login"
        component={LoginScreen}
        options={{ headerShown: false }} // 로그인 화면에서는 헤더 숨기기
      />
    </AuthStack.Navigator>
  );
}

// 메인 앱 컴포넌트 (라우터)
export default function App() {
  // Zustand 스토어에서 인증 토큰 상태 구독
  // (Kotlin/Compose 매핑: viewModel.authToken.collectAsState())
  const authToken = useUserStore((state) => state.authToken);

  return (
    <NavigationContainer>
      <StatusBar style={authToken ? 'light' : 'dark'} />
      {/* 인증 토큰이 있으면 홈 탭 네비게이터, 없으면 인증 네비게이터 표시 */}
      {authToken ? <HomeTabNavigator /> : <AuthNavigator />}

      {/* Toast 메시지 표시를 위한 컴포넌트 */}
      <Toast />
    </NavigationContainer>
  );
}