import axios from 'axios';
// navigation/types.ts에서 Skill 타입을 가져옴
import { Skill, SkillDetail } from '../navigation/types';

// API의 기본 URL (Retrofit의 BaseUrl과 동일)
const API_URL = 'https://jsonplaceholder.typicode.com';

// API 호출을 담당하는 객체 (Retrofit의 @Service 구현체와 유사)
// Promise: 비동기 작업의 완료 또는 실패를 나타내는 객체 (Pending, Fulfilled, Rejected 상태 가짐)
// async/await: 비동기 코드를 동기 코드처럼 작성할 수 있게 해주는 문법
const apiService = {
    /**
     * (Kotlin 매핑)
     * suspend fun getSkills(): List<Skill>
    */
    fetchSkills: async (): Promise<Skill[]> => {
        try {
            // GET /todos?_limit=20 (20개만 가져오기)
            // Ktor: client.get<List<TodoDto>>("...")
            const response = await axios.get(`${API_URL}/todos`, { // await: promise가 완료될 때까지 기다림
                params: {
                    _limit: 20, // 최대 20개의 항목만 가져오기
                },
            });

            // API 응답(DTO)을 UI 모델(Skill)로 변환(매핑)
            const skills: Skill[] = response.data.map((item: any) => ({
                id: item.id.toString(),
                title: item.title, // API의 title 필드를 Skill의 title로 매핑
            }));

            return skills;
        } catch (error) {
            console.error('Error fetching skills from API:', error);
            // 에러 발생시 호출한 쪽(HomeScreen)에서 처리할 수 있도록 예외 던지기
            throw new Error('Failed to fetch skills');
        }
    },

    /**
     * ID로 스킬 상세 정보 가져오기
     * (Kotlin 매핑)
     * suspend fun getSkillDetail(id: String): SkillDetail
     */
    fetchSkillDetail: async (id: string): Promise<SkillDetail> => {
        try {
            const response = await axios.get(`${API_URL}/todos/${id}`);
            const data = response.data;

            // API 응답을 SkillDetail 타입으로 매핑
            const skillDetail: SkillDetail = {
                id: data.id.toString(),
                title: data.title,
                completed: data.completed,
                description: `이 작업은 ID ${data.id}에 대한 상세 설명입니다. API 응답에는 없지만 예시를 위해 추가되었습니다.`
            };
            return skillDetail;
        } catch (error) {
      console.error(`API Error fetching skill detail for id ${id}: `, error);
      throw new Error('Failed to fetch skill detail');
        }
    },

    /**
     * (신규 추가) 가짜 로그인 API
     * (Kotlin 매핑)
     * suspend fun login(user: String, pass: String): AuthToken
    */
    login: async (username: string, password: string): Promise<string> => {
        console.log('Logging in with', username, password);
        // 1초 지연 후 가짜 토큰 반환
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (username === 'root' && password === '1234') {
                    console.log('Login successful');
                    resolve('mock-auth-token-123456'); // 모의 토큰 반환
                } else {
                    console.log('Login failed');
                    // 로그인 실패 시 예외 발생
                    reject(new Error('아이디 또는 비밀번호가 올바르지 않습니다.'));
                }
            }, 1000);
        });
    }
};

// apiService 객체를 기본 내보내기
export default apiService;