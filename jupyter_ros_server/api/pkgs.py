import os
import json
import tornado
from tornado.web import StaticFileHandler

from notebook.utils import url_path_join
from notebook.base.handlers import IPythonHandler

import rospkg

from ..lib import getEnv, getMaster, save

class Pkgs(IPythonHandler):
    rospack = rospkg.RosPack()

    @tornado.web.authenticated
    def get(self, *args, **kwargs):
        cls = self.__class__

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