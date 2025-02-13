import os
from flask import Flask, request, jsonify, render_template
from openai import OpenAI

app = Flask(__name__)

client = OpenAI(
    base_url="https://models.inference.ai.azure.com",
    api_key=os.getenv("GITHUB_TOKEN")  # Store API key in an environment variable
)

@app.route("/")
def index():
    return render_template("index.html")  # Serve the frontend HTML

@app.route("/generate", methods=["POST"])
def generate():
    data = request.json
    user_input = data.get("user_input", "")

    response = client.chat.completions.create(
        messages=[
            {"role": "system", "content": ""},
            {"role": "user", "content": user_input}
        ],
        model="gpt-4o",
        temperature=1,
        max_tokens=4096,
        top_p=1
    )

    return jsonify({"response": response.choices[0].message.content})

if __name__ == "__main__":
    app.run(debug=True)