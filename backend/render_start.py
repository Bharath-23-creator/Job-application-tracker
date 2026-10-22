
import os
from pathlib import Path

certificate = os.getenv("DB_SSL_CA_CONTENT")

if certificate:
    ca_path = Path("/tmp/ca.pem")
    ca_path.write_text(certificate.strip() + "\n", encoding="utf-8")
    os.environ["DB_SSL_CA"] = str(ca_path)

os.system("python manage.py migrate")
os.system("gunicorn config.wsgi:application")
