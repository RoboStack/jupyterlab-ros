import sys
sys.path.append("/home/ubuntu/projects/ros/catkin_ws/devel/lib/python3/dist-packages")
from niryo_one_python_api.niryo_one_api import *
import rospy
import time

rospy.init_node('niryo_one_example_python_api')

n = NiryoOne()
x = n.get_joints()

print(n.get_joints())

x[2] += 0.1
n.move_joints(x)