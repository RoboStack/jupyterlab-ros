import json

from notebook.base.handlers import APIHandler
from notebook.utils import url_path_join

import tornado
from tornado.web import StaticFileHandler

class ROSBridge(APIHandler):
    
    @tornado.web.authenticated
    def get(self):
        self.finish(json.dumps({ 'data': "works" }))

    @tornado.web.authenticated
    def post(self):
        # req = self.get_json_body()
        self.finish(json.dumps({ 'data': "works" }))