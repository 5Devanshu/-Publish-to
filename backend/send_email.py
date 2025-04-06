import sys
from phi.agent import Agent
from phi.tools.resend_tools import ResendTools
from phi.model.google import Gemini

def send_email_with_phi(subject, html_body):
    from_email = "JashKiChaddi <support@teamtarang.co.in>"
    to_email = "jashbarot05@gmail.com"

    agent = Agent(
        model=Gemini(id="gemini-1.5-flash", api_key="AIzaSyD-LzirwWMvUYapypfIzwvKr13mYRNfYIY"),
        tools=[
            ResendTools(
                from_email=from_email,
                api_key="re_QP6FBpVd_NnsicKctGXN7GmpEwnW9YXby"
            )
        ],
        show_tool_calls=True,
        markdown=False
    )

    prompt = f"""
Send an HTML email to {to_email} with the following details:
- Subject: {subject}
- HTML Body: {html_body}
Use HTML tags to format the message beautifully.
"""
    response = agent.run(prompt)
    print(response.content)

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Error: Subject and HTML body required.", file=sys.stderr)
        sys.exit(1)

    subject = sys.argv[1]
    html_body = sys.argv[2]
    send_email_with_phi(subject, html_body)
