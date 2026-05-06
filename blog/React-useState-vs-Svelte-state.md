---
title: 'React useState와 Svelte $state 상태 관리 철학 비교하기'
date: '2026-05-02'
category: 'FE'
summary: '업데이트 방식, 리렌더링, 파생 상태, 반영 타이밍, 객체/배열 처리'
---

React의 `useState`와 Svelte의 `$state`는 둘 다 "상태를 선언하고 변경하면 UI가 업데이트된다"는 같은 목적을 가지고 있다. 하지만 그 목적을 달성하는 방식에서 각 프레임워크의 설계 철학이 드러난다. 이 글에서는 업데이트 방식, 리렌더링 범위, 파생 상태, 타이밍, 객체/배열 처리까지 다섯 가지 관점에서 두 접근법을 비교해본다.

> 이 글은 룬(`$state`, `$derived`)이 도입된 Svelte 5를 기준으로 한다.

# 1. 업데이트 방법: setter 함수 vs 직접 할당

React는 상태를 직접 변경할 수 없다. 반드시 setter 함수를 통해서만 업데이트해야 한다.

```jsx
// React
const [count, setCount] = useState(0);
setCount(count + 1); // setter 함수로만 변경 가능
count = 10; // ❌ 직접 할당해도 아무 일도 일어나지 않음
```

Svelte는 `$state`로 선언한 변수를 일반 변수처럼 직접 할당하면 된다.

```svelte
<!-- Svelte -->
<script>
  let count = $state(0);
  count += 1; // ✅ 직접 할당, 반응성 자동 유지
</script>
```

# 2. 리렌더링 범위: 컴포넌트 전체 vs 세밀한 부분 업데이트

React는 상태가 바뀌면 해당 컴포넌트 함수 전체를 다시 실행한다. Virtual DOM을 유지하면서 diffing 알고리즘으로 변경된 부분을 찾아 실제 DOM에 반영하는 방식이다. 물론 `React.memo`, `useMemo`, `useCallback` 등으로 리렌더 범위를 줄일 수 있지만, 이건 개발자가 직접 최적화해야 하는 영역이다.

```jsx
// React — 상태 하나가 바뀌면 컴포넌트 함수 전체 재실행
function Profile() {
  const [name, setName] = useState('길동');
  const [age, setAge] = useState(25);

  console.log('컴포넌트 전체 실행됨'); // name만 바꿔도 매번 출력

  return (
    <div>
      <p>{name}</p>
      <p>{age}</p>
    </div>
  );
}
```

Svelte는 컴파일 타임 코드 생성과 런타임 시그널 추적을 결합한다. 변경된 `$state`를 참조하는 DOM 부분만 정확히 업데이트한다. 컴포넌트 전체를 다시 실행하지 않기 때문에, 별도의 메모이제이션 없이도 기본적으로 세밀한 업데이트가 이뤄진다.

```svelte
<!-- Svelte — name이 바뀌면 name을 참조하는 DOM만 업데이트 -->
<script>
  let name = $state("길동");
  let age = $state(25);
</script>

<p>{name}</p>  <!-- name 변경 시 여기만 업데이트 -->
<p>{age}</p>   <!-- age가 안 바뀌었으므로 그대로 -->
```

참고로 Svelte는 이전 버전(Svelte 4)과도 메커니즘이 다르다. Svelte 4까지는 순수 컴파일 타임 접근이었다면, Svelte 5는 시그널(Signal) 기반 런타임을 도입해서 더 정교한 반응성 추적이 가능해졌다.

# 3. 파생 상태: 의존성 배열 수동 관리 vs 자동 추적

React에서 파생 상태를 만들려면 `useMemo`를 쓰고, 의존성 배열을 직접 관리해야 한다.

```jsx
// React
const [firstName, setFirstName] = useState('홍');
const [lastName, setLastName] = useState('길동');
const fullName = useMemo(() => `${firstName} ${lastName}`, [firstName, lastName]);
// 의존성 배열을 빠뜨리면 오래된 값이 그대로 남는 버그 발생
```

Svelte의 `$derived`는 내부에서 참조하는 반응형 변수를 자동으로 의존성으로 인식한다.

```svelte
<script>
  let firstName = $state("홍");
  let lastName = $state("길동");
  let fullName = $derived(`${firstName} ${lastName}`);
  // 의존성 배열이 필요 없음 — 참조하는 변수가 바뀌면 자동으로 재계산
</script>
```

의존성 배열 관리는 React 개발에서 흔한 버그의 원인이다. ESLint의 `exhaustive-deps` 규칙이 존재하는 것 자체가 이 문제의 빈도를 방증한다.

# 4. 상태 업데이트 타이밍: 다음 렌더 예약 vs 값 즉시 반영

