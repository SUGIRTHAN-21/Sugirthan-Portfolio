import os
import json
from datetime import datetime
from flask import Flask, render_template, request, jsonify, send_file

app = Flask(__name__)
app.secret_key = os.environ.get("SESSION_SECRET", "dev-secret-key")

PORTFOLIO_DATA = {
    "name": "Sugirthan J",
    "role": "Aspiring Junior AI/ML Engineer",
    "tagline": "Passionate about applying AI and Machine Learning to solve real-world problems",
    "bio": [
        "Final-year Computer Technology student with hands-on experience in Machine Learning and AI technologies. Proficient in Python programming, prompt engineering techniques, and data analysis.",
        "Enthusiastic about applying technical knowledge to solve real-world problems using AI-driven approaches. Currently pursuing B.Sc in Computer Technology at PSG College of Arts and Science, Coimbatore."
    ],
    "email": "j.sugirthan2006@gmail.com",
    "phone": "+91 7305038681",
    "location": "Madurai, Tamil Nadu, India",
    "github": "https://github.com/SUGIRTHAN-21",
    "linkedin": "https://www.linkedin.com/in/sugirthan-826052287",
    "whatsapp": "+91 7305038681",
    "skills": [
        {"name": "Python Programming", "percentage": 90},
        {"name": "Data Science & Analysis", "percentage": 85},
        {"name": "Machine Learning & AI Fundamentals", "percentage": 75},
        {"name": "Prompt Engineering & Generative AI", "percentage": 80},
        {"name": "Automation & Problem Solving", "percentage": 85}
    ],
    "projects": [
        {
            "title": "AI-Powered Resume Analyzer & Quiz Evaluator",
            "description": "Built an intelligent system that analyzes resume content using AI and generates personalized assessment questions. Automated candidate evaluation and scoring, reducing manual screening time by 60%.",
            "tech": "OCR, Python, Flask, Gemini AI Models (API)",
            "link": "https://github.com/SUGIRTHAN-21/Ai-Resume-analyzer"
        },
        {
            "title": "Leaf Disease Detection Flask App",
            "description": "Developed a machine learning-powered web application for identifying plant diseases from leaf images. Enables early disease detection to help farmers protect crops and improve agricultural yield.",
            "tech": "CNN, TensorFlow, Keras, Flask, Python, Image Processing",
            "link": "https://github.com/SUGIRTHAN-21/leaf_disease_detection"
        },
        {
            "title": "Student Course Management System",
            "description": "Created a web application with secure user authentication to manage course enrollments. Implemented CRUD operations and SQL queries for DBMS understanding.",
            "tech": "Flask, MySQL, HTML/CSS, JavaScript, SQL",
            "link": "https://github.com/SUGIRTHAN-21/Student-Course-Management-System"
        },
        {
            "title": "AutoMate - Voice-Controlled AI Assistant",
            "description": "Developed an intelligent voice-controlled automation system that executes commands through natural language processing. Integrates various APIs and services for enhanced productivity and system control.",
            "tech": "Python, Speech Recognition, NLP, API Integration, Automation",
            "link": "https://github.com/SUGIRTHAN-21/AutoMate-system-voice-control-Ai-initial-"
        }
    ],
    "internships": [
        {
            "title": "Data Science Intern",
            "company": "CodSoft",
            "period": "Mar 2025 - Apr 2025",
            "description": "Completed a 4-week virtual internship in Data Science. Contributed to data-driven tasks and projects with strong performance. Earned excellent remarks for skill application and project delivery.",
            "certificate_id": "ed1bad7",
            "image": "cert9.png"
        },
        {
            "title": "AI/ML Intern",
            "company": "INNOVATE Intern",
            "period": "May 2025",
            "description": "Completed a 2-week internship in Artificial Intelligence & Machine Learning. Developed and submitted a project titled 'Leaf Disease Detection Flask App'. Gained practical experience in ML model deployment using Flask.",
            "certificate_id": "INNOVATE/AIML/0006757",
            "image": "innovate_cert.png"
        }
    ],
    "certifications": [
        {"title": "ChatGPT Advanced Data Analysis", "platform": "Vanderbilt University (Coursera)", "year": 2024, "image": "cert1.png", "link": "https://www.coursera.org/account/accomplishments/verify/YPHMDDZLEFWS"},
        {"title": "Prompt Engineering for ChatGPT", "platform": "Vanderbilt University (Coursera)", "year": 2024, "image": "cert2.png", "link": "https://www.coursera.org/account/accomplishments/verify/HXBXQECZBBPF"},
        {"title": "Crash Course on Python", "platform": "Google (Coursera)", "year": 2024, "image": "cert3.png", "link": "https://www.coursera.org/account/accomplishments/verify/MK4FFQS9WVQE"},
        {"title": "Python for Data Science and AI", "platform": "IBM (Credly)", "year": 2024, "image": "cert4.png", "link": "https://www.credly.com/go/QT7GfEaT"},
        {"title": "Python for Data Science, AI & Development", "platform": "IBM (Coursera)", "year": 2024, "image": "cert5.png", "link": "https://www.coursera.org/account/accomplishments/verify/5ND6WSV8XFL2"},
        {"title": "Generative AI for Everyone", "platform": "DeepLearning.AI (Coursera)", "year": 2024, "image": "cert6.png", "link": "https://coursera.org/share/2837374fb07fec955273adf88add2aee"},
        {"title": "Artificial Intelligence Fundamentals", "platform": "IBM SkillsBuild (Credly)", "year": 2024, "image": "cert7.png", "link": "https://www.credly.com/go/rcvzaRDO"},
        {"title": "Python for Data Science", "platform": "NPTEL (IIT Madras, Swayam)", "year": 2024, "image": "cert8.png", "link": None}
    ],
    "achievements": [
        {
            "title": "IIC Regional Meet 2025",
            "description": "Participated in the One Day Regional Meet hosted by PSG College of Arts and Science, Coimbatore on 25th November 2025.",
            "type": "Participation",
            "image": "iic_meet.png"
        },
        {
            "title": "ISC Topper - English",
            "description": "Proficiency in English - ISC Examination, March 2023. Awarded by Virudhunagar T.S.M. Manickam Nadar - Janaki Ammal School on the 48th Annual Day.",
            "type": "Academic Excellence",
            "image": "english_cert.png"
        },
        {
            "title": "ISC Topper - Commerce",
            "description": "Proficiency in Commerce - ISC Examination, March 2023. Awarded by Virudhunagar T.S.M. Manickam Nadar - Janaki Ammal School on the 48th Annual Day.",
            "type": "Academic Excellence",
            "image": "commerce_cert.jpg"
        },
        {
            "title": "Winner - Trivia Titans Quiz",
            "description": "Champion of the 'Trivia Titans Quiz' competition organized by the Department of Computer Science.",
            "type": "Competition Winner",
            "image": None
        }
    ]
}


