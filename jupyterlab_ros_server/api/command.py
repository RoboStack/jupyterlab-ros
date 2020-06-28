import subprocess

class Command():
    
    def __init__(self, cmd):
        self.cmd = cmd
        self.proc = None
    
    def start(self):
        print("starting")
        self.proc = subprocess.Popen(self.cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        print("started")
    
    def stop(self):
        print("killing")
        if self.proc != None and self.proc.poll() == None :
            self.proc.terminate()
            print("killed")