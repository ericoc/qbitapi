#!/usr/bin/env python3
'''qbitapi'''

import logging
import os

from flask import abort, Flask, flash, g, redirect, render_template, \
    send_from_directory, url_for
import qbittorrentapi


# Configure logging
logging.getLogger('qbittorrentapi').setLevel(logging.DEBUG)
logging.getLogger('requests').setLevel(logging.DEBUG)
logging.getLogger('urllib3').setLevel(logging.DEBUG)

# Initialize Flask
app = Flask(__name__)
app.config.from_pyfile('config.py')


@app.before_request
def pre():
    '''Before request'''
    g.qbit = _qbc()


@app.context_processor
def injects():
    '''Variables available to all templates'''
    return {}


def _qbc(
    host=app.config['QBIT_HOST'], port=app.config['QBIT_PORT'],
    username=app.config['QBIT_USERNAME'],
    password=app.config['QBIT_PASSWORD']
):
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
    return render_template('index.html.j2', torrents=torrents)


@app.route('/category/<path:category>/', methods=['GET'])
@app.route('/category/<path:category>', methods=['GET'])
def search_category(category=None):
    '''List specifically categorized torrents'''
    if not category:
        return redirect(url_for('index'))
    return index(torrents=g.qbit.torrents_info(category=category))


def error(
        title='Unknown Error',
        message='Sorry, but there was an unknown error.',
        code=500
):
    '''Error template'''
    return render_template('error.html.j2', title=title, message=message), code


@app.errorhandler(400)
def bad_request(message):
    '''Error codes to template above'''
    return error(title='Bad Request', message=message, code=400)


@app.errorhandler(404)
def page_not_found(message):
    '''Error codes to template above'''
    return error(title='Page Not Found', message=message, code=404)


@app.errorhandler(500)
def internal_server_error(message):
    '''Error codes to template above'''
    return error(title='Internal Server Error', message=message, code=500)


@app.route('/favicon.ico')
def favicon():
    '''Serve favicon.ico from static content'''
    return send_from_directory(
        os.path.join(app.root_path, 'static'),
        'favicon.ico', mimetype='image/vnd.microsoft.icon'
    )


if __name__ == '__main__':
    app.run(debug=True)
