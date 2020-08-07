import os
import json
import tornado
from notebook.base.handlers import APIHandler

from ..lib import getEnv, getMaster, save

class Setting(APIHandler):
    
    @tornado.web.authenticated
    def get(self):
        self.finish(json.dumps( { 'env': getEnv(), 'master': getMaster() } ))

    @tornado.web.authenticated
    def put(self):
        msg = self.get_json_body()
        save(msg['env'], msg['master'])
        self.finish()
