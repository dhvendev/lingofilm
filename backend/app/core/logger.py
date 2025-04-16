import logging
from logging.handlers import TimedRotatingFileHandler

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
logger.setLevel(logging.DEBUG)
logger.addHandler(handler)