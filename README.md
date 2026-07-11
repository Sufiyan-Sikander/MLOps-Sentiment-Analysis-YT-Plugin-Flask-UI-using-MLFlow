# End-to-End MLOps: YouTube Comment Sentiment Analyzer
This project is a complete, production-ready MLOps pipeline that analyzes the sentiment of YouTube comments in real-time. The system is built around a machine learning model that is deployed as a microservice and accessed via a custom Chrome extension.

This project was built following the Learn MLOps by Creating a YouTube Sentiment Analyzer on the freeCodeCamp.org YouTube channel.

<img width="350" height="500" alt="image" src="https://github.com/user-attachments/assets/fe9a2676-a1fe-404e-9a08-5feaa5a08d0f" /> 
<img width="557" height="586" alt="image" src="https://github.com/user-attachments/assets/9b4a181e-57b0-4b7d-bc95-2defb828ed6e" />


## 🚀 Project Overview
The primary goal is to build, deploy, and maintain a machine learning model in a production environment. This project covers the entire ML lifecycle, from initial data collection and experiment tracking to automated CI/CD deployment and real-time monitoring.
### Features
1. Real-time Analysis: A Chrome extension sends comments from any YouTube video to a deployed API.
2. ML Model API: A Flask API serves sentiment predictions (e.g., "Positive", "Negative") from a trained model.
3. Full ML Pipeline: The entire process of data ingestion, preprocessing, training, and evaluation is versioned and reproducible.
4. Automated Deployment: A CI/CD pipeline on AWS automatically deploys new, validated models.
5. 
## 🏗️ MLOps Pipeline Architecture
The project is broken down into modular components that represent the full machine learning lifecycle:
1. Introduction & Project Planning: Designing the end-to-end system architecture.
2. Data Collection: Scraping YouTube comments to build our initial training dataset.
3. Data Preprocessing & EDA: Cleaning, exploring, and transforming the raw text data for modeling.
4. Experiment Tracking (MLflow): Setting up an MLflow server on AWS to log experiments, compare model performance, and manage model artifacts.
5. Model Prototyping: Building a baseline model and iterating on it with techniques like Bag of Words (BoW), TF-IDF, and hyperparameter tuning to improve performance.
6. ML Pipeline (DVC): Using DVC (Data Version Control) to build a reproducible, version-controlled pipeline for data ingestion, preprocessing, training, and evaluation.
7. Model Deployment (Flask & Docker): Wrapping the best-performing model in a Flask API and containerizing the application with Docker.
8. Chrome Plugin Interface: Creating a simple Chrome extension that captures YouTube comments and sends them to the Flask API for analysis.
9. CI/CD Deployment (AWS): Setting up a continuous integration and deployment pipeline on AWS to automatically test and deploy new versions of the model.


## 🛠️ Technologies Used
This project uses a modern MLOps stack to manage the entire workflow:
• Experiment Tracking: MLflow

• Data & Pipeline Versioning: DVC (Data Version Control)

• API & Deployment: Flask, Docker

• Cloud & CI/CD: Amazon Web Services (AWS)

• Front-End: Chrome Extension (JavaScript, HTML, CSS)

• Core ML & Data: Python, Scikit-learn, Pandas, NLTK

### Acknowledgments
Course Provider: freeCodeCamp.org
