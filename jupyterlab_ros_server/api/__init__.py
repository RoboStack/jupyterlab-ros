import os
from notebook.utils import url_path_join

from .ros_config import ROSConfig

import rospy

from rosbridge_server.websocket_handler import RosbridgeWebSocket

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
    
    ##################################################
    # Parameter handling                             #
    ##################################################

    # get RosbridgeProtocol parameters
    RosbridgeWebSocket.fragment_timeout = rospy.get_param('~fragment_timeout', RosbridgeWebSocket.fragment_timeout)
    RosbridgeWebSocket.delay_between_messages = rospy.get_param('~delay_between_messages', RosbridgeWebSocket.delay_between_messages)
    RosbridgeWebSocket.max_message_size = rospy.get_param('~max_message_size', RosbridgeWebSocket.max_message_size)
    RosbridgeWebSocket.unregister_timeout = rospy.get_param('~unregister_timeout', RosbridgeWebSocket.unregister_timeout)

    if RosbridgeWebSocket.max_message_size == "None":
        RosbridgeWebSocket.max_message_size = None
    
    RosbridgeWebSocket.max_message_size = int(100)

    # if authentication should be used
    RosbridgeWebSocket.authenticate = rospy.get_param('~authenticate', False)

    RosbridgeWebSocket.client_manager = ClientManager()

    # Get the glob strings and parse them as arrays.
    RosbridgeWebSocket.topics_glob = [
        element.strip().strip("'")
        for element in rospy.get_param('~topics_glob', '')[1:-1].split(',')
        if len(element.strip().strip("'")) > 0]
    RosbridgeWebSocket.services_glob = [
        element.strip().strip("'")
        for element in rospy.get_param('~services_glob', '')[1:-1].split(',')
        if len(element.strip().strip("'")) > 0]
    RosbridgeWebSocket.params_glob = [
        element.strip().strip("'")
        for element in rospy.get_param('~params_glob', '')[1:-1].split(',')
        if len(element.strip().strip("'")) > 0]

    # To be able to access the list of topics and services, you must be able to access the rosapi services.
    if RosbridgeWebSocket.services_glob:
        RosbridgeWebSocket.services_glob.append("/rosapi/*")

    Subscribe.topics_glob = RosbridgeWebSocket.topics_glob
    Advertise.topics_glob = RosbridgeWebSocket.topics_glob
    Publish.topics_glob = RosbridgeWebSocket.topics_glob
    AdvertiseService.services_glob = RosbridgeWebSocket.services_glob
    UnadvertiseService.services_glob = RosbridgeWebSocket.services_glob
    CallService.services_glob = RosbridgeWebSocket.services_glob

    ##################################################
    # Done with parameter handling                   #
    ##################################################
    
    return RosbridgeWebSocket