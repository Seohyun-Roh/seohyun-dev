---
title: 'Stacked PR이 뭔데? Graphite 쓰던 사람이 보는 GitHub Stacked PRs'
date: '2026-05-06'
category: 'DevOps'
summary: 'Stacked PR의 개념, Graphite의 워크플로우, 그리고 GitHub이 새로 내놓은 native stacked PR 기능까지'
---

큰 변경사항을 PR 하나에 몰아넣었다가 리뷰가 며칠씩 걸리는 경험, 한 번쯤 해봤을 것이다. 1,000줄짜리 PR을 받아든 리뷰어는 어디부터 봐야 할지 막막하고, 작성자는 머지될 때까지 다음 작업을 시작하지 못한 채 충돌만 계속 해결해야 한다. 이런 문제를 해결하기 위해 Meta, Google 같은 회사들이 오래 전부터 써온 워크플로가 **stacked PR**이다.

나는 그동안 [Graphite](https://graphite.com/)를 써서 stacked PR 워크플로를 유지해왔는데, 최근 GitHub이 [Stacked PRs](https://github.github.com/gh-stack/) 기능을 private preview로 공개했다. 이 글에서는 stacked PR의 개념을 정리하고, Graphite와 GitHub Stacked PRs를 비교해본다.

# Stacked PR이란?

Stacked PR은 큰 변경을 여러 개의 작은 PR로 나누고, 각 PR이 자기 아래 PR의 브랜치를 base로 삼는 워크플로다. 일렬로 쌓인(stacked) 모양이라 이렇게 부른다.

```
PR #3: frontend       (base: api-endpoints)
PR #2: api-endpoints  (base: auth-layer)
PR #1: auth-layer     (base: main)
                ↓
              main (trunk)
```

각 PR은 자기 바로 아래 레이어와의 diff만 보여주기 때문에, 리뷰어는 한 번에 하나의 관심사에만 집중할 수 있다.

## 왜 굳이 쪼개는가

가장 자주 인용되는 통계 하나. **200~400줄 사이의 PR은 큰 PR보다 결함이 40% 적고, 승인되는 속도는 3배 빠르다**.

쪼개는 것 자체의 장점은 명확하다.

- **PR이 atomic해진다.** 리뷰어가 한 PR에서 한 가지 변경만 평가하면 된다. 인증 레이어 PR을 보면서 동시에 프론트엔드 UI까지 신경 쓰지 않아도 된다.
- **리뷰가 빠르게 돈다.** 작은 단위로 머지되니까 빠르게 움직이는 팀에 유리하다. 특히 trunk-based development와 잘 맞는다.
- **작성자가 블로킹되지 않는다.** PR #1이 리뷰 중일 때, PR #2를 그 위에 쌓아서 작업을 계속 이어갈 수 있다.
- **충돌 표면적이 줄어든다.** 작은 PR들은 main과 충돌이 적고, 충돌이 나도 어느 레이어에서 났는지 빠르게 찾을 수 있다.

## 그런데 왜 도구가 필요할까

이론은 좋은데, 막상 손으로 해보면 금방 깨닫는다. **stacked PR 워크플로의 진짜 비용은 리베이스 관리에 있다.**

PR #1이 리뷰 후 변경되면 PR #2의 base가 어긋나고, 그 위의 PR #3까지 줄줄이 영향을 받는다. PR #1이 머지되면 그 아래에 있던 모든 PR을 새로운 main 기준으로 다시 리베이스해야 한다. 손으로 하면 매번 `git rebase --onto`를 외워야 하고, 한 번 꼬이면 풀기 까다롭다.

Graphite, gh-stack 같은 도구들이 해결하는 게 정확히 이 부분이다. **cascading rebase를 한 번의 명령으로 처리하는 것**이 stacked PR 도구의 본질적인 가치다.

# Graphite: 지금까지 내가 쓰던 방식

Graphite는 Meta의 stacked diff 워크플로(Phabricator)에서 영감을 받아 만들어진 stacked PR 플랫폼이다. 공동 창업자 중 한 명(Tomas Reimers)이 ex-Meta 엔지니어다. CLI(`gt`), VS Code 익스텐션, 자체 웹 대시보드를 함께 제공한다.

내가 주로 쓰던 흐름은 이랬다.

```bash
gt create "feat: add auth layer"   # 새 브랜치 생성 + 스테이징 + 커밋
gt create "feat: api endpoints"    # 그 위에 또 쌓기
gt ss                              # 스택 전체를 GitHub에 push + PR 생성
gt sync                            # main 최신화 + 머지된 브랜치 정리 + 자동 restack
```

`gt`는 git passthrough를 지원해서 평소 쓰던 git 명령어를 그대로 쓰면서 스택 전용 명령만 추가로 쓰는 식이다. 자주 쓰던 명령어를 정리하면 이렇다.

| 명령어              | 하는 일                                                                   |
| ------------------- | ------------------------------------------------------------------------- |
| `gt create -am ...` | 새 브랜치 + 스테이징된 변경 커밋. **PR은 만들지 않음**                    |
| `gt modify`         | 현재 브랜치 커밋을 amend하거나 새 커밋 추가. 위 스택은 자동 restack       |
| `gt ss`             | `gt submit --stack`의 alias. 스택 전체 force-push + PR 생성/업데이트      |
| `gt sync`           | 트렁크 최신화, 머지된 브랜치 삭제, 가능한 경우 자동 restack               |
| `gt get <브랜치>`   | 리모트에서 특정 브랜치(와 그 위 스택)를 로컬로 가져오기                   |
| `gt checkout`       | 인자 있으면 해당 브랜치로, 없으면 방향키로 고를 수 있는 인터랙티브 선택기 |
| `gt move`           | 현재 브랜치를 타겟 위로 rebase + 자손도 함께 restack. 스택 간 이동에 유용 |
| `gt log short`      | 트래킹 중인 브랜치 / 스택 구조를 컴팩트하게 표시 (alias `gt ls`)          |
| `gt log long`       | 모든 브랜치의 커밋 그래프 표시 (alias `gt ll`)                            |

또 하나의 Graphite 장점은 **대시보드**에 있다고 느꼈다.

- **PR Inbox**: 이메일 클라이언트처럼 동작하는 통합 리뷰 워크플로. 내 리뷰 차례인 PR, 응답이 필요한 코멘트가 있는 PR이 한곳에 모인다.
- **Insights**: PR 사이클 타임, 리뷰 시간 등 워크플로 KPI를 그래프로 보여주는 분석 대시보드.
- **Stack-aware merge queue**: 스택을 순서대로 안전하게 머지해주고, CI를 의존성에 따라 똑똑하게 돌려준다.
- **Graphite Chat**: PR 페이지에 붙은 AI 어시스턴트. CI 실패 분석이나 수정 제안을 해준다.

다 좋은데, 한 가지 본질적인 한계가 있었다. **PR을 올리는 곳은 GitHub이고, 스택을 관리하는 곳은 Graphite**라는 점이다. 어느 PR이 어느 스택에 속해 있는지 GitHub UI에서는 알 수 없어서, 항상 Graphite 대시보드나 CLI(`gt log`)로 따로 확인해야 했다.

# GitHub Stacked PRs: 네이티브로 들어온 stacked PR

2026년 4월 13일, GitHub이 [Stacked PRs](https://github.github.com/gh-stack/)를 private preview로 공개했다. 핵심은 두 가지다.

1. `gh stack`이라는 [공식 CLI 익스텐션](https://github.com/github/gh-stack)
2. **GitHub PR UI 안에 그려지는 stack map**

지금은 waitlist를 통해 활성화된 레포에서만 동작하지만, 일단 켜지면 GitHub UI에서 직접 스택을 만들고 탐색하고 머지할 수 있다.

## CLI: `gh stack`

명령어 구성은 Graphite와 비슷하다. 익숙하다면 마이그레이션 비용이 크지 않을 것 같다.

```bash
gh stack init           # 스택 시작
gh stack add            # 새 레이어 추가
gh stack submit         # 브랜치 push + 연결된 PR 생성
gh stack sync           # fetch + cascading rebase + push + PR 상태 동기화
gh stack up / down      # 레이어 사이 이동
gh stack modify         # 인터랙티브하게 스택 재구성
gh stack view           # 스택 상태 출력
```

이름만 보면 거의 일대일 대응이다. `gt sync`가 `gh stack sync`로, `gt log`가 `gh stack view`로 바뀌는 정도.

## 진짜 차이는 GitHub UI 안에 있다

CLI 명령어는 비슷한데, 결정적인 차이는 **stack map이 GitHub PR 페이지 안에 그려진다**는 점이다.

- 리뷰어는 PR을 열면 그게 어떤 스택에 속해 있는지 바로 보인다.
- 스택 안에서 위/아래 레이어로 이동하는 게 PR UI에서 직접 가능하다.
- 별도 계정이나 익스텐션 없이도 모든 리뷰어가 스택 구조를 본다.

이게 third-party 도구로는 절대 흉내 낼 수 없는 부분이다. Graphite를 쓰면서 항상 답답했던 "왜 PR 페이지 자체에는 스택 정보가 없지" 문제가 그냥 사라진다.

## 한 번에 머지

`gh stack` 환경에서는 여러 PR을 한 번에 선택해서 머지할 수 있고, 머지 후에 남은 PR들이 자동으로 새로운 base에 리베이스된다. CLI에서 한 번 더 sync를 돌리는 단계가 빠지는 셈이다.

## Branch protection의 동작이 다르다

이건 작은 차이처럼 보이지만 실제로는 꽤 중요한 부분이다. GitHub Stacked PRs에서는 **branch protection 규칙이 각 PR의 직접 base가 아니라 최종 target 브랜치(보통 main)를 기준으로 적용된다**. 스택 중간 레이어에 일부러 약한 규칙을 두지 않아도 되고, 최종적으로 main에 들어가는 변경 전체에 대해 일관된 보호 규칙이 걸린다.

Graphite는 GitHub의 branch protection 위에서 동작하는 third-party이기 때문에, 이런 동작을 자체적으로 바꿀 수 없다. 스택 중간 브랜치에도 protection이 그대로 걸려서 우회 설정을 해야 하는 경우가 있었다.

## CLI는 옵션이다

GitHub Stacked PRs의 또 한 가지 특징은, **CLI 없이도 UI나 API만으로 스택을 만들 수 있다**는 점이다. 표준 git 워크플로 + GitHub UI 조합만으로도 스택을 운영할 수 있게 설계됐다.

# 한눈에 보는 비교

| 항목              | Graphite                                 | GitHub Stacked PRs                 |
| ----------------- | ---------------------------------------- | ---------------------------------- |
| 종류              | Third-party 플랫폼                       | GitHub 네이티브 기능               |
| 상태              | 정식 출시                                | Private preview (2026.04~)         |
| Stack map 위치    | Graphite 대시보드                        | GitHub PR UI 안                    |
| CLI               | `gt` (필수에 가까움)                     | `gh stack` (옵션)                  |
| Branch protection | GitHub 규칙을 그대로 따름                | 최종 target 브랜치 기준으로 평가   |
| 리뷰어 진입 비용  | Graphite 계정/익스텐션 권장              | 없음 (GitHub 계정만 있으면 됨)     |
| 부가 기능         | PR Inbox, Insights, AI 챗 등 풍부        | 스택 관리에 집중                   |
| 가격              | Hobby 무료, Starter $20·Team $40/user/월 | GitHub 요금제에 포함 (별도 비용 X) |

# 그래서 갈아탈 거냐

아직은 모르겠다. 지금 정리할 수 있는 건 이 정도다.

- **GitHub Stacked PRs를 기다릴 가치가 큰 경우**: 팀 전체에 stacked PR 워크플로를 정착시키고 싶은데 third-party 도구 도입에 마찰이 있는 팀, 또는 리뷰어 경험을 가장 중요하게 생각하는 팀. UI 안에 stack map이 있다는 것 하나만으로도 학습 곡선이 크게 낮아진다.
- **Graphite를 계속 쓸 만한 경우**: PR Inbox나 Insights 같은 부가 기능을 이미 워크플로에 깊게 녹여둔 경우, 또는 stack-aware merge queue 같은 고급 기능이 필요한 경우. GitHub Stacked PRs는 일단 "스택 관리 자체"에 집중한 기능이라, 주변 도구는 아직 Graphite가 더 풍부하다.

개인적으로는 GitHub Stacked PRs가 정식 GA 되는 시점에 한 번 갈아타볼 생각이다. 일단 PR 페이지에서 스택이 직접 보인다는 게 너무 매력적으로 느껴진다.

그러나 뭘 쓰든 결국 핵심은 같다. **PR을 작게 쪼개라**. 도구는 그걸 덜 아프게 만들어줄 뿐이다.
