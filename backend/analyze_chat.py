import sys
from phi.agent import Agent, RunResponse
from phi.model.google import Gemini
import json

agent = Agent(
    model=Gemini(id="gemini-1.5-flash", api_key="AIzaSyATdRBnR6SF7TGe_ZMnQtlMwJJ7vrbLZgY"),
    markdown=False,
    instructions="""
You are a JSON formatter for chatbot-customer conversations.

Extract the following:
- ticket_summary: a breakdown of customer requests and context
- sentiment: overall tone of the customer (positive, negative, neutral)
- ticket_type: category (e.g., integration_request, bug_report, billing_issue)
- is_resolved: true or false
- requires_email: true if email notification or follow-up is needed
- email_context: a short paragraph describing what the email should say
- flags: additional booleans (schedule_demo, needs_consultation, compliance_support_needed, follow_up_required)

Return only a JSON response.
"""
)

def kardo_json(s):
    try:
        return json.loads(s)
    except (json.JSONDecodeError, TypeError):
        return {"text": s}

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Error: Conversation not provided.", file=sys.stderr)
        sys.exit(1)

    conversation = sys.argv[1]
    result = agent.run(conversation)
    print(json.dumps(kardo_json(result.content)))
