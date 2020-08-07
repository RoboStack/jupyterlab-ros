import re
import json
import asyncio
import subprocess
from threading import Thread
from unicodedata import normalize

class Process(Thread):

    def __init__(self, cmd, finished):
        super(Process, self).__init__()

        self.cmd = cmd
        self.proc = None
        self.finished = finished
        self.daemon = True
    
    def stop(self):
        if self.proc != None and self.proc.poll() == None :
            self.proc.terminate()
    
    def run(self):
        asyncio.set_event_loop(asyncio.new_event_loop())
        self.proc = subprocess.Popen(self.cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, universal_newlines=True)

        out, err = self.proc.communicate()
        self.proc = None
        
        msg = ''.join( re.split(r'\x1b]2;.*?\x07', (err if err else out))  )
        code = 4 if err else 3
        message = json.dumps({ "code": code, "path": self.cmd[1], "msg": msg }) 
        self.finished(self.cmd[1], message)