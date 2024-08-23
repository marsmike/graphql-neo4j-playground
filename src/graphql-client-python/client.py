#!/usr/bin/env python3
import asyncio
import json
import os
from pprint import pprint

import requests
import websockets

# Define the HTTP query
http_query = """
query Movies {
  movies {
    title
  }
}
"""

# Define the GraphQL subscription query
subscription_query = """
subscription {
  movieCreated {
    title
  }
}
"""

auth_token = os.getenv(
    "AUTH_TOKEN",
    "defaultAuthToken",
)


def run_http_query():
    url = "http://localhost:8081/"
    headers = {
        "Authorization": f"Bearer {auth_token}",
    }
    print("HTTP Query to server: " + url)
    response = requests.post(url, json={"query": http_query}, headers=headers)
    print("HTTP Query Response:")
    pprint(response.json())

    url = "http://localhost:8082/"
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {auth_token}",
    }
    print("HTTP Query to server: " + url)
    response = requests.post(url, json={"query": http_query}, headers=headers)
    print("HTTP Query Response:")
    pprint(response.json())


async def subscribe_to_movie_creation():
    url = "ws://localhost:8081/ws"  # Use the websocket port

    async with websockets.connect(url, subprotocols=["graphql-ws"]) as websocket:
        print(f"Connected to {url}")

        await websocket.send(
            json.dumps(
                {
                    "type": "connection_init",
                    "payload": {"authToken": auth_token},
                }
            )
        )
        print("Sent connection_init with authToken")

        # Wait for connection_ack
        response = await websocket.recv()
        print(f"Received: {response}")

        # Send the subscription query
        await websocket.send(
            json.dumps(
                {
                    "id": "1",
                    "type": "start",
                    "payload": {"query": subscription_query, "variables": {}},
                }
            )
        )
        print("Sent subscription query")

        # Listen for messages from the server
        while True:
            response = await websocket.recv()
            print(f"Received: {response}")

            # Parse the response
            data = json.loads(response)
            if data.get("type") == "data":
                payload = data.get("payload", {})
                movie = payload.get("data", {}).get("movieCreated", {})
                print("Movie Created:")
                print(f"Title: {movie.get('id')}")
            elif data.get("type") == "complete":
                print("Subscription complete")
                break


async def main():
    # First, run the 2 HTTP queries
    run_http_query()

    # Then, start the WebSocket subscription
    while True:
        try:
            await subscribe_to_movie_creation()
        except Exception as e:
            print(f"Error: {e}")
            print("Reconnecting in 50 seconds...")
            await asyncio.sleep(50)


if __name__ == "__main__":
    asyncio.run(main())
