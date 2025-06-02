import os
from flask import Flask, render_template, send_file, abort
import logging

# Configure logging
logging.basicConfig(level=logging.DEBUG)

app = Flask(__name__)
app.secret_key = os.environ.get("SESSION_SECRET", "dev-secret-key-change-in-production")

@app.route('/')
def index():
    """Main portfolio page"""
    return render_template('index.html')

@app.route('/download-resume')
def download_resume():
    """Download resume file"""
    try:
        return send_file('static/documents/Sugirthan_Resume.pdf', 
                        as_attachment=True, 
                        download_name='Sugirthan_J_Resume.pdf')
    except FileNotFoundError:
        abort(404)

@app.errorhandler(404)
def not_found(error):
    return render_template('index.html'), 404

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
