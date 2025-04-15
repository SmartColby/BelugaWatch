import sys
import spacy

# Load the spaCy model
nlp = spacy.load("en_core_web_sm")

def preprocess_query(query):
    # Process the query text using spaCy NLP
    doc = nlp(query.lower())
    
    # Tokenize and remove question words (if necessary)
    question_words = ['why', 'how', 'what', 'do', 'is', 'can', 'where', 'when', 'should', 'does']
    processed_query = ' '.join([token.text for token in doc if token.text not in question_words])
    
    # Return the processed query (remove leading/trailing spaces)
    return processed_query.strip()

if __name__ == "__main__":
    query = sys.argv[1]  # Get query from the command line
    processed_query = preprocess_query(query)
    print(processed_query)  # Print the result to be captured by Node.js
