from ._version import __version__
from .api import setup_handlers


def _jupyter_labextension_paths():
    return [{
        'src': 'labextension',
        'dest': '@robostack/jupyterlab-ros',
    }]

def _jupyter_server_extension_paths():
    return [{
        "module": "jupyter_ros_server"
    }]


def load_jupyter_server_extension(lab_app):
    """Registers the API handler to receive HTTP requests from the frontend extension.
    Parameters
    ----------
    lab_app: jupyterlab.labapp.LabApp
        JupyterLab application instance
    """

    url_path = "ros"
    setup_handlers(lab_app.web_app, url_path)
    lab_app.log.info("Registered jupyter_ros_server extension at URL path /{}".format(url_path))