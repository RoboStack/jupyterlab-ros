import json

from notebook.base.handlers import APIHandler
from notebook.utils import url_path_join

import tornado

status = False

class ROSConfig(APIHandler):
    
    @tornado.web.authenticated
    def get(self):
        self.finish(json.dumps({ 'status': status }))

    @tornado.web.authenticated
    def post(self):
        global status
        req = self.get_json_body()

        if req['cmd'] == "start" :
            status = True
        elif req['cmd'] == "stop" :
            status = False

        self.finish(json.dumps({ 'status': status }))