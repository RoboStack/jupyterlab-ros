import os
import json
import tornado
from tornado.web import StaticFileHandler

from notebook.utils import url_path_join
from notebook.base.handlers import IPythonHandler

import rospkg

from ..lib import getEnv, getMaster, save, getWorkspaces, ROS_PACKAGE_PATH




class Pkgs(IPythonHandler):

    def get_wsl():
        current_workspace = getWorkspaces()
        current_workspace_list =  current_workspace.split(':') if ":" in current_workspace else [current_workspace]
        current_workspace_list = [ws.strip() for ws in current_workspace_list if len(ws.strip()) > 0]
        if ROS_PACKAGE_PATH not in current_workspace_list:
            current_workspace_list.append(ROS_PACKAGE_PATH)
        return current_workspace_list
    
    startup_ws = get_wsl()
    rospack = rospkg.RosPack(startup_ws)

    @tornado.web.authenticated
    def get(self, *args, **kwargs):
        cls = self.__class__
        current_workspace_list = cls.get_wsl()
        if current_workspace_list != cls.startup_ws:
            cls.rospack = rospkg.RosPack(current_workspace_list)
            cls.startup_ws = current_workspace_list
            print("[PKGS] : ws updated: ", " | ".join(cls.startup_ws))

        if not args:
            self.write("Error - no argument supplied")
            self.finish()
            return
        
        print("[PKGS] get:", args[0])
        

        argslist = args[0].split('/')
        package = argslist[0]
        file = '/'.join(argslist[1:])
        path = ""

        try :
            path = cls.rospack.get_path(package)

        except rospkg.ResourceNotFound :
            self.write("Package %s not found" % package)
            self.finish()
            return

        try:
            with open(os.path.join(path, file), 'rb') as f:
                data = f.read()
                self.write(data)
        except:
            self.write("Error opening file %s" % file)

        self.finish()