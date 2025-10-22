# Android 개발자의 React Native 학습 여정 🚀  

이 프로젝트는 Kotlin & Jetpack Compose에 익숙한 안드로이드 개발자가 **React Native**와 **TypeScript**를 학습하기 위해 만든 간단한 프로필 앱임.  

주요 목표는 **안드로이드 개발에서 사용했던 개념들이 React Native 생태계에서는 어떻게 구현되는지 1:1로 비교하고 익숙해지는 것**임.  

---

## ⚙️ 실행 방법  

### 1. 의존성 설치  
```bash
npm install
````

### 2. Expo 개발 서버 시작

```bash
npx expo start
```

### 3. Expo Go 앱에서 QR 코드 스캔

---

## 🧠 핵심 개념 매핑: Compose vs React Native

안드로이드 개발자로서 가장 궁금했던 **“Compose의 OOO는 RN에서 뭔가요?”** 에 대한 비교표임.

| 기능 (Feature) | ✅ Android (Kotlin/Compose)         | ⚛️ React Native (TypeScript)                   | 비고                                                |
| ------------ | ---------------------------------- | ---------------------------------------------- | ------------------------------------------------- |
| **언어**       | Kotlin                             | TypeScript / JavaScript                        | 정적 타입 안정성을 위해 TypeScript 사용 권장함                   |
| **UI 컴포넌트**  | `@Composable fun MyComponent()`    | `const MyComponent = () => {}`                 | 둘 다 UI를 반환하는 함수형 컴포넌트 구조임                         |
| **기본 레이아웃**  | `Column`, `Row`, `Box`             | `<View>` + `flexDirection`                     | `<View>`는 `flexDirection`에 따라 Column 또는 Row처럼 동작함 |
| **텍스트**      | `Text("...")`                      | `<Text>...</Text>`                             | 사용법이 거의 동일함                                       |
| **이미지**      | `Image(painter = ...)`             | `<Image source={...} />`                       | 로컬 이미지는 `require`, 네트워크 이미지는 `uri` 사용함            |
| **사용자 입력**   | `TextField(value, onValueChange)`  | `<TextInput value={...} onChangeText={...} />` | 상태와 UI를 바인딩하는 원리가 같음                              |
| **클릭/터치**    | `Modifier.clickable {}` / `Button` | `<TouchableOpacity>` / `<Pressable>`           | TouchableOpacity는 클릭 시 투명도 효과를 줌                  |
| **리스트**      | `LazyColumn`, `LazyRow`            | `<FlatList>`                                   | 보이는 항목만 렌더링하는 가상화 리스트로 성능 최적화함                    |
| **스타일링**     | `Modifier.padding()` ...           | `StyleSheet.create({...})`                     | Compose는 함수 체이닝, RN은 CSS 유사 스타일 객체 사용함            |
| **상태 관리**    | `mutableStateOf()`                 | `useState()`                                   | 컴포넌트 내부 상태를 관리하는 Hook으로 동일한 개념임                   |
| **안전 영역**    | `WindowInsets`                     | `<SafeAreaView>`                               | 노치, 상태바 등 시스템 UI 영역을 피하기 위해 사용함                   |

---

## 🎯 학습 목표

* 선언형 UI 패러다임과 컴포넌트 기반 아키텍처에 적응함
* Compose의 사고방식을 React Native로 전이함
* TypeScript의 타입 안정성과 React Hook 기반 상태 관리를 익힘
