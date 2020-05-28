from setuptools import setup, find_packages

setup_args = {
    'name': "jupyterlab_ros_server",
    'version': "0.1.0",
    'description': "Jupyterlab server extension for ROS.",
    'long_description': "Jupyterlab server extension for ROS.",
    'author': "QuantStack",
    'license': "BSD-3-Clause",
    'url': "https://github.com/RoboStack/jupyterlab-ros",
    'include_package_data': True,
    'packages': find_packages(),
    'data_files': [
        (
            '/home/carlos/miniconda3/envs/jupyterlab/etc/jupyter/jupyter_notebook_config.d/',
            ['jupyterlab_ros_server/jupyterlab_ros_server.json']
        )
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

if __name__ == '__main__':
    setup(**setup_args)