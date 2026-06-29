# Lightweight static demo server — no package install, no license gate
FROM python:3.10-slim

WORKDIR /app

# Copy only what the root server.py needs to serve the demo
COPY server.py .
COPY index.html .
COPY index.css .
COPY app.js .
COPY eclipse_erp.css .
COPY eclipse_erp.html .
COPY eclipse_erp.js .
COPY erp_profiles.js .
COPY mock_inventory_data.js .
COPY inside_sales_desk_pov.png .
COPY passcodes.json .
COPY eclipse/ eclipse/
COPY shared/ shared/

# Install only the stdlib dependencies needed (python-docx/reportlab for Office doc generation)
RUN pip install --no-cache-dir python-docx reportlab

ENV PYTHONUNBUFFERED=1

EXPOSE 8085

# Render injects $PORT at runtime; server.py reads os.environ.get("PORT", 8085)
CMD ["python", "server.py"]
