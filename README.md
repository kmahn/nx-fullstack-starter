# NX Fullstack Starter

## 기본 설정
### 1. 패키지 설치

```shell
$ npm i
```
### 2. 개발/배포 환경에 따른 환경 변수 파일 작성

  프로젝트 루트 디렉토리의 .config/env/ 디렉터리 내에 환경 변수 파일 생성

|환경 변수 파일명|설명|
|---|---|
|.common.env|공통 환경 변수 파일|
|.production.env|배포 환경|
|.stage.env|스테이징 환경|
|.development.env|로컬 개발 환경|
|.test.env|테스트 환경|

설정해야 할 환경변수는 다음 파일을 참고
- [libs/backend/config/src/lib/validation-schema/index.ts](./libs/backend/config/src/lib/validation-schema/index.ts)

### 3. 실행

서버 실행

```shell
$ npm run serve:apps:backend
```

프론트엔드 실행
```shell
$ npm run serve:apps:frontend:web
```
