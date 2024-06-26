#!/usr/bin/env python3
"""qbitapi."""

import logging

from datetime import datetime, timezone
from flask import Flask, g, make_response, render_template, send_from_directory
from pathlib import Path
from qbittorrentapi import Client as QBitClient


# Logging.
logging.getLogger("qbittorrentapi").setLevel(logging.DEBUG)
logging.getLogger("requests").setLevel(logging.DEBUG)
logging.getLogger("urllib3").setLevel(logging.DEBUG)

# Flask.
app = Flask(__name__)
app.config.from_pyfile("config.py")


def qbc(credentials=app.config.get("QBIT")):
    """Connect and log in to qBittorrent API."""
    client = QBitClient(
        host=credentials.get("host", "localhost"),
        port=credentials.get("port", 80),
        username=credentials.get("username", "admin"),
        password=credentials.get("password", "adminadmin"),
        VERIFY_WEBUI_CERTIFICATE=credentials.get("verify", False),
        FORCE_SCHEME_FROM_HOST=credentials.get("force_scheme", False),
        SIMPLE_RESPONSES=credentials.get("simple", True)
    )
    client.auth_log_in()
    return client


@app.context_processor
def injects():
    """Context processor(s)."""
    return {
        "categories": app.config.get("CATEGORIES"),
        "now": int(datetime.now(tz=timezone.utc).timestamp()),
        "torrents": g.torrents
    }


@app.before_request
def pre():
    """Before request."""
    qbit = qbc()
    g.torrents = qbit.torrents_info()


@app.template_filter("bytes2human")
def fmt_bytes(num, suffix="B"):
    for unit in ("", "Ki", "Mi", "Gi", "Ti", "Pi", "Ei", "Zi"):
        if abs(num) < 1024.0:
            return f"{num:3.1f} {unit}{suffix}"
        num /= 1024.0
    return f"{num:.1f} Yi{suffix}"


@app.template_filter("strftime")
def fmt_time(dt, fmt="%a, %b %d, %Y @ %I:%M:%S %p %Z"):
    return dt.strftime(fmt)


@app.template_filter("intcomma")
def int_comma(value):
    return "{:,.0f}".format(value)


@app.template_filter("unix2time")
def unix2time(seconds, tz=app.config.get("TIMEZONE")):
    return datetime.fromtimestamp(seconds).astimezone(tz=tz)


@app.route(rule="/", methods=["GET"])
def index():
    if not g.torrents:
        return error(
            title="No Torrents Found.",
            message="Sorry, but no torrents could be found.",
            code=404
        )
    return render_template("index.html.j2")


def error(title=None, message=None, code=500):
    return make_response(
        render_template(
            "error.html.j2",
            title=title or "Unknown Error",
            message=message or "Sorry, but there was an unknown error."
        ), code
    )


@app.errorhandler(400)
def bad_request(message):
    return error(title="Bad Request", message=message, code=400)


@app.errorhandler(404)
def page_not_found(message):
    return error(title="Page Not Found", message=message, code=404)


@app.errorhandler(500)
def internal_server_error(message):
    return error(title="Internal Server Error", message=message, code=500)


@app.route("/favicon.ico")
def favicon():
    return send_from_directory(
        Path(app.root_path, "static"),
        mimetype="image/vnd.microsoft.icon",
        path="favicon.ico"
    )


if __name__ == "__main__":
    app.run(debug=True)
