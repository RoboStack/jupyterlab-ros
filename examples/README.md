# JupyterLab-ROS Examples

These are some exaples you can try in JupyterLab-ROS. To use these notebooks you need to install some ROS packages and libraries.

> NOTE: If you are trying the extension on Binder all these packages and libraries are already installed.

## ROS Packages

```bash
mamba install -c conda-forge -c robostack ros-melodic-franka-ros ros-melodic-interactive-marker-tutorials ros-melodic-teb-local-planner ros-melodic-turtlebot3 ros-melodic-turtlebot3-fake
```

## Jupyros

```bash
mamba install -c conda-forge bqplot ipympl ipywidgets
jupyter labextension install bqplot
jupyter labextension install @jupyter-widgets/jupyterlab-manager

pip install ipyvuetify
jupyter labextension install jupyter-vuetify

pip install jupyros

jupyter-lab build --dev-build=False
```

## Troubleshooting

To use the `turtlebot3_teleop` package you need to the program from python2 to python3.

```bash
2to3 -w "$CONDA_PREFIX/lib/turtlebot3_teleop/turtlebot3_teleop_key"
```