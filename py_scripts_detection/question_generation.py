import openai
import json

# Load the OpenAI API Key
OPENAI_API_KEY = ''
openai.api_key = OPENAI_API_KEY

# Function to get response from OpenAI
def get_response(prompt, context):
    response = openai.Completion.create(
        engine="davinci",
        prompt=f"{context}\nQuestion: {prompt}\nAnswer:",
        max_tokens=50
    )
    return response.choices[0].text.strip()

# Load the JSON file as context
def load_json(filename):
    with open(filename, 'r') as f:
        return json.load(f)

def main():
    filename = "output.json"
    context = json.dumps(load_json(filename), indent=4)
    while True:
        question = input("Ask your question (or type 'exit' to quit): ")
        if question.lower() == 'exit':
            break
        response = get_response(question, context)
        print(f"Answer: {response}")

if __name__ == "__main__":
    main()
