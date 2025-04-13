<<<<<<< HEAD
import os
from flask import Flask, request, jsonify, render_template
from openai import OpenAI
from flask_cors import CORS
import traceback

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

client = OpenAI(
    base_url="https://models.inference.ai.azure.com",
    api_key=os.getenv("GITHUB_TOKEN")  # Store API key in an environment variable
)

@app.route("/")
def index():
    return render_template("index.html")  # Serve the frontend HTML

@app.route("/generate", methods=["POST"])
def generate():
    try:
        data = request.json
        user_input = data.get("user_input", "")
        conversation_history = data.get("conversation_history", [])

        if not user_input:
            return jsonify({"error": "No input provided"}), 400

        # Format conversation history for OpenAI
        messages = []
        for msg in conversation_history:
            messages.append({
                "role": msg.get("role", "user"),
                "content": msg.get("content", "")
            })
        
        # Add the current user input
        messages.append({"role": "user", "content": user_input})

        # Add retry logic
        max_retries = 3
        retry_count = 0
        last_error = None

        while retry_count < max_retries:
            try:
                response = client.chat.completions.create(
                    messages=messages,
                    model="gpt-4o",
                    temperature=0.7,
                    max_tokens=1000,
                    top_p=1
                )
                return jsonify({"response": response.choices[0].message.content})
            except Exception as e:
                last_error = str(e)
                retry_count += 1
                if retry_count == max_retries:
                    raise Exception(f"Failed after {max_retries} attempts. Last error: {last_error}")

    except Exception as e:
        print(f"Error: {str(e)}")
        print(traceback.format_exc())
        return jsonify({
            "error": "An error occurred while processing your request",
            "details": str(e)
        }), 500

if __name__ == "__main__":
=======
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
>>>>>>> 664438bee1db649c97cad6b00972d948ab838e25
    app.run(debug=True)