import os
import json
import subprocess
from datetime import datetime
from flask import Flask, render_template, request, jsonify, send_file

app = Flask(__name__)
app.secret_key = os.environ.get("SESSION_SECRET", "dev-secret-key")

PORTFOLIO_DATA = {
    # --- PERSONAL INFO START ---
    "name": "Sugirthan J",
    "role": "MBA Candidate | Computer Science Graduate",
    "tagline": "Bridging technology and business — bringing a computer science foundation into management, analytics, and leadership.",
    # --- PERSONAL INFO END ---
    # --- BIO START ---
    "bio": [
        "I'm a first-year MBA student at Shiv Nadar University, Chennai, building on a background in Computer Science (B.Sc Computer Technology). Specialization is yet to be chosen and will be decided in the second year of the program.",
        "My path so far has moved from studying Commerce (grades 9-12) to Computer Science to now an MBA — a deliberate transition aimed at combining technical understanding with business and management thinking. I see my CS background as a lasting strength: it lets me understand technology-driven problems clearly while I develop the analytical, communication, and leadership skills an MBA is meant to build.",
        "I stay engaged with how technology - particularly AI and automation - is changing business, and I'm interested in roles where technical literacy and business decision-making intersect."
    ],
    # --- BIO END ---
    # --- EDUCATION START ---
    "education": [
        {
            "degree": "MBA (Specialization to be chosen in Year 2)",
            "institution": "Shiv Nadar University, Chennai",
            "period": "Current — 1st Year",
            "status": "In Progress"
        },
        {
            "degree": "B.Sc Computer Technology",
            "institution": "PSG College of Arts and Science, Coimbatore",
            "period": "Completed",
            "status": "Completed"
        }
    ],
    # --- EDUCATION END ---
    # --- CONTACT START ---
    "email": "j.sugirthan2006@gmail.com",
    "phone": "+91 7305038681",
    "location": "Chennai, Tamil Nadu, India",
    "github": "https://github.com/SUGIRTHAN-21",
    "linkedin": "https://www.linkedin.com/in/sugirthan-826052287",
    "whatsapp": "+91 7305038681",
    # --- CONTACT END ---
    # --- SKILLS START ---
    # Technical skills: verified via completed projects/certifications — status "Established".
    "skills": [
        {"name": "Python Programming"},
        {"name": "Data Science & Analysis"},
        {"name": "Machine Learning & AI Fundamentals"},
        {"name": "Prompt Engineering & Generative AI"},
        {"name": "Automation & Problem Solving"}
    ],
    # Business skills: in progress through the MBA program — status "Building".
    # No proficiency measure is shown; these are not yet verified competencies.
    "business_focus": [
        {"name": "Business Communication"},
        {"name": "Analytical & Decision-Making Foundations"},
        {"name": "Cross-functional Thinking"},
        {"name": "AI's Role in Business"}
    ],
    # --- SKILLS END ---
    # --- PROJECTS START ---
    "projects": [
        {
            "title": "Gmail-Based Complaint Classification & Urgency Detection System",
            "description": "Developed a Gmail API-integrated application that automatically retrieves, classifies, and prioritizes customer complaints from incoming emails. Implemented rule-based complaint categorization, urgency detection, and a live dashboard to streamline issue tracking and response management.",
            "tech": "Gmail API, OAuth 2.0, Python, Flask, HTML/CSS, JavaScript, REST APIs",
            "link": "https://github.com/SUGIRTHAN-21/Gmail-complaint-clasification-and-urgency-detection-using-API"
        },
        {
            "title": "AutoMate - Voice-Controlled AI Assistant",
            "description": "Developed an intelligent voice-controlled automation system that executes commands through natural language processing. Integrates various APIs and services for enhanced productivity and system control.",
            "tech": "Python, Speech Recognition, NLP, API Integration, Automation",
            "link": "https://github.com/SUGIRTHAN-21/AutoMate-system-voice-control-Ai-initial-"
        },
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
        }
    ],
    # --- PROJECTS END ---
    # --- CERTIFICATIONS START ---
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
    # --- CERTIFICATIONS END ---
    # --- ACHIEVEMENTS START ---
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
        }
    ]
    # --- ACHIEVEMENTS END ---
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

    except Exception:
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


def kill_port(port=5000):
    """Kill any process running on the specified port"""
    try:
        subprocess.run(
            f'Get-NetTCPConnection -LocalPort {port} -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess | Get-Unique | ForEach-Object {{ Stop-Process -Id $_ -Force -ErrorAction SilentlyContinue }}',
            shell=True, capture_output=True, timeout=5
        )
    except Exception:
        pass


if __name__ == "__main__":
    kill_port(5000)
    debug_mode = os.environ.get("FLASK_DEBUG", "false").lower() == "true"
    app.run(host="0.0.0.0", port=5000, debug=debug_mode)