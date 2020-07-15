import re
import uuid
import json
from os import path

import asyncio
import subprocess
from threading import Thread

from tornado.ioloop import IOLoop
from tornado.gen import coroutine
from tornado.websocket import WebSocketHandler

from ..lib import getEnv, getMaster

class Master(WebSocketHandler):
    status = False
    thread = None
    proc = None
    clients = {}

    bridge_master_changes = None
    launch_master_changes = None

    def open(self):
        print("[MASTER]: open")
        cls = self.__class__
        self.id = str(uuid.uuid4())
        cls.clients[self.id] = (IOLoop.current(), self.write_message)

        self.write_message( json.dumps({ 'status': cls.status }) )

    def on_message(self, message):
        #print("[MASTER]: message, ", message)
        cls = self.__class__
        msg = json.loads(message)

        if msg['cmd'] == "start" and cls.proc == None :
            print("[MASTER]: starting")
            cls.thread = Thread(target=cls.run, args=([path.join(getEnv(), 'roslaunch'), getMaster()],))
            cls.thread.daemon = True
            cls.thread.start()
            
        elif msg['cmd'] == "stop" and cls.proc != None:
            print("[MASTER]: stopping")
            if cls.proc.poll() == None :
                cls.proc.terminate()
            

    def on_close(self):
        print("[MASTER]: close")
        cls = self.__class__
        cls.clients.pop(self.id)
    
    def check_origin(self, origin):
        print("[MASTER]: check origin")
        return True
    
    @classmethod
    def run(cls, command):
        asyncio.set_event_loop(asyncio.new_event_loop())
        cls.proc = subprocess.Popen(command, stdout=subprocess.PIPE, stderr=subprocess.PIPE,  universal_newlines=True)
        cls.status = True

        for loop, write in cls.clients.values() :
            loop.add_callback(write, json.dumps({ 'status': cls.status }) )
        
        cls.bridge_master_changes(cls.status)
        cls.launch_master_changes(cls.status)

        print("[MASTER]: running")

        out, err = cls.proc.communicate()
        cls.proc = None

        print("[MASTER]: stopped")
        msg = ''.join( re.split(r'\x1b]2;.*?\x07', (err if err else out))  )

        cls.status = False
        if err :
            for loop, write in cls.clients.values() :
                loop.add_callback(write, json.dumps({ 'status': cls.status, 'error': msg }) )
                cls.bridge_master_changes(cls.status)
                cls.launch_master_changes(cls.status)
            
        else :
            for loop, write in cls.clients.values() :
                loop.add_callback(write, json.dumps({ 'status': cls.status, 'output': msg }) )
                cls.bridge_master_changes(cls.status)
                cls.launch_master_changes(cls.status)
        