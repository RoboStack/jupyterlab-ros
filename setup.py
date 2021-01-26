from os import path

from jupyter_packaging import (
    create_cmdclass, install_npm, ensure_targets,
    combine_commands, ensure_python,
    get_version
)

from setuptools import setup, find_packages

name = 'jupyter_ros_server'
ext_name = '@robostack/jupyterlab-ros'

# Ensure a valid python version
ensure_python('>=3.6')

# Get our version
version = get_version(path.join(name, '_version.py'))

HERE = path.dirname(path.abspath(__file__))
lab_path = path.join(HERE, name, 'labextension')
ext_path = path.join(HERE, 'js')
public_path = path.join(HERE, 'jupyter_ros_server', 'public')
zethus_path = path.join(lab_path, 'node_modules', 'zethus', 'build', '*')


cmdclass = create_cmdclass(
    'js',
    package_data_spec = {
        name: [
            'static/*',
            'public/*',
            'public/forklift/*',
            'public/image/viz/*',
            'labextension/*'
        ]
    },
    data_files_spec = [
        ("share/jupyter/labextensions/" + ext_name, lab_path, "**"),
        ('etc/jupyter/jupyter_notebook_config.d', name, 'jupyter_ros_server.json')
    ]
)

cmdclass['js'] = combine_commands(
    install_npm(
        path=ext_path,
        npm=["jlpm"],
        build_cmd="build:labextension",
        build_dir=path.join(ext_path, 'build'),
        source_dir=path.join(ext_path, 'src')
    ),
    # Representative files that should exist after a successful build
    ensure_targets([
        path.join(lab_path, 'package.json'),
    ]),
)

setup_args = {
    'name': name,
    'version': version,
    'description': "Jupyterlab server extension for ROS.",
    'author': "QuantStack",
    'license': "BSD-3-Clause",
    'url': "https://github.com/RoboStack/jupyterlab-ros",
    'include_package_data': True,
    'packages': find_packages(),
    'cmdclass': cmdclass,
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
    setup(**setup_args)