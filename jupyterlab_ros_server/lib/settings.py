from os import path
import json

ROOT = path.dirname(path.dirname(__file__))
PUBLIC = path.join(ROOT, 'public')
SETTINGS = path.join(ROOT, 'static/settings.json')
MASTER = path.join(ROOT, 'static/roslab.launch')

def getEnv():
    try:
        with open(SETTINGS) as settings:
            data = json.load(settings)

    except Exception :
        data = { "env": "", "master": "" }

    return data['env']

def getMaster():
    try:
        with open(SETTINGS) as settings:
            data = json.load(settings)
    
    except Exception :
        data = { "env": "", "master": "" }

    return data['master'] if data['master'] != "" else MASTER

def save(env, master):
    try:
        with open(SETTINGS, 'r') as settings:
            data = json.load(settings)
    
    except Exception :
        data = { "env": "", "master": "" }
    
    data['env'] = env
    data['master'] = master

    with open(SETTINGS, 'w+') as settings:
        json.dump(data, settings)

save("", "")