import uuid
import json
from os import path

from tornado.ioloop import IOLoop
from tornado.websocket import WebSocketHandler

from ..lib import Bag, getEnv

BAG_ERROR = -1
BAG_INFO = 0
BAG_PLAY = 1
BAG_STOP = 2
BAG_CLOSE = 3

class BagPlay(WebSocketHandler):
    master = False
    clients = {}
    processes = {}

    def open(self):
        print("[BAG]: open")
        cls = self.__class__
        self.id = str(uuid.uuid4())
        cls.clients[self.id] = (IOLoop.current(), self.write_message)
    
    def on_message(self, message):
        print("[BAG]: message, ", message)
        cls = self.__class__
        msg = json.loads(message)

        if cls.processes.get(msg['path'], None) == None :
            cls.processes[msg['path']] = Bag(msg['path'], cls.on_process_finished)

        if msg['code'] == BAG_INFO :
            info = cls.processes[msg['path']].info()
            self.write_message( json.dumps({ 'code': BAG_INFO, 'info': info }) )
            return
        
        if msg['code'] == BAG_CLOSE :
            cls.processes[msg['path']].stop()
            cls.processes.pop(msg['path'])
            return
        
        if cls.master :

            if msg['code'] == BAG_PLAY and cls.processes[msg['path']].status == 2 :
                cmd = path.join(getEnv(), 'rosbag')
                cls.processes[msg['path']] = Bag(msg['path'], cls.on_process_finished)
                cls.processes[msg['path']].play(cmd, msg['options'])
            
            elif msg['code'] == BAG_PLAY and cls.processes[msg['path']].status != 2 :
                message = "Bag already playing."
                self.write_message( json.dumps({ 'code': BAG_ERROR, 'msg': message }) )
            
            elif msg['code'] == BAG_STOP and cls.processes[msg['path']].status == 0 :
                cls.processes[msg['path']].stop()
            
            elif msg['code'] == BAG_STOP and cls.processes[msg['path']].status != 0 :
                message = "Bag already stopped."
                self.write_message( json.dumps({ 'code': BAG_ERROR, 'msg': message }) )
        
        else :
            message = "Master not running."
            self.write_message( json.dumps({ 'code': BAG_ERROR, 'msg': message }) )

    def on_close(self):
        print("[BAG]: close")
        cls = self.__class__
        cls.clients.pop(self.id)
    
    def check_origin(self, origin):
        print("[BAG]: check origin")
        cls = self.__class__
        return True
    
    @classmethod
    def on_process_finished(cls, message):
        for loop, write in cls.clients.values() :
            loop.add_callback(write, message)

        print("[BAG]: stopped")
    
    @classmethod
    def on_master_changes(cls, status):
        cls.master = status
        if not status :
            for proc in cls.processes.values() :
                proc.stop()
