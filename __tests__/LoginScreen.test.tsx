import React from 'react';
import { render, screen } from '@testing-library/react-native';
import LoginScreen from '../screens/LoginScreen';
import { useUserStore } from '../store/useUserStore';

// jest.mock을 이용해 Zustand 스토어를 모킹(mocking)
// 테스트는 실제 스토어나 AsyncStorage에 의존하지 않고,
// 대신 모킹된 스토어를 사용하여 독립적으로 실행될 수 있음
jest.mock('../store/useUserStore', () => ({
    useUserStore: jest.fn(() => ({
        login: jest.fn(),
    })),
}));

// apiService도 가짜로 만들기
// 테스트가 실제 네트워크 요청을 보내면 안 되기 때문
jest.mock('../api/apiService', () => ({
  login: jest.fn(), // login 함수가 호출될 수 있도록 가짜 함수를 제공
}));

// 테스트 스위트(Suite) 정의: LoginScreen 관련 테스트들을 묶음
describe('LoginScreen', () => {
    // it() 또는 test() 블록 안에서 테스트 실행
    it('로그인 화면이 올바르게 렌더링되는지 확인', () => {
        render(<LoginScreen />);

        // 화면에 '로그인' 텍스트가 여러 개 있을 수 있으므로 getAllByText 사용
        const titleElements = screen.getAllByText('로그인');
        expect(titleElements.length).toBeGreaterThan(0);

        // 아이디와 비밀번호 입력 필드가 있는지 확인
        const usernameInput = screen.getByPlaceholderText('아이디');
        const passwordInput = screen.getByPlaceholderText('비밀번호');
        
        expect(usernameInput).toBeTruthy();
        expect(passwordInput).toBeTruthy();
    });
});