import os
import json
import tornado
from tornado.web import StaticFileHandler

from notebook.utils import url_path_join
from notebook.base.handlers import APIHandler, IPythonHandler

from ..lib import getEnv, getMaster, save

class Models(APIHandler):
    web_app = None
    base_url = None

    @tornado.web.authenticated
    def get(self):
        self.finish()

    @tornado.web.authenticated
    def post(self):
        cls = self.__class__
        msg = self.get_json_body()

        route = url_path_join(cls.base_url, msg['name'])
        
        ROSStaticHandler.path = msg['path']
    
        cls.web_app.add_handlers(".*$", [("{}/(.*)".format(route), ROSStaticHandler)])
        self.finish()
    
    @tornado.web.authenticated
    def put(self):
        self.finish()
    
    @tornado.web.authenticated
    def delete(self):
        self.finish()


class ROSStaticHandler(IPythonHandler):
    path = None

    @tornado.web.authenticated
    def get(self, *args, **kwargs):
        cls = self.__class__

        if not args:
            self.write("Error - no argument supplied")
        
        argslist = args[0].split('/')
        file = os.path.join(cls.path, '/'.join(argslist[1:]))

        try:
            with open(file, 'rb') as f:
                data = f.read()
                self.write(data)
        except:
            self.write("Error opening file %s" % file)
        self.finish()