FROM python:3.9-slim

WORKDIR /app

RUN apt-get update && apt-get install -y libgomp1 && rm -rf /var/lib/apt/lists/*

COPY . /app

RUN pip install -r requirements.txt

RUN python3 -c "import nltk; nltk.download('stopwords'); nltk.download('wordnet')"

CMD ["python3", "app.py"]