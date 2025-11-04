import React, { useState, useEffect, useRef } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer, NavigationContainerRef, LinkingOptions } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { MainStackParamList, RootTabParamList, AuthStackParamList, SettingsStackParamList } from './navigation/types';
import { useUserStore } from './store/useUserStore';
import HomeScreen from './screens/HomeScreen';
import SkillDetailScreen from './screens/SkillDetailScreen';
import SettingsScreen from './screens/SettingsScreen';
import WebViewScreen from './screens/WebViewScreen';
import LoginScreen from './screens/LoginScreen';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import * as SplashScreen from 'expo-splash-screen';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform, Linking, ActivityIndicator } from 'react-native';

// Zustand가 로드 되었는지 추적하는 상태
// SplashScreen이 자동으로 사라지지 않도록 설정
SplashScreen.preventAutoHideAsync();

// Stack 및 Tab 네비게이터 생성
// 각 네비게이터 스택을 생성하고 타입 지정
const Stack = createStackNavigator<MainStackParamList>();
const Tab = createBottomTabNavigator<RootTabParamList>();
const AuthStack = createStackNavigator<AuthStackParamList>();
const SettingsStack = createStackNavigator<SettingsStackParamList>();

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

// '설정' 탭의 내용물이 될 스택 네비게이터 컴포넌트
function SettingsStackNavigator() {
  return (
    <SettingsStack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#667eea' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 'bold' },
      }}
    >
      <SettingsStack.Screen
        name="SettingsMain" // navigation/types.ts의 SettingsStackParamList와 일치
        component={SettingsScreen}
        options={{ title: '설정' }}
      />
      <SettingsStack.Screen
        name="WebView"
        component={WebViewScreen}
        options={{ title: '웹뷰' }}
      />
    </SettingsStack.Navigator>
  )
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
          } else if (route.name === 'SettingsStack') {
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
        name="SettingsStack"
        component={SettingsStackNavigator}
        options={{
          title: '설정',
          headerShown: false
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

// 알림 수신 시 기본 동작 설정 (앱이 켜져 있을 때)
// (Kotlin 매핑: FirebaseMessagingService.onMessageReceived)
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true, // 앱이 켜져있어도 알림 배너를 띄움
    shouldPlaySound: false,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

// 푸시 알림 권한 요청 및 토큰 발급 함수
// (Kotlin/Compose 매핑: FCM SDK 초기화 및 토큰 요청 로직과 동일)
async function registerForPushNotificationsAsync() {
  let token;

  // 디바이스인지 확인 (시뮬레이터에서는 푸시 알림 불가)
  if (Device.isDevice) {
    // 권한 상태 확인
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus

    // 권한이 없으면 요청
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    // 권한 거부시 함수 종료
    if (finalStatus !== 'granted') {
      alert('푸시 알림 권한이 거부되었습니다!');
      return;
    }

    // Expo 푸시 토큰 발급
    // (Kotlin/Compose 매핑: FirebaseMessaging.getInstance().token 과 동일)
    try {
      const expoPushToken = await Notifications.getExpoPushTokenAsync({
        projectId: 'd9f06e2f-07c0-476f-a6b0-5dbf2dbc76c8' // Expo 프로젝트 ID
      });
      token = expoPushToken.data;
      console.log('Expo Push Token:', token);
    } catch (error) {
      console.error('Error getting Expo push token:', error);
    }
  } else {
    alert('푸시 알림은 실제 디바이스에서만 작동합니다!');
  }

  // 안드로이드 알림 채널 설정
  if (Platform.OS == 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }
  return token;
}

// 딥 링킹 설정 정의
// (Kotlin 매핑: NavDeepLink { uriPattern = "..." } )
const linking: LinkingOptions<RootTabParamList> = {
  prefixes: ['myrnapp://'],
  config: {
    screens: {
      HomeStack: {
        screens: {
          Home: 'home',
          SkillDetail: {
            path: 'skills/:skillId',
            parse: {
              skillId: (value: string) => value,
            },
          },
        },
      },
      SettingsStack: {
        screens: {
          SettingsMain: 'settings',
          WebView: 'webview',
        },
      },
    },
  },
};

// 메인 앱 컴포넌트 (라우터)
export default function App() {
  // Zustand 로딩 완료 상태인지 추적하는 로컬 상태
  const [appIsReady, setAppIsReady] = useState(false);

  // Zustand 스토어에서 인증 토큰 상태 구독
  // (Kotlin/Compose 매핑: viewModel.authToken.collectAsState())
  const authToken = useUserStore((state) => state.authToken);

  // 네비게이션 컨테이너를 직접 제어하기 위한 Ref 생성
  // (Kotlin 매핑: Activity에서 NavController 인스턴스를 들고 있는 것과 유사)
  const navigationRef = useRef<NavigationContainerRef<RootTabParamList>>(null);

  // Zustand 의 persist 미들웨어가 AsyncStorage로부터
  // 데이터 로딩(rehydration)을 완료했는지 확인
  useEffect(() => { // Compose의 LaunchedEffect와 유사
    async function prepareApp() {
      try {
        // Zustand 스토어의 persist가 로드 완료 되었는지 확인
        // persist 미들웨어의 hasHydrated()와 onFinishHydration() 사용가능
        if (useUserStore.persist.hasHydrated()) {
          // Zustand 스토어가 이미 Hydrate(복원)된 경우
          setAppIsReady(true);
        } else {
          // Zustand 스토어가 아직 Hydrate되지 않은 경우, 완료될 때까지 대기 (리스너 등록)
          const unsub = useUserStore.persist.onFinishHydration(() => {
            setAppIsReady(true); // 로드 완료 되면 상태 변경
            unsub(); // 완료 후 구독 해제
          });
        }

        // 푸시 알림 권한 요청 및 토큰 발급
        registerForPushNotificationsAsync();
      } catch (e) {
        console.warn(e);
        setAppIsReady(true); // 오류 발생해도 앱 실행 계속
      }
    }

    prepareApp();

    // 알림 "탭" 리스너 등록
    // (Kotlin 매핑: PendingIntent를 받아서 intent.extras를 처리하는 로직)
    const notificationResponseListener = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('Notification Response Received:', response);

      // 알림에 숨겨진 data를 꺼냄
      const data = response.notification.request.content.data;

      if (data && data.skillId && data.skillTitle &&
        typeof data.skillId === 'string' && typeof data.skillTitle === 'string') {
        // 앱이 완전히 로드 된 후에만 (navigationRef.isReady()) 네비게이션 수행
        if (navigationRef.current) {
          // SkillDetail 화면으로 네비게이션
          navigationRef.current.navigate('HomeStack', { // 먼저 'HomeStack' 탭으로 이동
            screen: 'SkillDetail', // 그 안의 'SkillDetail' 스크린으로 이동
            params: { // 파라미터 전달
              skill: {
                id: data.skillId,
                title: data.skillTitle,
              },
            },
          });
        }
      }
    });

    // 포그라운드 알림 수신 리스너 등록
    const notificationReceivedListener = Notifications.addNotificationReceivedListener(notification => {
      console.log('Notification Received in foreground:', notification);
    });

    // 컴포넌트가 사라질 때 리스너 정리 (메모리 누수 방지)
    return () => {
      notificationReceivedListener.remove();
      notificationResponseListener.remove();
    };
  }, []); // 마운트 시 한 번만 실행

  // 앱 준비가 완료되면 SplashScreen 숨기기
  useEffect(() => {
    if (appIsReady) {
      SplashScreen.hideAsync();
    }
  }, [appIsReady]); // appIsReady가 변경될 때마다 실행

  // 앱이 준비되지 않았으면 아무것도 렌더링하지 않음
  if (!appIsReady) {
    return null;
  }

  // 앱이 준비 되었으면 네비게이터 렌더링
  return (
    // NavigationContainer에 ref를 연결 + linking prop과 fallback을 추가
    <NavigationContainer
      ref={navigationRef}
      linking={linking}
      fallback={<ActivityIndicator size="large" color="blue" />} // 딥 링크가 로드되는 동안 보여줄 로딩 스피너
    >
      <StatusBar style={authToken ? 'light' : 'dark'} />
      {/* 인증 토큰이 있으면 홈 탭 네비게이터, 없으면 인증 네비게이터 표시 */}
      {authToken ? <HomeTabNavigator /> : <AuthNavigator />}

      {/* Toast 메시지 표시를 위한 컴포넌트 */}
      <Toast />
    </NavigationContainer>
  );
}
