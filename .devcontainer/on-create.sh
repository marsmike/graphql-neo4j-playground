#!/bin/bash

echo "on-create start"
echo "$(date +'%Y-%m-%d %H:%M:%S')    on-create start" >> "$HOME/status"

sudo chown vscode:vscode /home/vscode/.docker
sudo chmod 777 /workspaces
mkdir -p "$HOME/.ssh"

# Update k3d
curl -s https://raw.githubusercontent.com/rancher/k3d/main/install.sh | bash

export REPO_BASE=$PWD
export PATH="$PATH:$REPO_BASE/cli"

docker pull docker.io/library/registry:2

# needed for DOCKER REGISTRY Credentials
echo Sourcing env variables from .env ...
source "$REPO_BASE/.env"

# create local registry
k3d registry create registry.localhost --port 5500
k3d cluster create \
  --registry-use k3d-registry.localhost:5500 \
  --config .devcontainer/k3d.yaml

echo "deploying Kubernetes basics..."
kic cluster deploy

echo "deploying Kubernetes services..."
cd $REPO_BASE && ./00-deploy-all.sh

# install oh-my-zsh & plugins
echo "Installing oh-my-zsh..."
wget https://github.com/robbyrussell/oh-my-zsh/raw/master/tools/install.sh -O - | zsh || true
zsh -c 'git clone https://github.com/zsh-users/zsh-autosuggestions ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-autosuggestions'
zsh -c 'git clone https://github.com/zsh-users/zsh-syntax-highlighting.git ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-syntax-highlighting'

echo "Updating oh-my-zsh..."
/home/vscode/.oh-my-zsh/tools/upgrade.sh

# set zsh theme
sed -i '/^ZSH_THEME/c\ZSH_THEME="agnoster"' $HOME/.zshrc 

# Override prompt_context to remove hostname and username from prompt
echo 'prompt_context() { }' >> "$HOME/.zshrc"
echo "prompt_dir() { prompt_segment blue $CURRENT_FG '%2~' }"

{
    # add kic cli to path
    echo ""
    echo "export PATH=\$PATH:$REPO_BASE/cli"
    echo "export REPO_BASE=$REPO_BASE"
    echo "compinit"
    echo ""
} >> "$HOME/.zshrc"

echo "generating zsh completions..."
kic completion zsh > "$HOME/.oh-my-zsh/completions/_kic"
kubectl completion zsh > "$HOME/.oh-my-zsh/completions/_kubectl"

# init anaconda for zsh
conda init zsh
conda config --set changeps1 False

# create anaconda environment for master-flow
conda create -y -n playground python=3.11

# activate anaconda environment on login
{
    echo ""
    echo "conda activate playground"
} >> "$HOME/.zshrc"


echo "on-create complete"
echo "$(date +'%Y-%m-%d %H:%M:%S')    on-create complete" >> "$HOME/status"
