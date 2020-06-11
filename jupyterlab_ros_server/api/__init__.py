import os
from notebook.utils import url_path_join

from .ros_master import ROSMaster
from .websocket_handler import LabRosbridgeWebSocket

from rosbridge_library.capabilities.advertise import Advertise
from rosbridge_library.capabilities.publish import Publish
from rosbridge_library.capabilities.subscribe import Subscribe
from rosbridge_library.capabilities.advertise_service import AdvertiseService
from rosbridge_library.capabilities.unadvertise_service import UnadvertiseService
from rosbridge_library.capabilities.call_service import CallService


def setup_handlers(web_app, url_path):
    host_pattern = ".*$"
    base_url = web_app.settings["base_url"]

    # Prepend the base_url so that it works in a jupyterhub setting
    route_master = url_path_join(base_url, url_path, "master")
    route_bridge = url_path_join(base_url, url_path, "bridge")

    handlers = [
        (route_master, ROSMaster),
        (route_bridge, init_rosbridge())
    ]
    
    web_app.add_handlers(host_pattern, handlers)

def init_rosbridge():
    # Get the glob strings and parse them as arrays.
    LabRosbridgeWebSocket.topics_glob = []
    LabRosbridgeWebSocket.services_glob = ["/rosapi/*"]
    LabRosbridgeWebSocket.params_glob = []

    Subscribe.topics_glob = LabRosbridgeWebSocket.topics_glob
    Advertise.topics_glob = LabRosbridgeWebSocket.topics_glob
    Publish.topics_glob = LabRosbridgeWebSocket.topics_glob
    AdvertiseService.services_glob = LabRosbridgeWebSocket.services_glob
    UnadvertiseService.services_glob = LabRosbridgeWebSocket.services_glob
    CallService.services_glob = LabRosbridgeWebSocket.services_glob
    
    return LabRosbridgeWebSocket