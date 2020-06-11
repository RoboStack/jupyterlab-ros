import json
from tornado.web import authenticated
from notebook.base.handlers import APIHandler

from .command import Command

class ROSMaster(APIHandler):

    status = False
    cmd = None
    
    @authenticated
    def get(self):
        cls = self.__class__
        self.finish(json.dumps({ 'status': cls.status }))

    @authenticated
    def post(self):
        cls = self.__class__

        req = self.get_json_body()

        if req['cmd'] == "start" :
            command = ['/home/carlos/miniconda3/envs/lab/bin/roslaunch', 'jupyterlab_ros_server/roslab.launch']
            cls.cmd = Command(command)
            print("initialized")
            cls.cmd.start()
            cls.status = True

        elif req['cmd'] == "stop" :
            cls.cmd.stop()
            cls.cmd = None
            cls.status = False

        self.finish(json.dumps({ 'status': cls.status }))