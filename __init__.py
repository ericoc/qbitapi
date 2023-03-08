#!/usr/bin/env python3
'''qbitapi'''
import logging
from datetime import datetime, timezone
from flask import abort, Flask, flash, g, redirect, render_template, url_for
import pytz
import qbittorrentapi


logging.getLogger('qbittorrentapi').setLevel(logging.DEBUG)
logging.getLogger('requests').setLevel(logging.DEBUG)
logging.getLogger('urllib3').setLevel(logging.DEBUG)

app = Flask(__name__)
app.config.from_pyfile('config.py')


@app.before_request
def pre_request():
    '''Before request'''
#    g.now = datetime.now(tz=timezone.utc)
    g.qbit = qbc()


@app.context_processor
def injects():
    '''Variables available to all templates'''
#    return { 'now': g.now }
    return {}


def fmt_ratio(ratio=None):
    '''Return CSS class for ratio'''
    if ratio >= 1:
        return 'done'
    if ratio >= 0.5:
        return 'high'
    if ratio >= 0.25:
        return 'low'
    return 'verylow'


def fmt_size(num_bytes=None):
    '''Convert bytes to human-readable file size'''
    if isinstance(num_bytes, int):
        for unit in ['', 'Ki', 'Mi', 'Gi', 'Ti', 'Pi', 'Ei', 'Zi']:
            if abs(num_bytes) < 1024.0:
                return f'{num_bytes:3.1f} {unit}B'
            num_bytes /= 1024.0
        return f'{num_bytes:.1f} YiB'
    return num_bytes


def fmt_time(timestamp=None):
    '''Convert UNIX timestamp to Python datetime object'''
    if isinstance(timestamp, int):
        return datetime.fromtimestamp(timestamp, tz=timezone.utc)
    return timestamp


def fmt_tz(when=None):
    '''Convert Python datetime object to configured timezone'''
    if isinstance(when, datetime):
        return when.astimezone(pytz.timezone(app.config['TIMEZONE']))
    return when


def qbc(host=app.config['QBIT_HOST'], port=app.config['QBIT_PORT'],
    username=app.config['QBIT_USERNAME'], password=app.config['QBIT_PASSWORD']):
    '''Connect and log in to qBittorrent API'''
    client = qbittorrentapi.Client(
        host=host, port=port,
        username=username, password=password,
        VERIFY_WEBUI_CERTIFICATE=True, FORCE_SCHEME_FROM_HOST=True,
        SIMPLE_RESPONSES=True
    )
    client.auth_log_in()
    return client


@app.route('/', methods=['GET'])
def index(torrents=None):
    '''List torrents'''
    if torrents is None:
        torrents = g.qbit.torrents_info()
    if not torrents:
        flash('Sorry, but no torrents could be found!', 'error')
        abort(404)
    return render_template('index.html.j2', torrents=torrents, qbit_version=g.qbit.app_version())


@app.route('/category/<path:category>/', methods=['GET'])
@app.route('/category/<path:category>', methods=['GET'])
def search_category(category=None):
    '''List specifically categorized torrents'''
    if not category:
        return redirect(url_for('index'))
    return index(torrents=g.qbit.torrents_info(category=category))


def error(title='Unknown Error', message='Sorry, but there was an unknown error.', code=500):
    '''Error template'''
    return render_template('error.html.j2', title=title, message=message), code

@app.errorhandler(400)
def bad_request(message):
    '''Error codes to template above'''
    return error(title='Bad Request', message=message, code=400)

@app.errorhandler(401)
def not_authorized(message):
    '''Error codes to template above'''
    return error(title='Not Authorized', message=message, code=401)

@app.errorhandler(403)
def forbidden(message):
    '''Error codes to template above'''
    return error(title='Forbidden', message=message, code=403)

@app.errorhandler(404)
def page_not_found(message):
    '''Error codes to template above'''
    return error(title='Page Not Found', message=message, code=404)

@app.errorhandler(500)
def internal_server_error(message):
    '''Error codes to template above'''
    return error(title='Internal Server Error', message=message, code=500)


if __name__ == '__main__':
    app.run()
