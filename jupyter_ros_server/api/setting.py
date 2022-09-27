import os
import json
import tornado
from notebook.base.handlers import APIHandler

from ..lib import getEnv, getMaster, getWorkspaces, save

class Setting(APIHandler):
    
    @tornado.web.authenticated
    def get(self):
        self.finish(json.dumps( { 'env': getEnv(), 'master': getMaster(), 'workspaces' : getWorkspaces()} ))

    @tornado.web.authenticated
    def put(self):
        msg = self.get_json_body()
        save(msg['env'], msg['master'], msg['workspaces'])
        print(msg)
        self.finish()
