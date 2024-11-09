# this image is built and updated weekly
# https://github.com/cse-labs/codespaces-images

FROM ghcr.io/cse-labs/k3d:latest

# some images require specific values
ARG USERNAME=vscode

# Proxies
ARG HTTP_PROXY
ARG HTTPS_PROXY
ARG NO_PROXY

# Log the docker build start event
RUN echo "$(date +'%Y-%m-%d %H:%M:%S')    docker build start" >> /home/${USERNAME}/status

# Set proxies
RUN if [ -n "$HTTP_PROXY" ]; then echo "Acquire::http::Proxy \"$HTTP_PROXY\";" > /etc/apt/apt.conf.d/proxy.conf; fi && \
    if [ -n "$HTTPS_PROXY" ]; then echo "Acquire::https::Proxy \"$HTTPS_PROXY\";" >> /etc/apt/apt.conf.d/proxy.conf; fi

# Add Neo4j GPG key and repository, then install packages
RUN curl -fsSL https://debian.neo4j.com/neotechnology.gpg.key | gpg --dearmor -o /usr/share/keyrings/neo4j.gpg && \
    echo "deb [signed-by=/usr/share/keyrings/neo4j.gpg] https://debian.neo4j.com stable 4.1" > /etc/apt/sources.list.d/neo4j.list && \
    apt-get update && \
    apt-get install -y --no-install-recommends \
        libnss-myhostname \
        neo4j \
        npm \
        nodejs \
        wget \
        bzip2 \
        ca-certificates \
        curl \
        vim\
        git \
        git-flow \
        postgresql-client && \
    rm -rf /var/lib/apt/lists/* && \
    chown -R ${USERNAME}:${USERNAME} /home/${USERNAME}

# Download and install Anaconda
RUN wget https://repo.anaconda.com/archive/Anaconda3-2024.06-1-Linux-x86_64.sh -O /tmp/anaconda.sh \
    && /bin/bash /tmp/anaconda.sh -b -p /opt/conda \
    && rm /tmp/anaconda.sh

ENV PATH /opt/conda/bin:$PATH

# Log the docker build complete event
RUN echo "$(date +'%Y-%m-%d %H:%M:%S')    docker build complete" >> /home/${USERNAME}/status
