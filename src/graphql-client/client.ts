import axios from 'axios';
import { WebSocket } from 'ws';

// Todo: Load from ENV var
const AUTH_TOKEN = 'defaultAuthToken';

const httpQuery = `
query {
  movies {
    title
    actors {
      name
    }
  }
}
`;

const subscriptionQuery = `
subscription {
  movieCreated {
    title
    actors {
      name
    }
  }
}
`;

const runHttpQuery = async () => {
  const url = 'http://localhost:8081/';
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${AUTH_TOKEN}`,
  };

  try {
    const response = await axios.post(url, { query: httpQuery }, { headers });
    console.log('HTTP Query Response:');
    console.log(JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error('Error running HTTP query:', error);
  }
};

const subscribeToEngineeringArtifactCreation = async () => {
  const url = 'ws://localhost:8081/ws';
  const ws = new WebSocket(url, ['graphql-ws']);

  ws.on('open', () => {
    console.log(`Connected to ${url}`);

    // Send connection_init message with the auth token
    ws.send(
      JSON.stringify({
        type: 'connection_init',
        payload: { authToken: AUTH_TOKEN },
      })
    );
    console.log('Sent connection_init with authToken');

    // Send subscription query
    ws.send(
      JSON.stringify({
        id: '1',
        type: 'start',
        payload: { query: subscriptionQuery, variables: {} },
      })
    );
    console.log('Sent subscription query');
  });

  ws.on('message', (data) => {
    const response = JSON.parse(data.toString());
    console.log(`Received: ${data}`);

    if (response.type === 'data') {
      const engineeringArtifact = response.payload.data.engineeringArtifactCreated;
      console.log('Engineering Artifact Created:');
      console.log(`ID: ${engineeringArtifact.id}`);
      console.log(`Name: ${engineeringArtifact.name}`);
      console.log(`Location: ${engineeringArtifact.location}`);
    } else if (response.type === 'complete') {
      console.log('Subscription complete');
      ws.close();
    }
  });

  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });

  ws.on('close', () => {
    console.log('WebSocket connection closed. Reconnecting in 5 seconds...');
    setTimeout(subscribeToEngineeringArtifactCreation, 5000);
  });
};

const main = async () => {
  await runHttpQuery();
  subscribeToEngineeringArtifactCreation();
};

main().catch((error) => {
  console.error('Error in main execution:', error);
});
