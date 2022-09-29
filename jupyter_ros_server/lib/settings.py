from os import path,environ
import json
from tkinter import W

ROOT = path.dirname(path.dirname(__file__))
PUBLIC = path.join(ROOT, 'public')
SETTINGS = path.join(ROOT, 'static/settings.json')
MASTER = path.join(ROOT, 'static/roslab.launch')
ROS_PACKAGE_PATH = environ.get("ROS_PACKAGE_PATH", default="").strip()


def getEnv():
    try:
        with open(SETTINGS) as settings:
            data = json.load(settings)

    except Exception :
        data = { "env": "", "master": "", "workspaces": ""}

    return data['env']

def getWorkspaces():
    try:
        with open(SETTINGS) as settings:
            data = json.load(settings)

    except Exception :
        data = { "env": "", "master": "", "workspaces": ""}

    return data['workspaces'] if data['workspaces'] != "" else ROS_PACKAGE_PATH


def getMaster():
    try:
        with open(SETTINGS) as settings:
            data = json.load(settings)
    
    except Exception :
        data = { "env": "", "master": "", "workspaces": ""}

    return data['master'] if data['master'] != "" else MASTER

def save(env, master, workspaces):
    try:
        with open(SETTINGS, 'r') as settings:
            data = json.load(settings)
    
    except Exception :
        data = { "env": "", "master": "" , "workspaces": ""}
    
    data['env'] = env
    data['master'] = master
    data['workspaces'] = workspaces

    with open(SETTINGS, 'w+') as settings:
        json.dump(data, settings)

save("", "", ROS_PACKAGE_PATH)