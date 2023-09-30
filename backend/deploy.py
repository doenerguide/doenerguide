# a script, that pulls the latest version of the backend from github

import os
import subprocess

# change to the /mnt/web310/b1/02/512442602/htdocs/doenerguide directory
os.chdir("/mnt/web310/b1/02/512442602/htdocs/doenerguide")

# pull the latest version from github
subprocess.call(["git", "pull"])