from setuptools import setup, find_packages
from setuptools.command.develop import develop
from setuptools.command.install import install
from subprocess import check_call
from distutils import log
import sys
import os

from jupyterlab_ros_server._version import __version__
ROOT_PATH = os.path.dirname(os.path.abspath(__file__))
DEVELOP = False

print("Version: ", __version__)
print("DEVELOP: ", DEVELOP)
print("Path: ", ROOT_PATH)

def data_files():
    if not DEVELOP :
        return [
            (
                'etc/jupyter/jupyter_notebook_config.d',
                ['jupyterlab_ros_server/jupyterlab_ros_server.json']
            ),
            (
                'share/jupyter/lab/extensions',
                ['js/jupyterlab-ros-0.1.0.tgz']
            )
        ]
    
    else :
        return [
            (
                'etc/jupyter/jupyter_notebook_config.d',
                ['jupyterlab_ros_server/jupyterlab_ros_server.json']
            )
        ]

class Develop(develop):
    def run(self):
        develop.run(self)

class Install(install):

    def check_npm(self):
            try:
                check_call(['npm', '--version'])
                return True
            except Exception:
                return False

    def check_lab(self):
        try:
            check_call(['jupyter-lab', '--version'])
            return True
        except Exception:
            return False

    def check_rosmaster(self):
        try:
            check_call(['rosstack', 'find', 'rosmaster'])
            return True
        except Exception:
            return False

    def check_rosbridge(self):
        try:
            check_call(['rosstack', 'find', 'rosbridge_suite'])
            return True
        except Exception:
            return False

    def check_rospy(self):
        try:
            check_call(['rosstack', 'find', 'rospy'])
            return True
        except Exception:
            return False

    def check_rosauth(self):
        try:
            check_call(['rosstack', 'find', 'rosauth'])
            return True
        except Exception:
            return False

    def register_server_extension(self):
        try:
            check_call(['jupyter-serverextension', 'enable', '--py', '--sys-prefix', 'jupyterlab_ros_server'])
            return True
        except Exception:
            return False

    def build_jupyterlab(self):
        try:
            check_call(['jupyter-lab', 'build'])
            return True
        except Exception:
            return False
    
    def run(self):
        print("------------------------------------------------------")
        print("INSTALLING JUPYTERLAB-ROS")
        print("\nChecking dependencies...")

        if not self.check_npm() :
            log.error("nodejs is not installed.")
            log.info("\ttry: conda install -c conda-forge nodejs=12")
            exit(1)

        print("\t+ nodejs installed")

        if not self.check_lab() :
            log.error("JupyterLab is not installed.")
            log.info("\ttry: conda install -c conda-forge jupyterlab")
            exit(1)
        
        print("\t+ JupyterLab installed")
        
        if not self.check_rosmaster() :
            log.error("rosmaster is not installed.")
            log.info("\ttry: conda install -c conda-forge robostack ros-melodic-ros-core")
            exit(1)
        
        print("\t+ rosmaster installed")
        
        if not self.check_rosbridge() :
            log.error("rosbridge_suite is not installed.")
            log.info("\ttry: conda install -c conda-forge robostack ros-melodic-rosbridge-suite'")
            exit(1)
        
        print("\t+ rosbridge_suite installed")

        if not self.check_rospy() :
            log.error("rospy is not installed.")
            log.info("\ttry: conda install -c conda-forge robostack ros-melodic-rospy")
            exit(1)
        
        print("\t+ rospy installed")

        if not self.check_rosauth() :
            log.error("rosauth is not installed.")
            log.info("\ttry: conda install -c conda-forge robostack ros-melodic-rosauth")
            exit(1)

        print("\t+ rosauth installed")
        
        print("\nInstalling the extension...")
        install.run(self)

        print("\nInstalling server extension...")
        if not self.register_server_extension() :
            log.error("Error installing the server extension.")
            log.info("\tTry manualy with:")
            log.info("\tjupyter-serverextension enable --py jupyterlab_ros_server")
            log.info("\tor in conda environments:")
            log.info("\tjupyter-serverextension enable --py --sys-prefix jupyterlab_ros_server")
            exit(1)

        print("\nBuilding JupyterLab...")
        if not self.build_jupyterlab() :
            log.error("Error building JupyterLab.")
            log.info("\tTry manualy with:")
            log.info("\tjupyter-lab build")
            exit(1)
        
        print("Installed succesfuly")
        print("------------------------------------------------------")

setup_args = {
    'name': "jupyterlab_ros_server",
    'version': __version__,
    'description': "Jupyterlab server extension for ROS.",
    'author': "QuantStack",
    'license': "BSD-3-Clause",
    'url': "https://github.com/RoboStack/jupyterlab-ros",
    'include_package_data': True,
    'packages': find_packages(),
    'data_files': data_files(),
    'cmdclass': {
        'develop': Develop,
        'install': Install,
    },
    'keywords': [
        'jupyter',
        'jupyterlab',
        'ROS',
    ],
    'classifiers': [
        "License :: OSI Approved :: BSD License",
        "Programming Language :: Python :: 3",
        "Programming Language :: Python :: 3.5",
        "Programming Language :: Python :: 3.6",
        "Programming Language :: Python :: 3.7",
        "Programming Language :: Python :: 3.8",
    ],
}

if __name__ == '__main__' :

    print("args: ", sys.argv)

    if '-e' in sys.argv :
        DEVELOP = True
        print("develop: ", DEVELOP)
        exit(0)

    setup(**setup_args)