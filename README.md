
# graphql-neo4j-playground

**A demonstration of running a GraphQL API on top of a Neo4J Graph Database, fully containerized using k3d on Kubernetes. This setup includes additional monitoring and observability tools like Prometheus and Grafana.**

Inspired by this fascinating project: [kubernetes-in-codespaces](https://github.com/cse-labs/kubernetes-in-codespaces)

---

## Features

- Deploy a local Kubernetes cluster using k3d.
- Provision Neo4J Community Edition within the cluster.
- Create a GraphQL API connected to the Neo4J graph database.
- Built-in observability stack with Prometheus and Grafana.

---

## Getting Started

### Prerequisites

Ensure you have the following installed and configured on your machine:

- [Docker](https://docs.docker.com/get-docker/) (required for containerization).
- A valid `.gitconfig` and `.git-credentials` in your home directory.
- A valid `.docker/config.json` file in your home directory (`docker login` creates one).
- Create a `.env` file based on the provided example:

  ```bash
  cp env.example .env
  # Adjust the values in the .env file as needed
  ```

### Setup with VSCode

1. Open VSCode and load the project.
2. Use the VSCode Remote Container extension to open the project in a container.
3. Choose the appropriate configuration:
    - `no-proxy`: For environments without proxy requirements.
    - `behind-proxy`: For corporate environments with proxy settings (update `.devcontainer/behind-proxy/devcontainer.json` accordingly).

4. The container will be built and provisioned with:
    - A local single-node k3d Kubernetes Cluster.
    - Neo4J Database.
    - GraphQL API.
    - Additional services like Prometheus and Grafana.

5. Monitor the progress via the VSCode Terminal.

### Working Inside the Container

1. Open a `zsh` terminal in VSCode to take advantage of pre-configured tools like OhMyZsh and Anaconda (for Python development).
2. Run `k9s` to inspect the Kubernetes cluster.
3. Run `kic` to see available management commands.

---

## Accessing Services

Once the setup is complete, forward the necessary ports by running:

```bash
./01-port-forwarding.sh
```

Now, the following services will be accessible on your development machine:

- **Neo4J Browser**: [http://localhost:7474](http://localhost:7474)
- **GraphQL Express API**: [http://localhost:8081](http://localhost:8081)
- **GraphQL Standalone Server**: [http://localhost:8082](http://localhost:8082)

You can find additional services like Grafana and Prometheus in the VSCode Ports tab.

---

## Usage

### Step 1: Explore the Neo4J Database

- Open the Neo4J Browser at [http://localhost:7474](http://localhost:7474).
- Log in with the following credentials:
  - **Username**: `neo4j`
  - **Password**: `12345678`
  
- Navigate to the "Examples" tab and import the Movie Graph.

### Step 2: Query the GraphQL API (UI)

- Open the Apollo Server UI at [http://localhost:8082](http://localhost:8082).
- Run the following GraphQL query to retrieve all movie titles:

  ```graphql
  query Movies {
    movies {
      title
    }
  }
  ```

### Step 3: Query the GraphQL API (Python)

- Open a new terminal in VSCode.
- Go to `src/graphql-client-python` and run the following command:

  ```bash
  pip install -r requirements.txt
  python3 ./client.py
  ```

This demonstrates how basic HTTP queries to the GraphQL API can be made using Python.
And how the subscriptions with WebSockets are NOT working.

### Step 4: Query the GraphQL API (Typescript)

- Open a new terminal in VSCode.
- Go to `src/graphql-client` and run the following command:

  ```bash
  ./setup.sh (run each command individually, not working currently)
  ./run.sh
  ```

This demonstrates how basic HTTP queries to the GraphQL API can be made using Typescript.
And how the subscriptions with WebSockets are also NOT working.

---

## Advanced Tips

### Redeploy GraphQL Server

To rebuild and redeploy the GraphQL server, run:

```bash
kic local graphql
```

### Redeploy Neo4J Database

To rebuild and redeploy the Neo4J database, run:

```bash
kic local neo4j
```

---

## Contributing

Contributions are welcome! Please fork this repository, create a feature branch, and submit a pull request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
