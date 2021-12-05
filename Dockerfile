# alpine 버전있어야 우분투 명령어 에러발생하지 않음 ex) apk: not found
# alpine 버전은 클라우드를 고려한 가벼운 이미지
FROM node:14.18.1-alpine

# 작업 폴더를 만들고 npm 설치
WORKDIR /src

# `/app/node_modules/.bin`을 $PATH 에 추가
ENV PATH /app/node_modules/.bin:$PATH
COPY package.json /src/package.json

#RUN npm install --no-cache
RUN npm install
RUN npm install react-scripts@4.0.3 -g --silent

# alpine 버전 리눅스의 apt같은 패키지 매니저
# RUN apk add --no-cache git

# 현 경로 모든 파일을 작업 폴더 /src로 복사
COPY . /src
RUN npm run build

# 빌드 완료 후 실행할 cmd 명령
CMD ["npm", "start"]