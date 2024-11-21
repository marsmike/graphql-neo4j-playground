import asyncio
import json
import os

from dotenv import load_dotenv
from neo4j import GraphDatabase
from neo4j_graphrag.embeddings import OpenAIEmbeddings
from neo4j_graphrag.experimental.pipeline.kg_builder import SimpleKGPipeline
from neo4j_graphrag.llm.openai_llm import OpenAILLM

# Load environment variables
load_dotenv()

NEO4J_CONNECTION_URL = os.getenv("NEO4J_CONNECTION_URL", "neo4j://localhost:7687")
NEO4J_USER = os.getenv("NEO4J_USER", "neo4j")
NEO4J_PASSWORD = os.getenv("NEO4J_PASSWORD", "password")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

# Connect to Neo4j
driver = GraphDatabase.driver(NEO4J_CONNECTION_URL, auth=(NEO4J_USER, NEO4J_PASSWORD))

# Load unaligned data from JSON files
with open("jira_tickets.json", "r") as jira_file:
    jira_tickets = json.load(jira_file)

with open("requirements.json", "r") as req_file:
    requirements = json.load(req_file)

# Define entities and relations
entities = ["JIRA_Ticket", "Requirement"]
relations = ["RELATES_TO", "BLOCKS", "DEPENDS_ON"]

# Create embedder and LLM objects
embedder = OpenAIEmbeddings(model="text-embedding-3-large", api_key=OPENAI_API_KEY)
llm = OpenAILLM(
    model_name="gpt-4o",
    model_params={
        "max_tokens": 2000,
        "response_format": {"type": "json_object"},
        "temperature": 0,
    },
)

# Instantiate the knowledge graph builder
kg_builder = SimpleKGPipeline(
    llm=llm,
    driver=driver,
    embedder=embedder,
    entities=entities,
    relations=relations,
    on_error="IGNORE",
    from_pdf=False,
)


# Process unaligned data dynamically
async def process_unaligned_data():
    for jira in jira_tickets:
        for req in requirements:
            # Combine ticket and requirement text
            text = (
                f"JIRA Ticket: {jira['summary']} - {jira['description']} "
                f"Requirement: {req['title']} - {req['description']}"
            )
            print(f"Processing: {jira['key']} <-> {req['id']}")
            await kg_builder.run_async(text=text)


# Run the pipeline and close the driver
asyncio.run(process_unaligned_data())
driver.close()
