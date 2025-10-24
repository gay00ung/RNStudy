import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

// 스토어의 상태와 함수에 대한 타입 정의
type UserState = {
    name: string;
    jobTitle: string;
    setName: (newName: string) => void;
    toggleJobTitle: () => void;
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

            // 상태를 변경하는 함수 (ViewModel의 public fun setName(...) {...}와 유사)
            // 이 함수들이 호출 될 때 마다 자동으로 AsyncStorage에 상태가 저장됨
            setName: (newName) => set({ name: newName }),

            // jobTitle을 토글하는 함수
            toggleJobTitle: () => set((state) => ({
                jobTitle: state.jobTitle === 'Android Developer' ? 'iOS Developer' : 'Mobile Developer'
            })),
        }),
        {
            // persist 옵션 설정
            name: 'user-storage', // 스토어의 이름 (키)
            storage: createJSONStorage(() => AsyncStorage), // AsyncStorage를 스토리지로 사용
        }
    )
);