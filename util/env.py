import bios
from os import environ
from os import path

if path.exists("env.yaml"):
    variables = bios.read('env.yaml')
    for key in variables.keys():
        environ[key] = variables[key]
