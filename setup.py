from setuptools import setup, find_packages, Command
from setuptools.command.sdist import sdist
from setuptools.command.build_py import build_py
from setuptools.command.install import install
from setuptools.command.develop import develop
from setuptools.command.egg_info import egg_info
from setuptools.command.bdist_egg import bdist_egg

from subprocess import check_call, PIPE
from distutils import log
import json
import sys
import os

log.set_verbosity(log.INFO)

def js_package_name():
    with open(os.path.join(ROOT_JS, 'package.json')) as f:
        package_json = json.load(f)
    return 'robostack-jupyterlab-ros-%s.tgz' % (package_json['version'])

from jupyter_ros_server._version import __version__
ROOT_PATH = os.path.dirname(os.path.abspath(__file__))
ROOT_JS = os.path.join(ROOT_PATH, 'js')
PUBLIC = os.path.join(ROOT_PATH, 'jupyter_ros_server', 'public')
ZETHUS = os.path.join(ROOT_JS, 'node_modules', 'zethus', 'build', '*')
JS_PACK = os.path.join(ROOT_JS, js_package_name())

def check_js():
    return os.path.exists(JS_PACK)

def register_server_extension():
    try:
        check_call(['jupyter-serverextension', 'enable', '--py', '--sys-prefix', 'jupyter_ros_server'], stdout=sys.stdout, stderr=sys.stderr)
        return True
    except Exception:
        log.error("Error installing the server extension.")
        log.info("\tTry manualy with:")
        log.info("\tjupyter-serverextension enable --py jupyter_ros_server")
        log.info("\tor in conda environments:")
        log.info("\tjupyter-serverextension enable --py --sys-prefix jupyter_ros_server")
        return False

def build_jupyterlab():
    try:
        check_call(['jupyter-lab', 'build'], stdout=sys.stdout, stderr=sys.stderr)
        return True
    except Exception:
        log.error("Error building JupyterLab.")
        log.info("\tTry manualy with:")
        log.info("\tjupyter-lab build")
        return False

class BuildPy(build_py):
    def run(self):
        if not check_js() :
            self.distribution.run_command('jsdeps')

        log.info("\nBuilding python...")
        build_py.run(self)

class EggInfo(egg_info):
    def run(self):
        if not check_js() :
            self.distribution.run_command('jsdeps')

        log.info("\nEggInfo...")
        egg_info.run(self)

class SDist(sdist):
    def run(self):
        if not check_js() :
            self.distribution.run_command('jsdeps')

        log.info("\nSDist...")
        sdist.run(self)

class Develop(develop):
    def run(self):
        log.info("\nBuilding for develop...")
        develop.run(self)

class BdistEggDisabled(bdist_egg):
    """
    Disabled version of bdist_egg
    Prevents setup.py install performing setuptools' default easy_install,
    which it should never ever do.
    """
    def run(self):
        sys.exit("Aborting implicit building of eggs. Use `pip install .` to install from source.")

class NPM(Command):

    def initialize_options(self):
        pass

    def finalize_options(self):
        pass

    def check_npm(self):
        try:
            check_call(['npm', '--version'], stdout=sys.stdout, stderr=sys.stderr)
            log.info("\t+ nodejs installed")
        except Exception:
            log.error("nodejs is not installed.")
            log.info("\ttry: conda install -c conda-forge nodejs=12")
            return False

    def build_js(self):
        try:
            check_call(['npm', 'install'], cwd=ROOT_JS, stdout=sys.stdout, stderr=sys.stderr)
            log.info("\t+ Js dependencies installed.")
        except Exception:
            log.error("Js dependencies not installed.")
            log.info("\tIn js directory try:")
            log.info("\tnpm install")
            return False

        try:
            check_call(['npm', 'pack'], cwd=ROOT_JS, stdout=sys.stdout, stderr=sys.stderr)
            log.info("\t+ Js extension packaged.")
        except Exception:
            log.error("Js extension not packaged.")
            log.info("\tIn js directory try:")
            log.info("\tnpm pack")
            return False

        try:
            check_call(['rm -rf ' + PUBLIC], shell=True, stdout=sys.stdout, stderr=sys.stderr)
            check_call(['mkdir -p ' + PUBLIC], shell=True, stdout=sys.stdout, stderr=sys.stderr)
            log.info("\t+ Public folder cleaned.")
        except Exception:
            log.error("Public folder not cleaned.")
            log.info("\tTry to remove everything inside of jupyter_ros_server/public")
            return False

        try:
            check_call(['cp -r ' + ZETHUS + ' ' + PUBLIC], shell=True, stdout=sys.stdout, stderr=sys.stderr)
            log.info("\t+ Zethus installed.")
        except Exception:
            log.error("Zethus not installed.")
            log.info("\tTry to move Zethus from js/node_modules/zethus/build to jupyter_ros_server/public")
            return False

        return True

    def run(self):
        log.info("\nBuilding js extension...")
        if not self.build_js() :
            exit(1)

setup_args = {
    'name': "jupyter_ros_server",
    'version': __version__,
    'description': "Jupyterlab server extension for ROS.",
    'author': "QuantStack",
    'license': "BSD-3-Clause",
    'url': "https://github.com/RoboStack/jupyterlab-ros",
    'include_package_data': True,
    'packages': find_packages(),
    'package_data': {
        'jupyter_ros_server': [
            'static/*',
            'public/*'
        ]
    },
    'data_files': [
        (
            'etc/jupyter/jupyter_notebook_config.d',
            ['jupyter_ros_server/jupyter_ros_server.json']
        ),
        ('share/jupyter/lab/extensions', ['js/' + js_package_name()])
    ],
    'cmdclass': {
        'jsdeps': NPM,
        'build_py': BuildPy,
        'egg_info': EggInfo,
        'sdist': SDist,
        'develop': develop,
        'bdist_egg': bdist_egg if 'bdist_egg' in sys.argv else BdistEggDisabled
    },
    'install_requires': [
        'rosbridge-library',
        'rosbridge-server',
        'rosmaster',
        'roslaunch',
        'rosgraph',
        'rosbag',
        'rosapi',
        'rospy'
    ],
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
    log.info("------------------------------------------------------")
    log.info("INSTALLING JUPYTER-ROS-SERVER")

    setup(**setup_args)

    log.info("Installed succesfuly")
    log.info("------------------------------------------------------")