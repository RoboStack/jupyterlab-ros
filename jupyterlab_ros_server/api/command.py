import subprocess
from threading import Thread

class Command(Thread):
    
    def __init__(self, cmd):
        Thread.__init__(self)
        self.cmd = cmd
        self.proc = None
        
    def run(self):
        self.proc = subprocess.Popen(self.cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        out, err = self.proc.communicate()
        print("OUT: ", out)
        print("ERR: ", err)
        
    def stop(self):
        if self.proc != None and self.proc.poll() == None :
            self.proc.terminate()