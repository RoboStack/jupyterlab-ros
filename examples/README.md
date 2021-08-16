# JupyterLab-ROS Examples

These are some examples you can try in JupyterLab-ROS. To use these notebooks you need to install some ROS packages and libraries.

> NOTE: If you are trying the extension on Binder all these packages and libraries are already installed.

## ROS Packages

```bash
mamba install -c conda-forge -c robostack ros-melodic-franka-ros ros-melodic-interactive-marker-tutorials ros-melodic-teb-local-planner ros-melodic-turtlebot3 ros-melodic-turtlebot3-fake
```

## Jupyros

```bash
mamba install -c conda-forge bqplot ipympl ipywidgets

# Probably ipyvuetify doen't support lab 3
pip install ipyvuetify

# Workin on jupyros update to lab 3
git clone https://github.com/hbcarlos/jupyter-ros.git
cd jupyter-ros
pip install .

jupyter-lab build --dev-build=False
```

## Troubleshooting

To use the `turtlebot3_teleop` package you need to  from python2 to python3.

```bash
2to3 -w "$CONDA_PREFIX/lib/turtlebot3_teleop/turtlebot3_teleop_key"

ln -s "$CONDA_PREFIX/lib/libPocoFoundation.so.71" "$CONDA_PREFIX/lib/libPocoFoundation.so.60"
```
