from azure.ai.projects import AIProjectClient
from azure.identity import DefaultAzureCredential

project_client = AIProjectClient.from_connection_string(
    credential=DefaultAzureCredential(),
    conn_str="eastus2.api.azureml.ms;24de4c21-ccec-4758-b7f6-8a0b9cb9db98;Machinelearning1;harishproject1")

agent = project_client.agents.get_agent("asst_I7sjoxWLlqHRcDaUaMU1y8VH")

thread = project_client.agents.get_thread("thread_qXcksZc9JUsmnxs5qiTweDgM")

message = project_client.agents.create_message(
    thread_id=thread.id,
    role="user",
    content="Hello Agent"
)

run = project_client.agents.create_and_process_run(
    thread_id=thread.id,
    agent_id=agent.id)
messages = project_client.agents.list_messages(thread_id=thread.id)

for text_message in messages.text_messages:
    print(text_message.as_dict())