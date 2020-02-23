FROM mcr.microsoft.com/dotnet/core/runtime:3.0-bionic

ENV GH_RUNNER_VERSION "2.165.2"

RUN apt-get update && apt-get install -y curl sudo openjdk-11-jdk

RUN useradd github \
	&& echo "github ALL=(ALL) NOPASSWD: ALL" >> /etc/sudoers \
	&& usermod -aG sudo github \
	&& mkdir /usr/actions-runner

RUN cd /usr/actions-runner \
    && curl -O -L https://github.com/actions/runner/releases/download/v${GH_RUNNER_VERSION}/actions-runner-linux-x64-${GH_RUNNER_VERSION}.tar.gz \
    && tar xzf ./actions-runner-linux-x64-${GH_RUNNER_VERSION}.tar.gz \
    && rm actions-runner-linux-x64-${GH_RUNNER_VERSION}.tar.gz

RUN chown -R github:github /usr/actions-runner

USER github

ENV JAVA_HOME "/usr/lib/jvm/java-11-openjdk-amd64"
ARG GH_TOKEN

RUN cd /usr/actions-runner \
    && ./config.sh --url https://github.com/paslavsky/java-microservices --token ${GH_TOKEN}

ENTRYPOINT ["/usr/actions-runner/run.sh"]
