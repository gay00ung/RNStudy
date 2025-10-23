import { create } from 'zustand';

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
export const useUserStore = create<UserState>((set) => ({
    // 초기 상태 값 설정
    name: 'gay00ung',
    jobTitle: 'Android Developer',

    // 상태를 변경하는 함수 (ViewModel의 public fun setName(...) {...}와 유사)
    setName: (newName) => set({ name: newName }),

    // jobTitle을 토글하는 함수
    toggleJobTitle: () => set((state) => ({
        jobTitle: state.jobTitle === 'Android Developer' ? 'iOS Developer' : 'Mobile Developer'
    })),
}));