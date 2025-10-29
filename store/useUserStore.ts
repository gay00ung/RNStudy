import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

// 스토어의 상태와 함수에 대한 타입 정의
type UserState = {
    name: string;
    jobTitle: string;
    authToken: String | null; // 인증 토큰 상태 추가 (초기 값: null)
    profileImageUri?: string | null;
    setName: (newName: string) => void;
    toggleJobTitle: () => void;
    login: (token: string) => void; // 로그인 함수 추가 (토큰 저장)
    logout: () => void; // 로그아웃 함수 추가 (토큰 제거)
    setProfileImageUri: (uri: string | null) => void;
};

// Zustand를 사용하여 사용자 정보 스토어 생성
// create 함수에 상태와 함수를 정의하는 콜백 함수를 전달
// set: 상태를 업데이트하는 함수 (ViewModel의 _state.value = ...와 유사)
export const useUserStore = create(
    // persist 미들웨어를 사용하여 상태를 AsyncStorage에 영구 저장
    persist<UserState>(
        (set) => ({
            // 초기 상태 값 설정
            name: 'gay00ung',
            jobTitle: 'Android Developer',
            authToken: null, // 초기 인증 토큰 값은 null
            profileImageUri: null,

            // 상태를 변경하는 함수 (ViewModel의 public fun setName(...) {...}와 유사)
            // 이 함수들이 호출 될 때 마다 자동으로 AsyncStorage에 상태가 저장됨
            setName: (newName) => set({ name: newName }),

            // jobTitle을 토글하는 함수
            toggleJobTitle: () => set((state) => ({
                jobTitle: state.jobTitle === 'Android Developer' ? 'iOS Developer' : 'Mobile Developer'
            })),

            // 로그인 함수: 토큰을 받아서 스토어에 저장
            login: (token) => set({ authToken: token }),

            // 로그아웃 함수: 토큰을 null로 설정하여 제거
            logout: () => set({ authToken: null, profileImageUri: null }),

            // 프로필 이미지 URI 설정 함수
            setProfileImageUri: (uri) => set({ profileImageUri: uri }),
        }),
        {
            // persist 옵션 설정
            name: 'user-storage', // 스토어의 이름 (키)
            storage: createJSONStorage(() => AsyncStorage), // AsyncStorage를 스토리지로 사용
        }
    )
);