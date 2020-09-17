conda create -n test -c conda-forge -c robostack python=3.6 nodejs=12 jupyterlab ipympl bqplot ipywidgets voila jupyter_conda ros-melodic-ros-core ros-melodic-rosauth ros-melodic-rospy ros-melodic-rosbridge-suite ros-melodic-rosbag ros-melodic-tf2-web-republisher ros-melodic-franka-ros ros-melodic-interactive-marker-tutorials ros-melodic-teb-local-planner ros-melodic-turtlebot3 ros-melodic-turtlebot3-fake


- ipympl
- bqplot
- ipywidgets

jupyter labextension install bqplot
jupyter labextension install @jupyter-widgets/jupyterlab-manager

pip install ipyvuetify
jupyter labextension install jupyter-vuetify

git clone https://github.com/hbcarlos/jupyter-ros.git
cd jupyter-ros
pip install .
jupyter nbextension enable --py --sys-prefix jupyros
jupyter labextension install jupyter-ros

jupyter-lab build --dev-build=False

conda config --add channels robostack

2to3 -w "$CONDA_PREFIX/lib/turtlebot3_teleop/turtlebot3_teleop_key"
sudo ln -s "$CONDA_PREFIX/lib/libPocoFoundation.so.71" "$CONDA_PREFIX/lib/libPocoFoundation.so.60"