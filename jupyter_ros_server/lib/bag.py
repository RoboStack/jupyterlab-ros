import re
import json
import asyncio
import subprocess
from threading import Thread
from datetime import datetime

import rosbag

STATUS_PLAY = 0
STATUS_RECORD = 1
STATUS_STOP = 2
STATUS_ERROR = -1

class Bag(Thread):

    def __init__(self, path, finished):
        super(Bag, self).__init__()

        self.status = STATUS_STOP
        self.path = path
        self.cmd = None
        self.proc = None
        self.finished = finished
        self.daemon = True
    
    def info(self):
        bag = rosbag.Bag(self.path, mode='r', allow_unindexed=True)
        start = datetime.utcfromtimestamp( bag.get_start_time() )
        end = datetime.utcfromtimestamp( bag.get_end_time() )
        types, topics = bag.get_type_and_topic_info()

        return {
            'path': bag.filename,
            'version': float(bag.version) / 100,
            'start': str(start),
            'end': str(end),
            'duration': str(end - start),
            'size': str(round(bag.size / 1048576.0, 2)) + " MB",
            'messages': bag.get_message_count(),
            'compression': bag.compression,
            'types': types,
            'topics': topics,
        }
    
    def play(self, cmd, options):
        self.cmd = " ".join([cmd, 'play', options, self.path])
        self.start()
        self.status = STATUS_PLAY
    
    def record(self, cmd, options):
        self.cmd = " ".join([cmd, 'record', options, self.path])
        self.start()
        self.status = STATUS_RECORD
    
    def stop(self):
        if self.proc != None:
            self.proc.terminate()
    
    def run(self):
        asyncio.set_event_loop(asyncio.new_event_loop())
        self.proc = subprocess.Popen(self.cmd, shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE, universal_newlines=True)

        _, err = self.proc.communicate()
        self.proc = None
        
        self.status = STATUS_ERROR if err else STATUS_STOP
        msg = ''.join( re.split(r'\x1b]2;.*?\x07', err) )
        self.finished( json.dumps({ 'code': 2, 'status': self.status, 'msg': msg }) )