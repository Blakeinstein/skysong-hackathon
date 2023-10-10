# importing required modules
from PyPDF2 import PdfReader
from sentence_transformers import SentenceTransformer
import json

# Load the BERT-based model for embedding
model = SentenceTransformer('bert-base-nli-mean-tokens')

# creating a pdf reader object
reader = PdfReader('py_doc.pdf')

# printing number of pages in pdf file
print(len(reader.pages))

# getting a specific page from the pdf file
page = reader.pages[0]

# extracting text from page
text = page.extract_text()

# Embed the extracted text
embedding = model.encode(text)

# Create a dictionary to store the extracted text and its embedding
data = {
    'text': text,
    'embedding': embedding.tolist()  # Convert numpy array to list for JSON serialization
}

# Store the dictionary as a JSON file
with open('output.json', 'w') as json_file:
    json.dump(data, json_file)
