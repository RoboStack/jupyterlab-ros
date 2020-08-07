import os
from notebook.utils import url_path_join
from tornado.web import StaticFileHandler

from rosbridge_library.capabilities.advertise import Advertise
from rosbridge_library.capabilities.publish import Publish
from rosbridge_library.capabilities.subscribe import Subscribe
from rosbridge_library.capabilities.advertise_service import AdvertiseService
from rosbridge_library.capabilities.unadvertise_service import UnadvertiseService
from rosbridge_library.capabilities.call_service import CallService

from ..lib import PUBLIC
from .bridge import Bridge
from .launch import Launch
from .master import Master
from .pkgs import Pkgs
from .setting import Setting

def setup_handlers(web_app, url_path):
    host_pattern = ".*$"
    base_url = web_app.settings["base_url"]

    # Prepend the base_url so that it works in a jupyterhub setting
    route_bridge = url_path_join(base_url, url_path, "bridge")
    route_launch = url_path_join(base_url, url_path, "launch")
    route_master = url_path_join(base_url, url_path, "master")
    route_pkgs = url_path_join(base_url, url_path, "pkgs/(.*)")
    route_setting = url_path_join(base_url, url_path, "setting")
    route_zethus = url_path_join(base_url, url_path, "zethus")

    Master.bridge_master_changes = Bridge.on_master_changes
    Master.launch_master_changes = Launch.on_master_changes

    handlers = [
        (route_bridge, init_bridge()),
        (route_launch, Launch),
        (route_master, Master),
        (route_pkgs, Pkgs),
        (route_setting, Setting),
        ("{}/(.*)".format(route_zethus), StaticFileHandler, {"path": PUBLIC})
    ]
    
    web_app.add_handlers(host_pattern, handlers)

def init_bridge():
    # Get the glob strings and parse them as arrays.
    Bridge.topics_glob = []
    Bridge.services_glob = ["/rosapi/*"]
    Bridge.params_glob = []

    Subscribe.topics_glob = Bridge.topics_glob
    Advertise.topics_glob = Bridge.topics_glob
    Publish.topics_glob = Bridge.topics_glob
    AdvertiseService.services_glob = Bridge.services_glob
    UnadvertiseService.services_glob = Bridge.services_glob
    CallService.services_glob = Bridge.services_glob
    
    return Bridge