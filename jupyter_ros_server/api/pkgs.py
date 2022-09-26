import os
import json
import tornado
from tornado.web import StaticFileHandler

from notebook.utils import url_path_join
from notebook.base.handlers import IPythonHandler

import rospkg

from ..lib import getEnv, getMaster, save, getWorkspaces, ROS_PACKAGE_PATH




class Pkgs(IPythonHandler):

    # rospack = rospkg.RosPack()
    current_workspace = getWorkspaces()
    current_workspace_list =  current_workspace.split(':') if ":" in current_workspace else [current_workspace]
    
    # if ROS_PACKAGE_PATH != current_workspace:
    #     if ROS_PACKAGE_PATH not in current_workspace_list:
    #         current_workspace_list.append(ROS_PACKAGE_PATH)

    current_workspace_list = [ws.strip() for ws in current_workspace_list]

    rospack = rospkg.RosPack(current_workspace_list)

    print(f"[Pkgs : ] {' | '.join(current_workspace_list)}")

    @tornado.web.authenticated
    def get(self, *args, **kwargs):
        cls = self.__class__

        if not args:
            self.write("Error - no argument supplied")
            self.finish()
            return
        
        print("[PKGS] get:", args[0])
        print("[PKGS] ws : ", cls.current_workspace_list)

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