@app.route("/")
def index():
    return render_template("index.html", data=PORTFOLIO_DATA)


@app.route("/contact", methods=["POST"])
def contact():
    try:
        if request.is_json:
            data = request.get_json()
        else:
            data = request.form.to_dict()
        
        name = data.get("name", "").strip()
        email = data.get("email", "").strip()
        message = data.get("message", "").strip()
        
        if not name:
            return jsonify({"status": "error", "message": "Name is required"}), 400
        if not email:
            return jsonify({"status": "error", "message": "Email is required"}), 400
        if not message:
            return jsonify({"status": "error", "message": "Message is required"}), 400
        if "@" not in email or "." not in email:
            return jsonify({"status": "error", "message": "Please enter a valid email address"}), 400
        
        new_message = {
            "name": name,
            "email": email,
            "message": message,
            "timestamp": datetime.now().isoformat()
        }
        
        messages = []
        if os.path.exists("messages.json"):
            try:
                with open("messages.json", "r") as f:
                    messages = json.load(f)
            except (json.JSONDecodeError, IOError):
                messages = []
        
        messages.append(new_message)
        
        with open("messages.json", "w") as f:
            json.dump(messages, f, indent=2)
        
        return jsonify({"status": "success", "message": "Thanks - message received! I'll get back to you soon."}), 200
        
    except Exception as e:
        return jsonify({"status": "error", "message": "An error occurred. Please try again."}), 500


@app.route("/resume")
def download_resume():
    resume_path = os.path.join(os.path.dirname(__file__), "static", "resume.pdf")
    if os.path.exists(resume_path):
        return send_file(
            resume_path,
            as_attachment=True,
            download_name="Sugirthan_J_Resume.pdf"
        )
    return "Resume not found", 404


@app.route("/certificate/<filename>")
def view_certificate(filename):
    cert_path = os.path.join(os.path.dirname(__file__), "static", "images", filename)
    if os.path.exists(cert_path):
        return send_file(cert_path)
    return "Certificate not found", 404


if __name__ == "__main__":
    debug_mode = os.environ.get("FLASK_DEBUG", "false").lower() == "true"
    app.run(host="0.0.0.0", port=5000, debug=debug_mode)