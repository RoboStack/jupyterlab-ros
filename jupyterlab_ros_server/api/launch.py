import uuid
import json
from os import path

from tornado.ioloop import IOLoop
from tornado.websocket import WebSocketHandler

from ..lib import Process, getEnv

class Launch(WebSocketHandler):
    master = False
    clients = {}
    processes = {}

    def open(self):
        print("[LAUNCH]: open")
        cls = self.__class__
        self.id = str(uuid.uuid4())
        cls.clients[self.id] = (IOLoop.current(), self.write_message)
        
        self.write_message( json.dumps({ 'code': 0, 'paths': list(cls.processes.keys()) }) )
    
    def on_message(self, message):
        #print("[LAUNCH]: message, ", message)
        cls = self.__class__
        msg = json.loads(message)

        if msg['cmd'] == "start" :
            if ( cls.processes.get(msg['path'], None) == None ) and cls.master :
                print("[LAUNCH]: starting")
                cmd = [path.join(getEnv(), 'roslaunch'), msg['path']]
                cls.processes[msg['path']] = Process(cmd, cls.on_process_finished)
                cls.processes[msg['path']].start()

                self.write_message( json.dumps({ 'code': 1, 'path': msg['path'] }) )
            
            elif cls.master  :
                err = "Process already running."
                self.write_message( json.dumps({ 'code': 2, 'path': msg['path'], 'msg': err }) )
            
            else :
                err = "Master not running."
                self.write_message( json.dumps({ 'code': 2, 'path': msg['path'], 'msg': err }) )

        elif msg['cmd'] == "stop":
            if ( cls.processes.get(msg['path'], None) != None ) :
                print("[LAUNCH]: stopping")
                cls.processes[msg['path']].stop()
            
            else :
                err = "Process not running."
                self.write_message( json.dumps({ 'code': 2, 'path': msg['path'], 'msg': err }) )

    def on_close(self):
        print("[LAUNCH]: close")
        cls = self.__class__
        cls.clients.pop(self.id)
    
    def check_origin(self, origin):
        print("[LAUNCH]: check origin")
        return True
    
    @classmethod
    def on_process_finished(cls, path, message):
        for loop, write in cls.clients.values() :
            loop.add_callback(write, message)
        
        cls.processes.pop(path)
        print("[LAUNCH]: stopped")
    
    @classmethod
    def on_master_changes(cls, status):
        cls.master = status
        if not status :
            for proc in cls.processes.values() :
                proc.stop()
