# 1) node 이미지 다운로드
FROM node:14.18.1-alpine as react-build

# **리버스 프록시 서버를 호출할때는 도메인을 제외해야한다.
ENV REACT_APP_BASE_URL '/api'

# 2) 작업할 폴더 설정 == cd <이동할 경로>
WORKDIR "/usr/app"

# 3) package.json을 복사하고 의존성 설정
COPY ./package.json ./
RUN npm install
#RUN npm install react-scripts@4.0.3 -g --silent

# 4) 설치된 파일 복사(캐시 사용)
COPY . .

# 5) 빌드 
RUN npm run build

# TODO: 빌드된 파일을 nginx에 복사하는 방법을 사용한다.
# 때문에 react를 실행하지 않는다.
#CMD ["npm","run","start"]

## 중요! - nginx 빌드 ##
## build된 react 파일을 nginx에서 사용하기 위한 설정 ##
# 1) nginx 이미지 다운
#FROM nginx:latest
FROM nginx:alpine


# 2) 위에서 빌드된 react 파일을 nginx에 복사
COPY --from=react-build /usr/app/build  /usr/share/nginx/html
COPY --from=react-build /usr/app/build  /etc/nginx/html