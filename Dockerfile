# alpine 버전있어야 우분투 명령어 에러발생하지 않음 ex) apk: not found
# alpine 버전은 클라우드를 고려한 가벼운 이미지
FROM node:14.18.1-alpine as react-build

# 작업 폴더를 만들고 npm 설치
WORKDIR "/app"

# `/app/node_modules/.bin`을 $PATH 에 추가
#ENV PATH /app/node_modules/.bin:$PATH

COPY ./package.json ./
COPY . ./

RUN npm install
#RUN npm install react-scripts@4.0.3 -g --silent
RUN npm run build

CMD ["npm","run","start"]

## 중요! - nginx 빌드 ##
# build된 react 파일을 nginx에서 사용하기 위한 설정
FROM nginx:latest

# 위에서 빌드된 파일들 nginx에 복사
COPY --from=react-build /app/build  /usr/share/nginx/html
COPY --from=react-build /app/build  /etc/nginx/html