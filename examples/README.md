# jupyterlab-ros Examples

A JupyterLab extension for ROS.

## Requirements

2to3 -w "$CONDA_ENV/lib/turtlebot3_teleop/turtlebot3_teleop_key"


```bash
mamba install -c conda-forge -c robostack ros-melodic-franka-ros ros-melodic-interactive-marker-tutorials ros-melodic-teb-local-planner 
ros-melodic-turtlebot3 ros-melodic-turtlebot3-fake

mamba install -c conda-forge ipympl bqplot ipywidgets

jupyter labextension install bqplot
jupyter labextension install @jupyter-widgets/jupyterlab-manager

pip install ipyvuetify
jupyter labextension install jupyter-vuetify

pip install jupyros

jupyter-lab build --dev-build=False
```