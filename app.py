# app.py
import os
import logging
from flask import Flask, render_template, request, jsonify
from markupsafe import Markup
from web import AccessibilityAuditor  # Import the class from web.py
from markdown import markdown # To render Gemini's markdown output nicely

# Configure logging
logging.basicConfig(level=logging.INFO)

app = Flask(__name__)

# Initialize the Auditor
# The API key is read from environment variables within the class constructor
try:
    auditor = AccessibilityAuditor()
    logging.info("AccessibilityAuditor initialized successfully.")
except ValueError as e:
    # If API key is missing, the app can't function. Log critically.
    logging.critical(f"Failed to initialize AccessibilityAuditor: {e}")
    # In a real app, you might want to disable the audit functionality
    # or display a persistent error message instead of letting it crash later.
    auditor = None # Set auditor to None to indicate failure
except Exception as e:
    logging.critical(f"Unexpected error during Auditor initialization: {e}")
    auditor = None


@app.route('/', methods=['GET'])
def index():
    """Renders the homepage with the URL input form."""
    api_key_present = bool(os.environ.get("GEMINI_API_KEY")) # Check if key is set for UI feedback
    auditor_initialized = bool(auditor)
    return render_template('index.html', api_key_present=api_key_present, auditor_initialized=auditor_initialized)

@app.route('/audit', methods=['POST'])
def audit():
    """Handles the audit request, calls the auditor, and returns results."""
    if not auditor:
         # If auditor failed to initialize (e.g., no API key), return an error
         logging.error("Audit request received but auditor is not initialized.")
         # Return JSON for potential JS handling on client-side, or render error template
         return jsonify({"error": "Auditor service is not available. Check API key configuration."}), 500

    url = request.form.get('url')
    if not url:
        logging.warning("Audit request received with no URL.")
        # Return JSON error or re-render index with error message
        return jsonify({"error": "URL is required."}), 400

    # Basic URL formatting check - the auditor does a more robust check too
    if not url.startswith(('http://', 'https://')):
        url = 'http://' + url # Attempt basic fix
        logging.info(f"Prepended http:// to URL: {url}")


    logging.info(f"Received audit request for URL: {url}")

    try:
        # Run the analysis - This is the time-consuming part
        results = auditor.analyze_page(url)
        logging.info(f"Analysis complete for {url}. Errors: {results.get('errors', [])}")

        # Convert Gemini markdown results to HTML for better display
        if results.get("findings", {}).get("desktop", {}).get("gemini_analysis"):
             results["findings"]["desktop"]["gemini_analysis_html"] = Markup(markdown(results["findings"]["desktop"]["gemini_analysis"]))
        if results.get("findings", {}).get("mobile", {}).get("gemini_analysis"):
             results["findings"]["mobile"]["gemini_analysis_html"] = Markup(markdown(results["findings"]["mobile"]["gemini_analysis"]))
        if results.get("comprehensive_analysis"):
             results["comprehensive_analysis_html"] = Markup(markdown(results["comprehensive_analysis"]))


        # Render the results template
        return render_template('results.html', results=results)

    except Exception as e:
        # Catch unexpected errors during the audit call or template rendering
        logging.error(f"Unexpected error during audit process for {url}: {e}", exc_info=True)
        # Return JSON error or render a generic error template
        return jsonify({"error": f"An unexpected server error occurred: {e}"}), 500


# Optional: Add basic error handlers for better UX
@app.errorhandler(404)
def page_not_found(e):
    logging.warning(f"404 Not Found error: {request.path}")
    return render_template('404.html'), 404

@app.errorhandler(500)
def internal_server_error(e):
     logging.error(f"500 Internal Server Error: {e}", exc_info=True)
     return render_template('500.html'), 500


# This is needed for Vercel to find the Flask app
# The name 'app' must match the Flask instance creation: app = Flask(__name__)
# No need for if __name__ == '__main__': run() for Vercel

# Add this block at the END of app.py for local development
if __name__ == '__main__':
    # debug=True enables auto-reloading when code changes and provides better error pages
    # host='0.0.0.0' makes the server accessible from other devices on your local network
    # port=5000 is the default, but you can change it if needed
    app.run(debug=True, host='0.0.0.0', port=5000)