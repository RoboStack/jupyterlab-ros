import uuid
import json
import asyncio
import subprocess
from threading import Thread

from tornado.ioloop import IOLoop
from tornado.gen import coroutine
from tornado.websocket import WebSocketHandler

from ..lib import ROOT

class Master(WebSocketHandler):
    status = False
    thread = None
    proc = None
    clients = {}

    bridge_master_changes = None
    launch_master_changes = None

    def open(self):
        cls = self.__class__
        self.id = str(uuid.uuid4())
        cls.clients[self.id] = (IOLoop.current(), self.write_message)

        self.write_message( json.dumps({ 'status': cls.status }) )

    def on_message(self, message):
        cls = self.__class__
        msg = json.loads(message)

        if msg['cmd'] == "start" and cls.proc == None :
            cls.thread = Thread(target=cls.run, args=(['roslaunch', ROOT+'/lib/roslab.launch'],))
            cls.thread.daemon = True
            cls.thread.start()
            
        elif msg['cmd'] == "stop" and cls.proc != None:
            if cls.proc.poll() == None :
                cls.proc.terminate()
            

    def on_close(self):
        cls = self.__class__
        cls.clients.pop(self.id)
    
    def check_origin(self, origin):
        return True
    
    @classmethod
    def run(cls, command):
        asyncio.set_event_loop(asyncio.new_event_loop())
        cls.proc = subprocess.Popen(command, stdout=subprocess.PIPE, stderr=subprocess.PIPE, universal_newlines=True)
        cls.status = True

        for loop, write in cls.clients.values() :
            loop.add_callback(write, json.dumps({ 'status': cls.status }) )
        
        cls.bridge_master_changes(cls.status)
        cls.launch_master_changes(cls.status)

        out, err = cls.proc.communicate()
        cls.proc = None

        cls.status = False
        if err :
            for loop, write in cls.clients.values() :
                loop.add_callback(write, json.dumps({ 'status': cls.status, 'error': err }) )
                cls.bridge_master_changes(cls.status)
                cls.launch_master_changes(cls.status)
            
        else :
            for loop, write in cls.clients.values() :
                loop.add_callback(write, json.dumps({ 'status': cls.status, 'output': out }) )
                cls.bridge_master_changes(cls.status)
                cls.launch_master_changes(cls.status)
        