React의 상태 업데이트는 비동기적으로 배치(batch) 처리된다. `setState`를 호출하면 "다음 렌더에서 이 값으로 바꿔라"고 예약하는 것이지, 즉시 반영되지 않는다. React 18부터는 automatic batching이 도입되어 이벤트 핸들러뿐 아니라 `setTimeout`, `Promise` 안에서도 자동 배치된다.

```jsx
// React
const [count, setCount] = useState(0);

function handleClick() {
  setCount(count + 1);
  console.log(count); // ❌ 여전히 0 — 업데이트는 다음 렌더에서 적용

  // 최신 값이 필요하면 별도 변수를 쓰거나 updater 함수 사용
  setCount(prev => prev + 1); // updater 함수로 최신 값 기반 업데이트
}
```

Svelte는 상태 값 업데이트와 DOM 반영을 분리한다. 값 자체는 할당 즉시 업데이트되고, DOM 반영은 현재 실행 중인 코드가 끝난 뒤 마이크로태스크로 배치 처리된다.

```svelte
<script>
  let count = $state(0);

  function handleClick() {
    count += 1;
    console.log(count); // ✅ 1 — 값은 즉시 반영됨
    // DOM 업데이트는 이 함수가 끝난 뒤 한 번에 처리
  }
</script>
```

React는 **값 업데이트 자체**가 비동기이고, Svelte는 **값은 동기적, DOM 반영만 비동기**다.

# 5. 객체/배열 상태 변경: 불변성 vs 직접 변경

React는 상태 비교에 `Object.is()`를 사용한다. 대부분의 경우 `===`와 동일하게 동작하지만, 핵심은 **참조 비교**라는 점이다. 객체 내부 값을 바꿔도 객체 자체의 참조가 그대로면 변경을 감지하지 못한다.

```jsx
// React
const [user, setUser] = useState({ name: '길동', role: 'frontend' });

// ❌ 직접 변경 — 참조가 같으므로 React가 변경을 감지하지 못함
user.role = 'fullstack';
setUser(user);

// ✅ spread로 새 객체를 만들어야 함
setUser({ ...user, role: 'fullstack' });

// 배열도 마찬가지
const [items, setItems] = useState([1, 2, 3]);
setItems([...items, 4]); // 새 배열 참조를 만들어야 함
```

Svelte는 `$state`로 선언한 객체/배열에 Proxy를 사용해서 깊은 반응성(deep reactivity)을 제공한다. 내부 속성을 직접 변경해도 변경이 추적된다.

```svelte
<script>
  let user = $state({ name: "길동", role: "frontend" });
  user.role = "fullstack"; // ✅ Proxy가 변경을 추적, 반응성 유지

  let items = $state([1, 2, 3]);
  items.push(4); // ✅ 배열 메서드도 그대로 사용 가능
</script>
```

React의 불변성 패턴은 예측 가능성과 디버깅에 유리하다는 장점이 있다. 반면 중첩이 깊은 객체에서는 spread가 장황해질 수 있어서 Immer 같은 라이브러리를 쓰기도 한다. Svelte의 Proxy 방식은 직관적이지만, Proxy 특유의 동작(예: 외부 라이브러리에 전달할 때 일반 객체와 다르게 동작할 수 있는 점)을 인지해야 한다.

# 한눈에 보는 비교

| 비교 항목     | React `useState`                           | Svelte `$state`                 |
| ------------- | ------------------------------------------ | ------------------------------- |
| 업데이트 방식 | setter 함수 (`setCount(1)`)                | 직접 할당 (`count = 1`)         |
| 리렌더링      | 컴포넌트 전체 재실행 + Virtual DOM diffing | 변경된 부분만 DOM 직접 업데이트 |
| 파생 상태     | `useMemo` + 의존성 배열 수동 관리          | `$derived` + 자동 의존성 추적   |
| 값 반영 시점  | 다음 렌더에서 반영 (비동기)                | 즉시 반영, DOM만 비동기         |
| 객체/배열     | 새 참조 필수 (불변성)                      | 직접 변경 가능 (Proxy 기반)     |
| 상태 비교     | `Object.is()` 참조 비교                    | Proxy + 시그널 기반 추적        |

# 결론

React의 `useState`는 **명시적이고 예측 가능한 상태 관리**를 추구한다. 모든 것이 함수 호출과 불변성 패턴으로 통제되고, 개발자가 최적화 지점을 직접 결정한다.

Svelte의 `$state`는 **자바스크립트 그 자체처럼 동작하는 상태**를 추구한다. 컴파일러와 런타임이 반응성을 알아서 처리해주고, 개발자는 일반 변수를 다루듯 코드를 작성한다.

React는 거대한 생태계와 검증된 패턴이 있고, Svelte는 적은 보일러플레이트와 직관적인 DX를 제공한다. 두 프레임워크의 상태 관리 철학을 이해하고 있으면, 어느 쪽을 쓰든 더 좋은 코드를 작성할 수 있다.
