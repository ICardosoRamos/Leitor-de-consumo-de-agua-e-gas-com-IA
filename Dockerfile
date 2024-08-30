FROM node:22


ENV HOME /usr/app
ENV BACKEND_HOME ${HOME}/backend

RUN mkdir -p ${HOME}
RUN groupadd -r user && \
    useradd -r -g user -d ${HOME} -s /sbin/nologin -c "Docker image user" user

RUN mkdir ${BACKEND_HOME}

WORKDIR ${BACKEND_HOME}

COPY package*.json ./
RUN npm install -f

COPY . .

RUN chown -R user:user /usr/app

COPY entrypoint.sh /usr/app/backend/entrypoint.sh
COPY wait-for-it.sh /usr/app/backend/wait-for-it.sh

RUN chmod +x /usr/app/backend/entrypoint.sh
RUN chmod +x /usr/app/backend/wait-for-it.sh

CMD ["npm", "run", "dev"]
