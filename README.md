# 🚀 Kakao Tech Bootcamp - Networking Day 투자 프로그램

스타트업 팀에 투자하는 시뮬레이션 웹 애플리케이션입니다. Firebase Firestore를 사용하여 실시간 데이터 동기화를 구현했습니다.

---

## 📋 목차

- [프로젝트 개요](#프로젝트-개요)
- [주요 기능](#주요-기능)
- [기술 스택](#기술-스택)
- [데이터 구조](#데이터-구조)
- [페이지 구성](#페이지-구성)
- [핵심 로직 설명](#핵심-로직-설명)
- [설치 및 실행](#설치-및-실행)
- [개선된 기능](#개선된-기능)
- [알려진 제약사항](#알려진-제약사항)

---

## 🎯 프로젝트 개요

투자자가 여러 스타트업 팀에 투자할 수 있는 웹 애플리케이션입니다.

### 핵심 컨셉
- **투자자**: 초기 자금 1,000만원을 보유하고 팀에 투자
- **팀**: 투자를 받는 스타트업 (관리자가 생성/삭제)
- **투자**: 10만원 단위로 투자, 한 팀당 한 번만 가능

---

## ✨ 주요 기능

### 👤 투자자 (index.html)
- ✅ 투자자 계정 생성/로그인 (LocalStorage 사용)
- ✅ 초기 자금 10,000,000원 지급
- ✅ 남은 투자금 실시간 표시
- ✅ 팀 리스트 실시간 업데이트 (총 투자금 포함)
- ✅ 팀 클릭 시 투자 페이지로 이동

### 💰 투자 페이지 (team.html)
- ✅ 10만원 단위 투자 입력
- ✅ 잔액 부족 검증
- ✅ 중복 투자 방지 (한 팀당 1회만)
- ✅ Transaction을 사용한 Race Condition 방지
- ✅ 투자 완료 시 투자자 잔액 차감 + 팀 총 투자금 증가

### 🛠️ 관리자 페이지 (admin.html)
- ✅ 팀 생성 (이름 입력 → 자동 ID 생성)
- ✅ 팀별 투자 현황 실시간 모니터링
- ✅ 팀 삭제 (투자금 자동 환불)
- ✅ 전체 데이터 초기화 (users, teams, investments 모두 삭제)

---

## 🔧 기술 스택

| 분류 | 기술 |
|------|------|
| **Frontend** | HTML5, JavaScript (ES6 Modules) |
| **Backend** | Firebase Firestore |
| **인증** | LocalStorage (간단한 이름 기반) |
| **실시간 동기화** | Firestore onSnapshot |
| **트랜잭션** | Firestore runTransaction |
| **버전** | Firebase SDK 12.8.0 |

---

## 📊 데이터 구조

### Firestore Collections

#### 1. `users` (투자자)
```javascript
{
  name: "사용자이름",              // 문서 ID로도 사용
  remainingMoney: 10000000,        // 남은 투자금
  createdAt: Timestamp
}
```

#### 2. `teams` (스타트업 팀)
```javascript
{
  name: "AI 스타트업",             // 팀 이름
  totalInvestment: 500000,         // 총 투자 받은 금액
  createdAt: Timestamp
}
```

#### 3. `investments` (투자 기록)
```javascript
// 문서 ID: "{userId}_{teamId}" (예: "홍길동_team1")
{
  user: "홍길동",                  // 투자자 이름
  teamId: "team1",                 // 팀 ID
  amount: 500000,                  // 투자 금액
  timestamp: Timestamp
}
```

### 데이터 관계도

```
┌─────────────┐       ┌─────────────────┐       ┌─────────────┐
│   users     │       │  investments    │       │    teams    │
├─────────────┤       ├─────────────────┤       ├─────────────┤
│ 홍길동      │◄──────│  홍길동_team1   │──────►│   team1     │
│ money: 950만│       │ - user          │       │ AI 스타트업  │
│             │       │ - teamId        │       │ total: 50만 │
└─────────────┘       │ - amount: 50만  │       └─────────────┘
                      └─────────────────┘
```

---

## 📄 페이지 구성

### 1. **index.html** - 메인 페이지

**UI 구성**
- 투자자 이름 입력 + 시작하기 버튼
- 남은 투자금 표시
- 팀 리스트 (클릭 가능)

**주요 로직**
```javascript
// 사용자 생성
startBtn.onclick = async () => {
  await setDoc(doc(db, "users", name), {
    name, remainingMoney: 10000000
  });
  localStorage.setItem("user", name);
};

// 실시간 팀 리스트
onSnapshot(collection(db, "teams"), snapshot => {
  // 팀 목록 업데이트
});
```

---

### 2. **team.html** - 투자 페이지

**UI 구성**
- 팀 이름 표시
- 투자 금액 입력 (10만원 단위)
- 투자 버튼

**주요 로직**
```javascript
window.invest = async function () {
  await runTransaction(db, async (transaction) => {
    // 1. 중복 투자 체크
    // 2. 잔액 확인
    // 3. 투자자 잔액 차감
    // 4. 팀 총 투자금 증가
    // 5. 투자 기록 생성
  });
};
```

---

### 3. **admin.html** - 관리자 페이지

**UI 구성**
- 팀 생성 폼 (팀 이름 입력)
- 팀별 투자 현황 리스트
- 각 팀 옆 삭제 버튼
- 전체 데이터 초기화 버튼

**주요 로직**
```javascript
// 팀 생성
addTeamBtn.onclick = async () => {
  const teamId = `team_${Date.now()}`;
  await setDoc(doc(db, "teams", teamId), {
    name: teamName,
    totalInvestment: 0
  });
};

// 팀 삭제 (환불 포함)
window.deleteTeam = async (teamId) => {
  // 1. 투자 기록 조회
  // 2. 투자자별 환불 금액 계산
  // 3. 투자자 잔액 복구
  // 4. 투자 기록 삭제
  // 5. 팀 삭제
};
```

---

## 🧠 핵심 로직 설명

### 1️⃣ **중복 투자 방지 메커니즘**

**원리**: 고정 문서 ID 사용

```javascript
// 투자 시
const investId = `${user}_${teamId}`;  // "홍길동_team1"
const investRef = doc(db, "investments", investId);

// 중복 체크
const investSnap = await transaction.get(investRef);
if (investSnap.exists()) {
  throw new Error("이미 투자함");
}

// 투자 기록 저장 (같은 ID로 생성)
transaction.set(investRef, {
  user, teamId, amount, timestamp
});
```

**장점**
- O(1) 시간 복잡도로 빠른 중복 체크
- 쿼리 없이 문서 ID만으로 확인 가능

**제약**
- 한 팀당 딱 한 번만 투자 가능 (추가 투자 불가)

---

### 2️⃣ **Race Condition 방지: Firestore Transaction**

**문제 상황**
```javascript
// ❌ 잘못된 방법 (Race Condition 발생 가능)
const userSnap = await getDoc(userRef);
const money = userSnap.data().remainingMoney;

// 이 사이에 다른 투자가 발생하면?
await updateDoc(userRef, { remainingMoney: money - amount });
```

**해결 방법**
```javascript
// ✅ Transaction 사용
await runTransaction(db, async (transaction) => {
  const userSnap = await transaction.get(userRef);
  const money = userSnap.data().remainingMoney;
  
  // 트랜잭션 내에서는 원자적으로 처리됨
  transaction.update(userRef, { 
    remainingMoney: money - amount 
  });
});
```

---

### 3️⃣ **팀 삭제 시 환불 로직**

**처리 순서**
1. 해당 팀의 모든 투자 기록 조회
2. 투자자별 환불 금액 집계
3. 각 투자자의 `remainingMoney` 증가
4. 투자 기록 삭제
5. 팀 삭제

**예시**
```
삭제 전:
- 사용자A: 9,500,000원 (team1에 500,000원 투자)
- team1 삭제

삭제 후:
- 사용자A: 10,000,000원 ✅ 환불됨
- team1: 삭제됨
- 투자기록: 삭제됨
```

---

## 🚀 설치 및 실행

### 1. 프로젝트 클론
```bash
git clone <repository-url>
cd kakaotechbootcamp-networkingday-investment
```

### 2. Firebase 설정
`firebase.js` 파일에 Firebase 프로젝트 설정이 포함되어 있습니다.

```javascript
const firebaseConfig = {
  apiKey: "...",
  authDomain: "...",
  projectId: "tech-entrepreneur-invest",
  // ...
};
```

### 3. 로컬 서버 실행
```bash
# Python 3 사용
python3 -m http.server 8080

# 또는 Node.js http-server
npx http-server -p 8080
```

### 4. 브라우저에서 접속
```
http://localhost:8080/index.html
http://localhost:8080/admin.html
```

---

## 🔄 개선된 기능

### 수정 전 문제점
1. ❌ 중복 투자 방지 버그 (`addDoc` 사용으로 ID 불일치)
2. ❌ Race Condition (동시 투자 시 데이터 불일치)
3. ❌ null/undefined 체크 누락
4. ❌ 팀 생성 기능 없음
5. ❌ 팀 삭제 시 투자금 미환불
6. ❌ 에러 처리 부족

### 수정 후
1. ✅ `setDoc`으로 고정 ID 사용하여 중복 투자 완벽 차단
2. ✅ `runTransaction`으로 원자적 처리
3. ✅ 모든 데이터 접근 시 null/undefined 검증
4. ✅ admin.html에 팀 생성 UI 추가
5. ✅ 팀 삭제 시 자동 환불 로직 구현
6. ✅ try-catch로 에러 처리 + 사용자 피드백

---

## ⚠️ 알려진 제약사항

### 1. 인증 시스템
- **현재**: 이름 기반 간단 인증 (LocalStorage)
- **문제**: 보안 취약, 동명이인 불가
- **개선 필요**: Firebase Authentication 도입

### 2. 투자 정책
- **제약**: 한 팀당 한 번만 투자 가능 (추가 투자 불가)
- **개선 필요**: 추가 투자 허용 또는 투자 수정/취소 기능

### 3. UI/UX
- **현재**: alert() 사용
- **개선 필요**: Toast 알림, 모달 대화상자 등

### 4. 입력 검증
- **부족**: 음수, 0, 너무 큰 금액 검증 미흡
- **개선 필요**: 프론트엔드 + 백엔드 검증 강화

### 5. 실시간 업데이트
- **현재**: onSnapshot으로 구현
- **주의**: 많은 사용자 접속 시 읽기 비용 증가 가능

---

## 📝 테스트 시나리오

### 정상 플로우
1. **index.html** → 투자자 등록 → "홍길동" 입력
2. **admin.html** → 팀 생성 → "AI 스타트업", "블록체인 기업"
3. **index.html** → 팀 리스트에서 "AI 스타트업" 클릭
4. **team.html** → 500,000원 입력 → 투자
5. **index.html** → 잔액 9,500,000원 확인
6. **admin.html** → "AI 스타트업: 500,000원" 확인

### 예외 처리
- ❌ 같은 팀에 재투자 시도 → "이미 투자함" 알림
- ❌ 잔액 부족 시 투자 → "잔액 부족" 알림
- ❌ 10만원 단위 아닌 금액 → "10만원 단위" 알림

---

## 🤝 기여

이 프로젝트는 Kakao Tech Bootcamp Networking Day 행사를 위해 제작되었습니다.

---

## 📄 라이선스

MIT License

---

## 📞 문의

프로젝트 관련 문의사항은 이슈를 통해 남겨주세요.