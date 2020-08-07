# jupyterlab-ros

A JupyterLab extension for ROS.

[![Binder](https://mybinder.org/badge_logo.svg)](https://mybinder.org/v2/gh/RoboStack/jupyterlab-ros/master?urlpath=lab/tree/examples)

## Requirements

* python >= 3.6
* JupyterLab >= 2.0
* npm >= 6.13.4
* ROS
    * ros-melodic-ros-core
    * ros-melodic-rospy
    * ros-melodic-rosbridge-suite
    * ros-melodic-rosbag
    * ros-melodic-rosauth
    * ros-melodic-tf2-web-republisher

## Install

```bash
# Create a new environment with the dependencies
mamba create -n test -c conda-forge -c robostack python=3.6 nodejs=12 jupyterlab ros-melodic-ros-core ros-melodic-rosauth ros-melodic-rospy ros-melodic-rosbridge-suite ros-melodic-rosbag ros-melodic-tf2-web-republisher

conda activate test

# Install the extension
pip install jupyter-ros-server
```

## Contributing

### Install

The `jlpm` command is JupyterLab's pinned version of
[yarn](https://yarnpkg.com/) that is installed with JupyterLab. You may use
`yarn` or `npm` in lieu of `jlpm` below.

```bash
# Clone the repo to your local environment
git clone https://github.com/RoboStack/jupyterlab-ros.git
# Move to jupyterlab-ros directory
cd jupyterlab-ros

# Install server extension in editable mode
pip install -e .
# Register server extension
jupyter-serverextension enable --py --sys-prefix jupyter_ros_server

# Move to js folder
cd js/
# Link your development version of the extension with JupyterLab
jupyter-labextension link .
```

You can watch the source directory and run JupyterLab in watch mode to watch for changes in the extension's source and automatically rebuild the extension and application.

```bash
# Watch the source directory in another terminal tab
jlpm watch
# Run jupyterlab in watch mode in one terminal tab
jupyter-lab --no-browser --ip=192.168.64.6 --watch
```

### Uninstall

```bash
# Uninstalling the frontend extension
jupyter-labextension unlink @robostack/jupyterlab-ros
jupyter-labextension uninstall @robostack/jupyterlab-ros

# Uninstalling the server extension
jupyter-serverextension disable jupyter_ros_server
pip uninstall jupyter_ros_server

# Cleaning jupyterlab
jupyter lab clean
jupyter lab build
```