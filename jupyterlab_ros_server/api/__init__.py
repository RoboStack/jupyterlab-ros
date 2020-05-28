import os
from notebook.utils import url_path_join

from .ros_config import ROSConfig
from .ros_bridge import ROSBridge


def setup_handlers(web_app, url_path):
    host_pattern = ".*$"
    base_url = web_app.settings["base_url"]

    # Prepend the base_url so that it works in a jupyterhub setting
    route_config = url_path_join(base_url, url_path, "config")
    route_bridge = url_path_join(base_url, url_path, "bridge")

    handlers = [
        (route_config, ROSConfig),
        (route_bridge, ROSBridge)
    ]
    
    web_app.add_handlers(host_pattern, handlers)