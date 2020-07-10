from setuptools import setup, find_packages, Command
from subprocess import check_call
from distutils import log
import os

from jupyterlab_ros_server._version import __version__

DEV = os.environ.get('JUPYTERLAB-ROS-DEV', None )
ROOT_PATH = os.path.dirname(os.path.abspath(__file__))

log.debug("Version: ", __version__)
log.debug("DEV: ", DEV)
log.debug("Path: ", ROOT_PATH)

def data_files():
    if DEV :
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

def check_npm():
        try:
            check_call(['npm', '--version'])
            return True
        except Exception:
            return False

def check_lab():
    try:
        check_call(['jupyter-lab', '--version'])
        return True
    except Exception:
        return False

def check_rosmaster():
    try:
        check_call(['rosstack', 'find', 'rosmaster'])
        return True
    except Exception:
        return False

def check_rosbridge():
    try:
        check_call(['rosstack', 'find', 'rosbridge_suite'])
        return True
    except Exception:
        return False

def check_rospy():
    try:
        check_call(['rosstack', 'find', 'rospy'])
        return True
    except Exception:
        return False

def check_rosauth():
    try:
        check_call(['rosstack', 'find', 'rosauth'])
        return True
    except Exception:
        return False

def register_server_extension():
    try:
        check_call(['jupyter-serverextension', 'enable', '--py', '--sys-prefix', 'jupyterlab_ros_server'])
        return True
    except Exception:
        return False

def build_jupyterlab():
    try:
        check_call(['jupyter-lab', 'build'])
        return True
    except Exception:
        return False

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

    if DEV :
        setup(**setup_args)
        exit(0)

    log.info("INSTALLING JUPYTERLAB-ROS")
    log.info("-------------------------")
    log.info("\nChecking dependencies...")

    if not check_npm() :
        log.error("nodejs is not installed.")
        log.info("\ttry: conda install -c conda-forge nodejs=12")
        exit(1)

    if not check_lab() :
        log.error("JupyterLab is not installed.")
        log.info("\ttry: conda install -c conda-forge jupyterlab")
        exit(1)
    
    log.info("\t+ JupyterLab installed")
    
    if not check_rosmaster() :
        log.error("rosmaster is not installed.")
        log.info("\ttry: conda install -c conda-forge robostack ros-melodic-ros-core")
        exit(1)
    
    log.info("\t+ rosmaster installed")
    
    if not check_rosbridge() :
        log.error("rosbridge_suite is not installed.")
        log.info("\ttry: conda install -c conda-forge robostack ros-melodic-rosbridge-suite'")
        exit(1)
    
    log.info("\t+ rosbridge_suite installed")

    if not check_rospy() :
        log.error("rospy is not installed.")
        log.info("\ttry: conda install -c conda-forge robostack ros-melodic-rospy")
        exit(1)
    
    log.info("\t+ rospy installed")

    if not check_rosauth() :
        log.error("rosauth is not installed.")
        log.info("\ttry: conda install -c conda-forge robostack ros-melodic-rosauth")
        exit(1)

    log.info("\t+ rosauth installed")
    
    log.info("\nInstalling the extension...")
    setup(**setup_args)

    log.info("\nInstalling server extension...")
    if not register_server_extension() :
        log.error("Error installing the server extension.")
        log.info("\tTry manualy with:")
        log.info("\tjupyter-serverextension enable --py jupyterlab_ros_server")
        log.info("\tor in conda environments:")
        log.info("\tjupyter-serverextension enable --py --sys-prefix jupyterlab_ros_server")
        exit(1)

    log.info("\nBuilding JupyterLab...")
    if not build_jupyterlab() :
        log.error("Error building JupyterLab.")
        log.info("\tTry manualy with:")
        log.info("\tjupyter-lab build")
        exit(1)