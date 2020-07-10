# jupyterlab-ros

A JupyterLab extension.


## Requirements

* JupyterLab >= 2.0
* ROS
    * ros-melodic-ros-core
    * ros-melodic-rospy
    * ros-melodic-rosbridge-suite
    * ros-melodic-rosbag
    * ros-melodic-rosauth

## Install

```bash
conda config --add channels conda-forge
conda create -n lab -c conda-forge python=3.6 nodejs=12 jupyterlab
conda activate lab
conda install -c robostack ros-melodic-ros-core ros-melodic-rospy ros-melodic-rosbridge-suite ros-melodic-rosbag ros-melodic-rosauth

pip install -e .
```

## Contributing

### Install

The `jlpm` command is JupyterLab's pinned version of
[yarn](https://yarnpkg.com/) that is installed with JupyterLab. You may use
`yarn` or `npm` in lieu of `jlpm` below.

```bash
# Clone the repo to your local environment
# Move to jupyterlab-ros directory

# Install server extension in editable mode
JUPYTERLAB-ROS-DEV=1 pip install -e .
# Register server extension
jupyter-serverextension enable --py jupyterlab_ros_server
# or if using conda env
jupyter-serverextension enable --py --sys-prefix jupyterlab_ros_server

# Install frontend extension dependencies
jlpm
# Build Typescript frontend source
jlpm build
# Link your development version of the extension with JupyterLab
jupyter-labextension link .
```

You can watch the source directory and run JupyterLab in watch mode to watch for changes in the extension's source and automatically rebuild the extension and application.

```bash
# Watch the source directory in another terminal tab
jlpm watch
# Run jupyterlab in watch mode in one terminal tab
jupyter-lab --watch
jupyter-lab --allow-root  --no-browser --ip=0.0.0.0 --port=8888 --watch
```

### Uninstall

```bash
# Uninstalling the frontend extension
jupyter-labextension uninstall jupyterlab-ros

# Uninstalling the server extension
jupyter-serverextension disable jupyterlab_ros_server
pip uninstall jupyterlab_ros_server

# Cleaning jupyterlab
jupyter lab clean
jupyter lab build

# If you only have jupyterlab_ros_server extension then remove the following file
rm /home/carlos/miniconda3/envs/jupyterlab-ros/etc/jupyter/jupyter_notebook_config.json
rm /home/carlos/miniconda3/envs/jupyterlab-ros/share/jupyter/lab/staging/
```
