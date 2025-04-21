import logging
from logging.handlers import TimedRotatingFileHandler
from app.core.config import settings

# Logging configuration for project

handler = TimedRotatingFileHandler(
    'py_log.log',
    when='midnight',
    interval=1,
    backupCount=7
)


formatter = logging.Formatter('%(asctime)s %(levelname)s [%(name)s]: %(message)s', '%Y-%m-%d %H:%M:%S')
handler.setFormatter(formatter)


logger = logging.getLogger()
logger.setLevel(logging.DEBUG if settings.DEBUG else logging.INFO)
logger.addHandler(handler)