import rospy
import bson
from tornado.websocket import WebSocketHandler
from tornado.escape import json_decode

class RosBridge(WebSocketHandler):
    cont = 0

    def __new__(cls):
        rospy.init_node("rosbridge")

    def open(self):
        print("FE: Connection opened {}".format(self.cont))
        self.cont += 1

    def on_message(self, message):
        print("FE: New message.")
        msg = json_decode(message)
        print(msg)
        
        #if (msg.get('op', None) == "advertise") :
        #    self.pub = rospy.Publisher(msg.get('topic', None), msg.get('type', None), msg.get('queue_size', None))
        #
        #elif (msg.get('op', None) == "publish") :
        #    self.pub.publish(msg.get('msg', None))

    def on_close(self):
        print("FE: Connection close.")