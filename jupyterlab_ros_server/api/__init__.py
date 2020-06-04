import os
from notebook.utils import url_path_join

from .ros_config import ROSConfig

import rospy

#from rosbridge_server.websocket_handler import RosbridgeWebSocket
from .websocket_handler import LabRosbridgeWebSocket

from rosbridge_server import ClientManager

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
    route_config = url_path_join(base_url, url_path, "config")
    route_bridge = url_path_join(base_url, url_path, "bridge")

    handlers = [
        (route_config, ROSConfig),
        (route_bridge, init_rosbridge())
    ]
    
    web_app.add_handlers(host_pattern, handlers)

def init_rosbridge():
    # Prep RosBrige Handler
    rospy.init_node("rosbridge_websocket", disable_signals=True)

    LabRosbridgeWebSocket.client_manager = ClientManager()

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