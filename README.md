# jupyterlab-ros

A JupyterLab extension for ROS.

[![Binder](https://mybinder.org/badge_logo.svg)](https://mybinder.org/v2/gh/RoboStack/jupyterlab-ros/master?urlpath=lab/tree/examples)

### Install

We recommend following the installation instructions of the [RoboStack](https://github.com/RoboStack/ros-noetic) repository which enables you to install ROS Noetic in a conda environment. After following these instructions, simply

```bash
conda activate robostackenv
mamba install jupyterlab-ros nodejs=12
```

### How to use?

Please see the [examples](./examples) folder for some tutorials and examples how to use jupyterlab-ros. These require the following ROS packages:
```bash
mamba install ros-noetic-ros-core ros-noetic-rospy ros-noetic-rosbridge-suite ros-noetic-rosbag ros-noetic-rosauth ros-noetic-tf2-web-republisher ros-noetic-franka-ros ros-noetic-interactive-marker-tutorials ros-noetic-teb-local-planner ros-noetic-turtlebot3 ros-noetic-turtlebot3-fake
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
python -m pip install -e .

# Link your development version of the extension with JupyterLab
jupyter-labextension develop . --overwrite
```

You can watch the source directory and run JupyterLab in watch mode to watch for changes in the extension's source and automatically rebuild the extension and application.

```bash
# Watch the source directory in another terminal tab
jlpm watch
# Run jupyterlab in watch mode in one terminal tab
jupyter-lab
```

### Uninstall

```bash
# Uninstalling the frontend extension
jupyter-labextension uninstall @robostack/jupyterlab-ros

# Uninstalling the server extension
pip uninstall jupyter_ros_server

# Cleaning jupyterlab
jupyter lab clean
jupyter lab build
```
