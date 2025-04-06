import sys
from phi.agent import Agent, RunResponse
from phi.model.google import Gemini

agent = Agent(
    model=Gemini(id="gemini-1.5-flash", api_key="AIzaSyD-LzirwWMvUYapypfIzwvKr13mYRNfYIY"),
    markdown=False,
    instructions="""
You are a JSON formatter for chatbot-customer conversations.

Extract the following:
- ticket_summary: a breakdown of customer requests and context
- sentiment: overall tone of the customer (positive, negative, neutral)
- ticket_type: category (e.g., integration_request, bug_report, billing_issue)
- is_resolved: true or false
- tasks: a list of specific actions that need to be taken to resolve the ticket
- task_assignment: the team or individual responsible for each task
- requires_email: true if email notification or follow-up is needed
- email_context: a short paragraph describing what the email should say
- flags: additional booleans (schedule_demo, needs_consultation, compliance_support_needed, follow_up_required)

Return only a JSON response.
"""
)

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Error: Conversation not provided.", file=sys.stderr)
        sys.exit(1)

    conversation = sys.argv[1]
    result = agent.run(conversation)
    print(result.content)
