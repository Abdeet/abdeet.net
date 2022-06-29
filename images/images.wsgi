import sys
import logging

logging.basicConfig(level=logging.DEBUG, filename='var/www/abdeet/images/images.log', format='%(asctime)s %(message)s')
sys.path.insert(0, '/var/www/abdeet/images/website')
sys.path.insert(0, '/var/www/abdeet/images/venv/lib/python3.7/site-packages')
from __init__ import create_app
application = create_app()
