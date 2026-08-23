# ahsanjavaid

Resume-focused repository for Ahsan Javaid.

## Included

- Single resume page: index.html
- CV source: CV-M-AhsanJavaid.pdf
- AI resume generator: create_resume_ehsan_genric.py
- Config for Gemini and outputs: resume_ai_config.json
- Job description input: job_description.txt

## Run Resume Generator (Gemini)

1. Install dependencies:

	pip install -r requirements.txt

2. Configure API key in one of two ways:

	Option A (recommended): set environment variable GEMINI_API_KEY
	Option B: set gemini_api_key in resume_ai_config.json

3. Add target job description:

	- Edit job_description.txt with the role description
	- Or set job_description_text directly in resume_ai_config.json

4. Adjust settings in resume_ai_config.json if needed:

	- gemini_model
	- input_pdf
	- job_description_path
	- output_docx
	- target_role

5. Run:

	python create_resume_ehsan_genric.py

## Output

- Tailored DOCX resume generated from CV + job description for review
