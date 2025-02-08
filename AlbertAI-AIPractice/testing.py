from flask import Flask, request, jsonify
from transformers import AutoModelForCausalLM, AutoTokenizer
import torch

app = Flask(__name__)

# Load Hugging Face GPT model and tokenizer
model_name = "mistralai/Mistral-7B-Instruct"  # You can change this to any available GPT model
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForCausalLM.from_pretrained(model_name, torch_dtype=torch.float16, device_map="auto")

@app.route("/generate", methods=["POST"])
def generate_text():
    data = request.json
    prompt = data.get("prompt", "")

    # Tokenize input
    inputs = tokenizer(prompt, return_tensors="pt").to("cuda")

    # Generate output
    outputs = model.generate(**inputs, max_length=200)
    response = tokenizer.decode(outputs[0], skip_special_tokens=True)

    return jsonify({"content": response})

if __name__ == "__main__":
    app.run(debug=True, port=5000)
